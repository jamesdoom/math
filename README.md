# Algebra Lab — Chapter 4, page 1

A student-friendly React/TypeScript/Vite app for **4.1 Writing Equations in Slope-Intercept Form**. Active exercises are limited to the attached `Ch 4. Page 1 notes.pdf` from the user's Cengage Big Ideas Algebra 1 class material. This is an original learning aid, not an official publisher product or a reproduction of the worksheet.

## Learning path

Five short lessons teach signed m and b, equations from given information, equations from graphs, equations from tables containing x = 0, and horizontal lines. Each has four stages:

1. One idea first.
2. A worked example revealed one small step at a time, with back/next controls.
3. A guided problem split into two to five decisions.
4. Three independent checks, with progressive assistance still available.

There are 30 original independent questions (six per skill). Focused rounds use three items; mixed review uses one per skill for five. Practice offers a guided-learning link before the independent checks. Fractions, decimal intercepts, negative signs, and zero slope reflect the supplied page. Later Chapter 4 topics are excluded.

See the [Chapter 4 source and scope map](docs/chapter-4-source-map.md) for provenance, examples, intentional boundaries, and the teaching sequence.

## Run and verify

```sh
npm install
npm run dev
npm run typecheck
npm test
npm run build
```

On this Windows host the npm wrapper may be broken; use `& 'C:/Program Files/nodejs/node.exe' 'C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js' run dev` instead. Local URL: http://127.0.0.1:5173.

The repository uses React Router, plain CSS, React context/state, and localStorage. No backend, authentication, AI, or large UI/chart framework is required. For Vercel: import `jamesdoom/math`, branch `main`, Vite preset, root `./`, install `npm ci`, build `npm run build`, output `dist`, no environment variables. The existing `vercel.json` enables direct lesson links and refreshes.

## Structure

- `src/data/chapters/chapter4.ts`: source-linked lessons, tiny worked-example moves, guided steps, progressive explanations.
- `src/data/chapters/chapter4Practice.ts`: original questions, authored numeric cases, graph/table data, misconception feedback.
- `src/components/learning/WorkedExample.tsx`: one move at a time; completed graph appears after the final move.
- `src/components/practice/PracticePlayer.tsx`: choices, targeted feedback, Hint 1 → Hint 2 → walkthrough → full solution.
- `src/components/graph/`: accessible native SVG coordinate plane.
- `src/pages/`: dashboard, Chapter 4 navigation, lesson player, short practice rounds.
- `src/utils/`: math, storage validation, pure attempt recording, replaceable mastery policy, and varied round selection.
- `tests/chapter4.test.ts`: page scope, references, data quality, signed/fractional/decimal equations, tables, graphs, round selection, and evidence integrity.

## Progress and limits

Chapter 4 uses `algebra-lab.chapter4.progress.v1` and `algebra-lab.chapter4.practice-round.v1`. Older chapter records remain untouched, rather than being reset or counted toward new skills. Earlier source/curriculum files are recoverable in Git history. Existing Chapter 4 IDs should remain stable during future updates.

Only first unassisted answers update independent evidence; hints and feedback-assisted retries remain learning. Saved evidence prevents refreshes from creating new first answers. Correct steps earn 10 XP once per problem/step. Mastery is independent correct / independent attempts, with the existing three-correct/80% mastered threshold. It is a learning indicator, not a validated adaptive assessment. Checkpoints and practice reuse items, rather than forming reserved unseen pools.

Resume restores the lesson stage or round item; unfinished interaction screens restart, but first-answer/assistance evidence remains saved. Progress is local to each browser/origin and does not automatically move between localhost and deployment or between devices. The app uses authored choices, not arbitrary equation parsing or free-form graph drawing. Additional chapter material awaits further notes or user authorization.

After verified updates, commit and push to `origin/main` as authorized in `AGENTS.md`. Private PDFs, temporary screenshots/browser tooling, dependencies, and built assets are excluded from commits.

## Verification

TypeScript, the production build, and ten domain/content/progress tests pass. An isolated browser session exercised all five complete lessons and all 30 independent questions, including worked-example next/back and keyboard controls, graph/table guidance, wrong-answer feedback, progressive help, completion, short/mixed rounds, refresh persistence, and earlier Chapter 3 storage preservation. Desktop and 390px mobile layouts had no horizontal overflow; no runtime/console errors were detected. Temporary browser tooling and screenshots live under ignored `.verification/`.
