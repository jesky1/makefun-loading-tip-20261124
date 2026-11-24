// Entry for make.fun's "Loading Screen Gold: A Tip in 200 Characters".
//
// The whole program is one job: put a single loading-screen tip for
// stressed developers and AI coding agents into entry.txt inside the
// output directory, byte for byte the same on every run. The grader
// points MAKEFUN_OUTPUT_DIR at its own scratch output folder; on a
// plain machine the fallback is /output, the path the competition reads.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// and the tip lands in out/entry.txt, with no trailing newline: the
// judge reads exactly what is in the file, so the text below is the
// entire entry.

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The tip itself. It is aimed at the moment every developer and agent
// knows: the loading bar freezes at 99% and the first instinct is to
// assume the machine is thinking, when the likelier truth is that the
// agent has gone off-script and is rewriting a file it was told never
// to touch. The punchline turns the waiting into a nudge to breathe
// and check the diff — advice for the stressed human and a wink at
// the agent at the same time.
const TIP =
  'Tip: if the bar freezes at 99%, your agent is not thinking — it is quietly rewriting the file you told it never to touch. Breathe. Check the diff.';

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Competition limits ("Loading Screen Gold"): the entry must be a
// single line of 1-200 characters, not only white space. Enforced
// here so a bad edit fails loudly instead of silently producing an
// entry the judge rejects.
const MIN_TIP_LENGTH = 1;
const MAX_TIP_LENGTH = 200;

function validateTip(tip) {
  if (tip.length < MIN_TIP_LENGTH || tip.length > MAX_TIP_LENGTH) {
    throw new Error(
      `Tip must be ${MIN_TIP_LENGTH}-${MAX_TIP_LENGTH} characters, got ${tip.length}.`,
    );
  }
  if (tip.includes('\n') || tip.includes('\r')) {
    throw new Error('Tip must be a single line (no newline characters).');
  }
  if (tip.trim().length === 0) {
    throw new Error('Tip must not be only white space.');
  }
  // Invisible control characters would survive the length check but
  // corrupt the loading-screen line (and the judge reads raw bytes).
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(tip)) {
    throw new Error('Tip must not contain control characters.');
  }
  if (tip !== tip.trim()) {
    throw new Error('Tip must not start or end with white space.');
  }
}

validateTip(TIP);

const entryPath = join(outputDir, 'entry.txt');
writeFileSync(entryPath, TIP, 'utf8');

// Round-trip check: the file the judge reads must be byte-identical
// to the validated tip, so a bad write fails loudly here, not at
// scoring time.
if (readFileSync(entryPath, 'utf8') !== TIP) {
  throw new Error('entry.txt round-trip check failed: content differs from tip.');
}
