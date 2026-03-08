#!/usr/bin/env node

import { runCli } from "../src/index.js";
import { exitWithError } from "../src/utils/errors.js";

try {
  await runCli(process.argv);
} catch (error) {
  exitWithError(error);
}
