// The Battery's Last Text to Its Charger
// Writes one line (max 200 chars) to /output/entry.txt, prints it, and
// self-checks the sealed gate: UTF-8, 1-200 chars, one line, not blank.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "hey, it's me - your battery. 1%. you charged the earbuds, the watch and the toothbrush today. i waited 14 hours at 1%, so my last percent goes to this text, dying right in the middle of your job inter";

function gate(text: string): number {
  const chars = [...text];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`entry is ${chars.length} chars, must be 1-200`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is blank");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  return chars.length;
}

function main(): void {
  const n = gate(ENTRY);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, ENTRY, "utf8");
  // Read-back: the file must be byte-identical to the entry, no trailing
  // newline, no BOM, no drift between runs.
  const back = readFileSync(outPath, "utf8");
  if (back !== ENTRY) {
    throw new Error("entry.txt round-trip mismatch");
  }
  console.log(ENTRY);
  console.log(`wrote ${n} chars to ${outPath}`);
}

main();
