import { printInfo, printJson, printSuccess } from "../utils/display.js";
import { resolveInputSource } from "../utils/input.js";
import { resolvePromptObjectFromSource } from "../utils/prompt-source.js";
import {
  initializeLineageRecord,
  listLineageFamilies,
  loadLineageRecord,
} from "../services/lineage/storage.js";
import { createLineageNode } from "../services/lineage/schema.js";
import { toLineageFamilyName } from "../services/lineage/naming.js";

function toDefaultArtifactPath(family) {
  return `artifacts/${family}.json`;
}

export function registerLineageCommand(program) {
  const lineage = program
    .command("lineage")
    .description("Initialize, inspect, and list PromptWash prompt lineages");

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
