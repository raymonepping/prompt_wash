import fs from "node:fs/promises";
import path from "node:path";

import { createFileError, createValidationError } from "../../utils/errors.js";
import { createLineageRecord, validateLineageRecord } from "./schema.js";

export const LINEAGE_DIR = ".promptwash/lineage";

async function fileExists(pathValue) {
  try {
    await fs.access(pathValue);
    return true;
  } catch {
    return false;
  }
}

function lineagePathForFamily(family) {
  return path.join(LINEAGE_DIR, `${family}.json`);
}

export async function ensureLineageDir() {
  try {
    await fs.mkdir(LINEAGE_DIR, { recursive: true });
  } catch (error) {
    throw createFileError(
      `Unable to create lineage directory: ${LINEAGE_DIR}`,
      error.message,
    );
  }
}

export async function loadLineageRecord(family) {
  const filePath = lineagePathForFamily(family);

  if (!(await fileExists(filePath))) {
    return null;
  }

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const record = JSON.parse(raw);
    const errors = validateLineageRecord(record);

    if (errors.length > 0) {
      throw createValidationError(
        `Invalid lineage record: ${filePath}`,
        errors,
      );
    }

    return record;
  } catch (error) {
    if (error.code === "VALIDATION_ERROR") {
      throw error;
    }

    throw createFileError(
      `Unable to load lineage record: ${filePath}`,
      error.message,
    );
  }
}

export async function saveLineageRecord(record) {
  const errors = validateLineageRecord(record);

  if (errors.length > 0) {
    throw createValidationError("Cannot save invalid lineage record", errors);
  }

  await ensureLineageDir();

  const filePath = lineagePathForFamily(record.family);

  try {
    await fs.writeFile(
      filePath,
      `${JSON.stringify(record, null, 2)}\n`,
      "utf8",
    );
  } catch (error) {
    throw createFileError(
      `Unable to write lineage record: ${filePath}`,
      error.message,
    );
  }

  return filePath;
}

export async function initializeLineageRecord({ family, rootNode }) {
  const existing = await loadLineageRecord(family);

  if (existing) {
    throw createValidationError(`Lineage family already exists: ${family}`);
  }

  const record = createLineageRecord({
    family,
    root: rootNode.id,
    nodes: [rootNode],
  });

  const filePath = await saveLineageRecord(record);

  return {
    record,
    path: filePath,
  };
}

export async function listLineageFamilies() {
  if (!(await fileExists(LINEAGE_DIR))) {
    return [];
  }

  try {
    const entries = await fs.readdir(LINEAGE_DIR, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
      .map((entry) => entry.name.replace(/\.json$/i, ""))
      .sort();
  } catch (error) {
    throw createFileError(
      `Unable to list lineage families: ${LINEAGE_DIR}`,
      error.message,
    );
  }
}
