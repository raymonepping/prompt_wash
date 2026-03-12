function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

export const LINEAGE_RECORD_VERSION = 1;

export function createLineageNode({
  id,
  parent = null,
  artifact,
  createdAt = new Date().toISOString(),
  label = "",
  notes = "",
  fingerprint = null,
}) {
  return {
    id,
    parent,
    artifact,
    created_at: createdAt,
    label,
    notes,
    fingerprint,
  };
}

export function createLineageRecord({
  family,
  root,
  nodes = [],
  version = LINEAGE_RECORD_VERSION,
}) {
  return {
    version,
    family,
    root,
    nodes,
  };
}

export function validateLineageRecord(record) {
  const errors = [];

  if (!isObject(record)) {
    errors.push("Lineage record must be an object.");
    return errors;
  }

  if (typeof record.version !== "number" || Number.isNaN(record.version)) {
    errors.push("version must be a number");
  }

  if (typeof record.family !== "string" || !record.family.trim()) {
    errors.push("family must be a non-empty string");
  }

  if (typeof record.root !== "string" || !record.root.trim()) {
    errors.push("root must be a non-empty string");
  }

  if (!Array.isArray(record.nodes)) {
    errors.push("nodes must be an array");
    return errors;
  }

  const seenIds = new Set();

  for (const [index, node] of record.nodes.entries()) {
    if (!isObject(node)) {
      errors.push(`nodes[${index}] must be an object`);
      continue;
    }

    if (typeof node.id !== "string" || !node.id.trim()) {
      errors.push(`nodes[${index}].id must be a non-empty string`);
    } else if (seenIds.has(node.id)) {
      errors.push(`nodes[${index}].id must be unique`);
    } else {
      seenIds.add(node.id);
    }

    if (
      node.parent !== null &&
      (typeof node.parent !== "string" || !node.parent.trim())
    ) {
      errors.push(`nodes[${index}].parent must be null or a non-empty string`);
    }

    if (typeof node.artifact !== "string" || !node.artifact.trim()) {
      errors.push(`nodes[${index}].artifact must be a non-empty string`);
    }

    if (typeof node.created_at !== "string" || !node.created_at.trim()) {
      errors.push(`nodes[${index}].created_at must be a non-empty string`);
    }

    if (typeof node.label !== "string") {
      errors.push(`nodes[${index}].label must be a string`);
    }

    if (typeof node.notes !== "string") {
      errors.push(`nodes[${index}].notes must be a string`);
    }

    if (
      node.fingerprint !== null &&
      !(typeof node.fingerprint === "string" && node.fingerprint.trim())
    ) {
      errors.push(
        `nodes[${index}].fingerprint must be null or a non-empty string`,
      );
    }
  }

  const rootNode = record.nodes.find((node) => node?.id === record.root);
  if (!rootNode) {
    errors.push("root must reference an existing node id");
  }

  for (const [index, node] of record.nodes.entries()) {
    if (node.parent !== null && !seenIds.has(node.parent)) {
      errors.push(`nodes[${index}].parent must reference an existing node id`);
    }
  }

  return errors;
}

export function findLineageNode(record, nodeId) {
  return record.nodes.find((node) => node.id === nodeId) ?? null;
}
