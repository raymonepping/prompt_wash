import { printInfo, printJson, printSuccess } from "../utils/display.js";
import { resolveInputSource } from "../utils/input.js";
import { resolvePromptObjectFromSource } from "../utils/prompt-source.js";
import { createValidationError } from "../utils/errors.js";
import {
  appendLineageNode,
  initializeLineageRecord,
  listLineageFamilies,
  loadLineageRecord,
} from "../services/lineage/storage.js";
import { createLineageNode } from "../services/lineage/schema.js";
import {
  nextChildNodeId,
  toLineageFamilyName,
} from "../services/lineage/naming.js";

function toDefaultArtifactPath(familyOrNodeId) {
  return `artifacts/${familyOrNodeId}.json`;
}

function buildChildrenMap(record) {
  const childrenMap = new Map();

  for (const node of record.nodes) {
    const parentKey = node.parent ?? "__root__";

    if (!childrenMap.has(parentKey)) {
      childrenMap.set(parentKey, []);
    }

    childrenMap.get(parentKey).push(node);
  }

  for (const children of childrenMap.values()) {
    children.sort((left, right) => left.id.localeCompare(right.id));
  }

  return childrenMap;
}

function renderTreeLines(record) {
  const rootNode = record.nodes.find((node) => node.id === record.root);

  if (!rootNode) {
    return [];
  }

  const childrenMap = buildChildrenMap(record);
  const lines = [rootNode.id];

  function walk(nodeId, prefix = "") {
    const children = childrenMap.get(nodeId) ?? [];

    children.forEach((child, index) => {
      const isLast = index === children.length - 1;
      const branch = isLast ? "└─ " : "├─ ";
      lines.push(`${prefix}${branch}${child.id}`);

      const nextPrefix = `${prefix}${isLast ? "   " : "│  "}`;
      walk(child.id, nextPrefix);
    });
  }

  walk(rootNode.id);

  return lines;
}

export function registerLineageCommand(program) {
  const lineage = program
    .command("lineage")
    .description("Initialize, inspect, and evolve PromptWash prompt lineages");

  lineage
    .command("init")
    .description("Initialize a new lineage family from a prompt or artifact")
    .argument(
      "[input]",
      "Prompt text, PromptWash JSON, Prompt IR, or path to a file",
    )
    .option("-f, --file", "Treat input as a file path")
    .option("--family <name>", "Lineage family name")
    .option(
      "--artifact <path>",
      "Artifact path to associate with the root node",
    )
    .option("--label <value>", "Optional label for the root node", "root")
    .option("--notes <value>", "Optional notes for the root node", "")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (input, options) => {
      const resolved = await resolveInputSource(input, options);

      const { promptObject, sourceType } = await resolvePromptObjectFromSource(
        resolved,
        { enrich: false },
      );

      const family = toLineageFamilyName(
        options.family ??
          promptObject.fingerprint ??
          promptObject.intent ??
          "prompt",
      );

      const rootNode = createLineageNode({
        id: family,
        parent: null,
        artifact: options.artifact ?? toDefaultArtifactPath(family),
        label: options.label,
        notes: options.notes,
        fingerprint: promptObject.fingerprint ?? null,
      });

      const initialized = await initializeLineageRecord({
        family,
        rootNode,
      });

      const result = {
        command: "lineage init",
        family,
        source: sourceType,
        path: resolved.path,
        lineage_path: initialized.path,
        record: initialized.record,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      printSuccess("Lineage family initialized successfully");
      printInfo(`Family: ${family}`);
      printInfo(`Source: ${sourceType}`);
      printInfo(`Lineage file: ${initialized.path}`);
      console.log("");
      console.log("Root node:");
      console.log(`- id: ${rootNode.id}`);
      console.log(`- artifact: ${rootNode.artifact}`);
      console.log(`- label: ${rootNode.label || "(none)"}`);
      console.log(`- fingerprint: ${rootNode.fingerprint ?? "(none)"}`);
    });

  lineage
    .command("iterate")
    .description("Add a child iteration to an existing lineage family")
    .argument("<family>", "Lineage family name")
    .argument(
      "[input]",
      "Prompt text, PromptWash JSON, Prompt IR, or path to a file",
    )
    .option("-f, --file", "Treat input as a file path")
    .option("--parent <nodeId>", "Parent node id inside the family")
    .option("--artifact <path>", "Artifact path to associate with the new node")
    .option("--label <value>", "Optional label for the new node", "")
    .option("--notes <value>", "Optional notes for the new node", "")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (family, input, options) => {
      const record = await loadLineageRecord(family);

      if (!record) {
        throw createValidationError(`Lineage family not found: ${family}`);
      }

      const resolved = await resolveInputSource(input, options);

      const { promptObject, sourceType } = await resolvePromptObjectFromSource(
        resolved,
        { enrich: false },
      );

      const parentId = options.parent ?? record.root;
      const nodeId = nextChildNodeId(record, parentId);

      const node = createLineageNode({
        id: nodeId,
        parent: parentId,
        artifact: options.artifact ?? toDefaultArtifactPath(nodeId),
        label: options.label,
        notes: options.notes,
        fingerprint: promptObject.fingerprint ?? null,
      });

      const appended = await appendLineageNode(family, node);

      const result = {
        command: "lineage iterate",
        family,
        source: sourceType,
        path: resolved.path,
        lineage_path: appended.path,
        node,
        record: appended.record,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      printSuccess("Lineage iteration added successfully");
      printInfo(`Family: ${family}`);
      printInfo(`Source: ${sourceType}`);
      printInfo(`Lineage file: ${appended.path}`);
      console.log("");
      console.log("New node:");
      console.log(`- id: ${node.id}`);
      console.log(`- parent: ${node.parent}`);
      console.log(`- artifact: ${node.artifact}`);
      console.log(`- label: ${node.label || "(none)"}`);
      console.log(`- notes: ${node.notes || "(none)"}`);
      console.log(`- fingerprint: ${node.fingerprint ?? "(none)"}`);
    });

  lineage
    .command("view")
    .description("View a lineage family")
    .argument("<family>", "Lineage family name")
    .option("-o, --output <format>", "Output format: text|json", "json")
    .action(async (family, options) => {
      const record = await loadLineageRecord(family);

      const result = {
        command: "lineage view",
        family,
        record,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      if (!record) {
        printInfo(`No lineage family found: ${family}`);
        return;
      }

      printInfo(`Lineage family: ${record.family}`);
      printInfo(`Root: ${record.root}`);
      printInfo(`Nodes: ${record.nodes.length}`);
      console.log("");
      for (const node of record.nodes) {
        console.log(`- ${node.id}`);
        console.log(`  parent: ${node.parent ?? "(root)"}`);
        console.log(`  artifact: ${node.artifact}`);
        console.log(`  label: ${node.label || "(none)"}`);
        console.log(`  notes: ${node.notes || "(none)"}`);
        console.log(`  fingerprint: ${node.fingerprint ?? "(none)"}`);
      }
    });

  lineage
    .command("graph")
    .description("Render a lineage family as a tree")
    .argument("<family>", "Lineage family name")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (family, options) => {
      const record = await loadLineageRecord(family);

      if (!record) {
        throw createValidationError(`Lineage family not found: ${family}`);
      }

      const lines = renderTreeLines(record);

      const result = {
        command: "lineage graph",
        family,
        root: record.root,
        nodes: record.nodes.length,
        lines,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      printSuccess("Lineage graph rendered successfully");
      printInfo(`Family: ${record.family}`);
      printInfo(`Root: ${record.root}`);
      printInfo(`Nodes: ${record.nodes.length}`);
      console.log("");
      for (const line of lines) {
        console.log(line);
      }
    });

  lineage
    .command("list")
    .description("List known lineage families")
    .option("-o, --output <format>", "Output format: text|json", "text")
    .action(async (options) => {
      const families = await listLineageFamilies();

      const result = {
        command: "lineage list",
        families,
        total: families.length,
      };

      if (options.output === "json") {
        printJson(result);
        return;
      }

      printSuccess("Lineage families loaded");
      printInfo(`Total families: ${families.length}`);
      console.log("");
      if (families.length === 0) {
        console.log("(none)");
        return;
      }

      for (const family of families) {
        console.log(`- ${family}`);
      }
    });
}
