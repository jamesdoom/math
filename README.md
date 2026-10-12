# Algebra Lab — Chapter 3

React, strict TypeScript, Vite, React Router, CSS, and localStorage. The current app contains **Chapter 3 — Linear Functions only**.

## Content

Eight five-stage lessons cover inputs and coordinates, tables and graphs, a constant-rate bridge, domain/range/intercepts, slope on graphs, slope from points/tables, slope-intercept form, and real-world models. Each includes explanations, a worked example, a graph, a two-step guided problem, four checkpoint questions, progressive help, and targeted feedback. The separate bank contains 42 original independent questions (six per skill). Skill rounds use four items; mixed rounds use one per skill.

The [source map](docs/chapter-3-source-map.md) documents the reviewed PDFs, the filename/handwritten-number mismatch, mathematical clarifications, and supplementation. PDF filename pages 5–6 are missing. Pages 1–2 were unavailable during implementation, but have since been supplied and inspected; their additional material and the related in-app availability labels still need to be integrated. Two supplemental bridges cover foundations and constant rate; neither claims to reconstruct the missing notes.

## Run and check

```sh
npm install
npm run dev
npm run typecheck
npm test
npm run build
```

Local URL: http://127.0.0.1:5173. On this machine the npm wrapper may be broken; PowerShell can run `& 'C:/Program Files/nodejs/node.exe' 'C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js' run dev` instead. Static hosting requires an SPA fallback to index.html.

## Architecture

- `src/data/chapters/chapter3.ts`: chapter, eight lessons, guided problems, source labels, simpler explanations.
- `src/data/chapters/chapter3Practice.ts`: original practice bank and targeted misconceptions.
- `src/types/`: typed curriculum, authored question steps, graph models, and student progress.
- `src/components/graph/CoordinatePlane.tsx`: SVG grid, clipped infinite lines, horizontal/vertical lines, points, discrete plots, and textual equivalents.
- `src/components/learning/`: tables, interactive slope/intercept controls, progressively simpler support.
- `src/components/practice/PracticePlayer.tsx`: stepwise choices and help, with persistent first-answer evidence.
- `src/pages/`: dashboard, data-driven chapter navigation, lesson player, practice rounds.
- `src/utils/`: linear math, progress, storage validation, replaceable mastery calculation, round selection.
- `tests/chapter3.test.ts`: source references, numeric math, graph bounds, contextual models, bank quality, rounds, and progress integrity.

Add a lesson by defining its data and problems and registering it in the lesson/topic arrays. Chapter navigation resolves these arrays rather than one hard-coded introductory card. Authored transformations explain the reasoning without an arbitrary symbolic solver.

## Progress

Chapter 3 starts at zero using `algebra-lab.chapter3.progress.v1` and `algebra-lab.chapter3.practice-round.v1`. Existing Chapter 2 storage is not loaded or deleted. Correct steps award 10 XP once per problem/step. Only first unassisted answers supply independent evidence; saved mistakes or assistance cannot become a new independent success after refreshing. Lesson checkpoints use stable evidence IDs, while new practice rounds provide further opportunities. Using simpler help during a checkpoint marks its current problem assisted.

Mastery is rounded independent correct / independent attempts. States are not started, learning, practicing, or mastered (at least three independent correct and 80% accuracy). This remains a simple policy, not a validated assessment; checkpoint items also appear in practice rather than forming a reserved unseen pool.

## Verification

Strict TypeScript, the production build, and 11 domain/content/progress tests pass. An isolated browser session exercised all eight complete lesson flows and all 42 independent items across desktop and 390px mobile layouts. Checks covered source labels, slope/intercept controls, discrete graph points, progressive help, worked solutions, completion, refresh-safe first-answer evidence, practice-round resume, and preservation of legacy browser storage. No runtime/console errors or horizontal overflow were detected. Test progress was isolated from the student browser. Screenshots and the browser script are in ignored `.verification/`.

## Limits

Source alignment for missing files is unverified. The app uses authored choices, not free-form equation entry or direct point-placement assessment. It has no backend, account, AI, or cloud sync. Progress is local to a browser origin. Resume restores the lesson stage or practice-round item; the unfinished interaction restarts, but its evidence remains recorded. Fonts use Google Fonts with local fallbacks. The former Chapter 2 curriculum and docs have been replaced; obsolete lesson/chapter URLs show a not-found state.
