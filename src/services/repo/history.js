import { loadLineageRecord } from "../lineage/storage.js";
import { findLineageNode } from "../lineage/schema.js";

export async function loadLineageHistorySummary(family, nodeId = null) {
  const record = await loadLineageRecord(family);

  if (!record) {
    return null;
  }

  const node = nodeId ? findLineageNode(record, nodeId) : null;

  return {
    family: record.family,
    root: record.root,
    total_nodes: record.nodes.length,
    selected_node: node
      ? {
          id: node.id,
          parent: node.parent,
          artifact: node.artifact,
          label: node.label,
          notes: node.notes,
          fingerprint: node.fingerprint,
        }
      : null,
    nodes: record.nodes.map((item) => ({
      id: item.id,
      parent: item.parent,
      artifact: item.artifact,
      label: item.label,
      fingerprint: item.fingerprint,
    })),
  };
}