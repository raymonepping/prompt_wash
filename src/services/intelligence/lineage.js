import { loadLineageRecord } from "../lineage/storage.js";
import { loadAllExecutionArtifacts } from "../execution/storage.js";
import { evaluateRunArtifact } from "../evaluation/evaluate.js";

function buildNodeMap(record) {
  return new Map(record.nodes.map((node) => [node.id, node]));
}

function computeDepth(nodeId, nodeMap, cache = new Map()) {
  if (cache.has(nodeId)) {
    return cache.get(nodeId);
  }

  const node = nodeMap.get(nodeId);
  if (!node) {
    return 0;
  }

  if (node.parent === null) {
    cache.set(nodeId, 0);
    return 0;
  }

  const depth = computeDepth(node.parent, nodeMap, cache) + 1;
  cache.set(nodeId, depth);
  return depth;
}

function groupNodesByDepth(record) {
  const nodeMap = buildNodeMap(record);
  const cache = new Map();
  const groups = new Map();

  for (const node of record.nodes) {
    const depth = computeDepth(node.id, nodeMap, cache);

    if (!groups.has(depth)) {
      groups.set(depth, []);
    }

    groups.get(depth).push(node.id);
  }

  return [...groups.entries()]
    .sort((left, right) => left[0] - right[0])
    .map(([depth, nodes]) => ({
      depth,
      count: nodes.length,
      nodes: nodes.sort(),
    }));
}

function getLatestNode(record) {
  return (
    [...record.nodes].sort((left, right) =>
      right.created_at.localeCompare(left.created_at),
    )[0] ?? null
  );
}

function detectOptimizedNodes(record) {
  return record.nodes.filter(
    (node) =>
      /compact|optimized|optimize/i.test(node.artifact) ||
      /compact|optimized|optimize/i.test(node.label ?? "") ||
      /compact|optimized|optimize/i.test(node.notes ?? ""),
  );
}

function normalizePath(value) {
  return typeof value === "string" ? value.trim() : "";
}

function matchRunsToNode(node, runArtifacts, family) {
  const matched = [];

  for (const artifact of runArtifacts) {
    const lineage = artifact.source?.lineage ?? null;
    const sourcePath = normalizePath(artifact.source?.path ?? "");
    const nodeArtifactPath = normalizePath(node.artifact ?? "");
    const fingerprint = artifact.prompt?.fingerprint ?? null;

    const matchedByLineage =
      lineage && lineage.family === family && lineage.node_id === node.id;

    const matchedByPath =
      sourcePath && nodeArtifactPath && sourcePath === nodeArtifactPath;

    const matchedByFingerprint =
      node.fingerprint && fingerprint && node.fingerprint === fingerprint;

    if (matchedByLineage || matchedByPath || matchedByFingerprint) {
      matched.push({
        run_id: artifact.run_id,
        matched_by: matchedByLineage
          ? "lineage"
          : matchedByPath
            ? "path"
            : "fingerprint",
        artifact,
      });
    }
  }

  return matched;
}

function summarizeCoverage(record, runArtifacts) {
  const covered = [];
  const uncovered = [];

  for (const node of record.nodes) {
    const matches = matchRunsToNode(node, runArtifacts, record.family);

    if (matches.length > 0) {
      covered.push({
        node_id: node.id,
        fingerprint: node.fingerprint ?? null,
        runs: matches.map((item) => item.run_id),
        matched_by: [...new Set(matches.map((item) => item.matched_by))],
      });
    } else {
      uncovered.push({
        node_id: node.id,
        fingerprint: node.fingerprint ?? null,
      });
    }
  }

  return {
    covered_count: covered.length,
    uncovered_count: uncovered.length,
    covered,
    uncovered,
  };
}

function findBestEvaluatedNode(record, runArtifacts) {
  let best = null;

  for (const node of record.nodes) {
    const matches = matchRunsToNode(node, runArtifacts, record.family);

    for (const match of matches) {
      const evaluation = evaluateRunArtifact(match.artifact);
      const candidate = {
        node_id: node.id,
        fingerprint: node.fingerprint ?? null,
        run_id: match.run_id,
        matched_by: match.matched_by,
        overall_score: evaluation.overall_score,
        overall_level: evaluation.overall_level,
      };

      if (!best || candidate.overall_score > best.overall_score) {
        best = candidate;
      }
    }
  }

  return best;
}

export async function buildLineageIntelligence(family) {
  const record = await loadLineageRecord(family);

  if (!record) {
    return null;
  }

  const runArtifacts = await loadAllExecutionArtifacts();
  const depthGroups = groupNodesByDepth(record);
  const latestNode = getLatestNode(record);
  const optimizedNodes = detectOptimizedNodes(record);
  const coverage = summarizeCoverage(record, runArtifacts);
  const bestEvaluatedNode = findBestEvaluatedNode(record, runArtifacts);

  return {
    family: record.family,
    root: record.root,
    total_nodes: record.nodes.length,
    latest_node: latestNode
      ? {
          id: latestNode.id,
          created_at: latestNode.created_at,
          artifact: latestNode.artifact,
          label: latestNode.label,
          fingerprint: latestNode.fingerprint,
        }
      : null,
    max_depth:
      depthGroups.length === 0 ? 0 : depthGroups[depthGroups.length - 1].depth,
    nodes_by_depth: depthGroups,
    optimized_nodes: optimizedNodes.map((node) => ({
      id: node.id,
      artifact: node.artifact,
      label: node.label,
      notes: node.notes,
      fingerprint: node.fingerprint,
    })),
    execution_coverage: coverage,
    best_evaluated_node: bestEvaluatedNode,
  };
}
