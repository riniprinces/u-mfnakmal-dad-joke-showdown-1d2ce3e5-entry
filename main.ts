/**
 * Dad Joke Showdown — make.fun bounty entry.
 *
 * What this does, in one breath: it writes a single original dad joke to
 * the file the grader reads, `/output/entry.txt` (overridable with the
 * OUTPUT_PATH environment variable), creating the directory if needed.
 *
 * The joke itself:
 *   "I told the kids the TV was the best storyteller in the house.
 *    It said, 'Dad, I'm a screenwriter.'"
 * One setup line, one clean pun for the punchline, 97 characters — a
 * father could deliver it across the dinner table without a pause.
 *
 * The file is written exactly as the joke reads: no trailing newline and
 * no surrounding whitespace, so the scorer sees one valid line of text.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const MAX_LENGTH = 200;
const DEFAULT_OUTPUT = "/output/entry.txt";

const JOKE =
  "I told the kids the TV was the best storyteller in the house. It said, 'Dad, I'm a screenwriter.'";

function fail(reason: string): never {
  throw new Error(`Refusing to write entry: ${reason}`);
}

function hasValidLength(text: string): boolean {
  return text.length >= 1 && text.length <= MAX_LENGTH;
}

function hasNoSurroundingWhitespace(text: string): boolean {
  return text.trim() === text;
}

function isOneLine(text: string): boolean {
  return !text.includes("\n") && !text.includes("\r");
}

function checkJoke(text: string): void {
  if (!hasValidLength(text)) {
    fail(`joke is ${text.length} characters, but the gate wants 1-${MAX_LENGTH}`);
  }
  if (text.trim().length === 0) {
    fail("joke is only whitespace");
  }
  if (!hasNoSurroundingWhitespace(text)) {
    fail("joke starts or ends with whitespace");
  }
  if (!isOneLine(text)) {
    fail("joke spans more than one line");
  }
}

function writeEntry(text: string, outputPath: string): void {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, text, { encoding: "utf8" });
}

function run(): number {
  checkJoke(JOKE);
  const outputPath = process.env.OUTPUT_PATH ?? DEFAULT_OUTPUT;
  writeEntry(JOKE, outputPath);
  return 0;
}

try {
  process.exitCode = run();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
