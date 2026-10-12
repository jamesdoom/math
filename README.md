# Algebra Lab — Chapter 3

React, strict TypeScript, Vite, React Router, CSS, and localStorage. The current app contains **Chapter 3 — Linear Functions only**.

## Content

Nine five-stage lessons cover inputs and coordinates, tables and graphs, linear/nonlinear identification, discrete/continuous domains, domain/range/intercepts, slope on graphs, slope from points/tables, slope-intercept form, and real-world models. Each includes explanations, a worked example, a graph, a two-step guided problem, four checkpoint questions, progressive help, and targeted feedback. The bank contains 54 original independent questions across seven skills. Skill rounds use four items; mixed rounds use one per skill.

The [source map](docs/chapter-3-source-map.md) documents the reviewed PDFs, the filename/handwritten-number mismatch, and mathematical clarifications. Pages 1–2 are integrated into source-backed lessons and practice. PDF filename pages 5–6 remain missing; the app makes no claim to reproduce their exact contents. Original prerequisite explanations are aligned to the available notes.

## Run and check

```sh
npm install
npm run dev
npm run typecheck
npm test
npm run build
```

Local URL: http://127.0.0.1:5173. On this machine the npm wrapper may be broken; PowerShell can run `& 'C:/Program Files/nodejs/node.exe' 'C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js' run dev` instead. Static hosting requires an SPA fallback to index.html.

## Vercel deployment

Import `jamesdoom/math`, production branch `main`. Select the Vite preset, root `./`, build command `npm run build`, output `dist`, and install command `npm ci`. No application environment variables are required. `vercel.json` supplies the SPA fallback so direct chapter/lesson/practice links and refreshes load the React router. After deployment, verify a direct lesson URL and its refresh, plus static assets. Progress on localhost does not automatically transfer to the deployed origin; use a stable production URL for student progress.

## Architecture

- `src/data/chapters/chapter3.ts`: chapter, nine lessons, guided problems, source labels, simpler explanations.
- `src/data/chapters/chapter3Practice.ts`: original practice bank and targeted misconceptions.
- `src/types/`: typed curriculum, authored question steps, graph models, and student progress.
- `src/components/graph/CoordinatePlane.tsx`: SVG grid, clipped infinite lines, bounded continuous segments, horizontal/vertical lines, recognition curves, discrete plots, and textual equivalents.
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

Strict TypeScript, the production build, and 13 domain/content/progress tests pass. The isolated browser workflow exercises all nine lesson flows and all 54 independent items across desktop and 390px mobile layouts, including recognition curves, continuous domain limits, discrete graph points, source labels, slope/intercept controls, help, completion, refresh-safe evidence, round resume, and preservation of legacy storage. Screenshots and the browser script are in ignored `.verification/`.

## Repository workflow

The user has authorized committing and pushing verified updates to `origin/main` after every project update. This standing instruction is recorded in `AGENTS.md`.

## Limits

Source alignment for missing files is unverified. The app uses authored choices, not free-form equation entry or direct point-placement assessment. It has no backend, account, AI, or cloud sync. Progress is local to a browser origin. Resume restores the lesson stage or practice-round item; the unfinished interaction restarts, but its evidence remains recorded. Fonts use Google Fonts with local fallbacks. The former Chapter 2 curriculum and docs have been replaced; obsolete lesson/chapter URLs show a not-found state.
