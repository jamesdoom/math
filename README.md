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
- `src/components/practice/PracticePlayer.tsx`: choices, targeted feedback, progressive clues, one worked move, simpler examples, and optional full solution.
- `src/data/chapters/chapter4Support.ts`: eight small support examples, worked moves, and skill-specific success language, separate from mastery questions.
- `src/context/PreferencesContext.tsx`: saved appearance, motion, and explanation preferences.
- `src/components/graph/`: accessible native SVG coordinate plane.
- `src/pages/`: dashboard, Chapter 4 navigation, lesson player, short practice rounds.
- `src/utils/`: math, storage validation, pure attempt recording, replaceable mastery policy, and varied round selection.
- `tests/chapter4.test.ts`: page scope, references, data quality, signed/fractional/decimal equations, tables, graphs, round selection, and evidence integrity.

## Progress and limits

The default home activity is a graph-based short session. The earlier given-information sessions remain available and saved sessions keep their original content. Both follow the same saved-move and clear-ending behavior described below.

The home screen starts a short guided session at `/session`: place the slope, place the intercept, and simplify the equation. Six original given-slope/intercept sets rotate in order. Each move saves synchronously when answered correctly or reviewed through Show solution; feedback stays visible until Next move / Finish session. Refresh resumes after saved moves. A finished session remains finished, including on the home screen, until the student explicitly chooses Do another. There is no timer, streak, deadline, or automatic daily reset. Optional sessions can contain 1–3 moves; their length is fixed at creation. Shorter sessions complete the corresponding prefix of the three moves.

Session state is validated and stored separately at `algebra-lab.chapter4.short-session.v1`. Storage failures show a warning. These guided moves contribute learning attempts and existing once-per-step XP, but never independent mastery or whole-lesson completion. Existing lessons, graph/table instruction, and independent practice remain available through navigation.

New sessions default to an interactive graph sequence: select the y-axis crossing, place its intercept in the equation, then use a visible rise/run triangle to fill the slope. Six original graphs include positive, negative, fractional, and zero slopes. Points respond to click, touch, Enter, or Space, with matching HTML buttons as an alternative. The crossing and discovered facts stay visible in later moves; the final correct response shows the completed equation. A two-unit run improves triangle-label spacing on phones. These are guided learning moves, so facts and cues intentionally remain available.

The optional `kind` field distinguishes graph sessions from given-information sessions. Existing saves without a kind retain their original given-information set and completed moves. The optional next-session controls allow either activity, plus a 1–3 move length. No saved session is replaced automatically.

Chapter 4 uses `algebra-lab.chapter4.progress.v1` and `algebra-lab.chapter4.practice-round.v1`. Older chapter records remain untouched, rather than being reset or counted toward new skills. Earlier source/curriculum files are recoverable in Git history. Existing Chapter 4 IDs should remain stable during future updates.

Only first unassisted answers update independent evidence; hints and feedback-assisted retries remain learning. Saved evidence prevents refreshes from creating new first answers. Correct steps earn 10 XP once per problem/step. Mastery is independent correct / independent attempts, with the existing three-correct/80% mastered threshold. It is a learning indicator, not a validated adaptive assessment. Checkpoints and practice reuse items, rather than forming reserved unseen pools.

Resume restores the lesson stage or round item; unfinished interaction screens restart, but first-answer/assistance evidence remains saved. Progress is local to each browser/origin and does not automatically move between localhost and deployment or between devices. The app uses authored choices, not arbitrary equation parsing or free-form graph drawing. Additional chapter material awaits further notes or user authorization.

After verified updates, commit and push to `origin/main` as authorized in `AGENTS.md`. Private PDFs, temporary screenshots/browser tooling, dependencies, and built assets are excluded from commits.

## Comfort and support

Settings contains three preference groups: light/dark appearance, reduced motion (on by default and also respecting the device setting), and extra explanations shown immediately or opened on request. Essential problem statements, graphs/tables, known values, and mistake feedback remain visible. No sound plays. Preferences use the separate validated `algebra-lab.preferences.v1` key; changing them never resets progress or an active session. Save failures are explained on the settings page.

Practice help offers Give me a clue, Show one move, and Try an easier example. A worked-move panel reveals one line of a similar example at a time. The easier example is a separate small interaction; neither mode advances the original problem, adds XP, or records independent evidence. Returning restores the original problem and keyboard focus. Opening either support mode marks the original step assisted, including after refresh. A full solution is still available after worked support. Lesson support uses the neutral Explain this another way label.

Correct-answer feedback names the completed action, with extra reasoning controlled by the explanation preference. Session completion lists the moves practiced, including supported learning, without claiming they were mastered independently. Lesson and practice completion emphasize the practiced skill; detailed evidence remains available behind a disclosure. No new reward system, timers, streaks, diagnosis data, or assumed interest-based theme were added. Personal interests can be incorporated later with the student's input.

## Verification

TypeScript, the production build, and sixteen domain/content/progress/session/support tests pass. Isolated browser checks exercised all five complete lessons and all 30 independent questions, graph sessions, worked-example next/back and keyboard controls, wrong-answer feedback, progressive help, simpler examples for all five skills, completion, short/mixed rounds, refresh persistence, and earlier Chapter 3 storage preservation. Preference checks covered reload persistence, explanation disclosure, blocked storage, both themes, device/app reduced motion, and 320px/390px mobile layouts. Sampled text and graph colors met 4.5:1 contrast, and control borders met 3:1. No runtime/console errors were detected. Temporary browser tooling and screenshots live under ignored `.verification/`.
