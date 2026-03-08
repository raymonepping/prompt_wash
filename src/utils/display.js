import chalk from "chalk";

export function printInfo(message) {
  console.log(chalk.cyan(`ℹ ${message}`));
}

export function printSuccess(message) {
  console.log(chalk.green(`✔ ${message}`));
}

export function printWarning(message) {
  console.warn(chalk.yellow(`⚠ ${message}`));
}

export function printError(message) {
  console.error(chalk.red(`✖ ${message}`));
}

export function printJson(value) {
  console.log(JSON.stringify(value, null, 2));
}
