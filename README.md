# Algebra Lab - Chapter 5

A React + strict TypeScript + Vite learning app for the supplied class notes:

- **5.1: Solving Systems of Equations by Graphing**
- **5.2: Solving Systems of Equations by Elimination**

The current content follows only the four pages in `5.1 notes pg 1-2.pdf` and `5.2 notes pg 3-4.pdf`. See `docs/chapter-5-source-map.md` for coverage and mathematical checks. Private PDFs and renders are not committed. Earlier active curriculum is recoverable in Git history.

## Run

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
```

Vercel: Vite preset, root `./`, install `npm ci`, build `npm run build`, output `dist`, no environment variables. `vercel.json` rewrites browser routes to `index.html`.

## Student experience

The home screen offers one clear Start with help action. Its default three-move graph session locates the first line's intercept, adds the second line, then selects a shared point. Both lines remain visible with solid/dashed styles, a legend, descriptions, and keyboard-accessible point targets plus text-button alternatives.

Two more short-session activities cover direct elimination and scaling before elimination. Original equations stay in an aligned x/y/right-side table. Known values and transformed equations remain visible; the student does not have to memorize previous work. Activity links are under Choose another activity, and optional next-session controls are on the finish screen.

There are six focused lessons, three per section. Each has one explanation, an example revealed one move at a time, guided practice, and three checkpoint items. The independent bank has 36 original questions, six per skill. Three-question focus rounds favor less-seen items; mixed rounds contain six questions, one per skill. There are six graph, six direct-elimination, and six scaling session sets with three moves each.

Each completed session move saves immediately. Refresh resumes after it, while feedback remains visible until Next move / Finish session in the current visit. A finished session shows You’re done for today and stays finished until the student explicitly chooses another. Optional sessions can contain 1-3 moves; their length stays fixed after starting. Shorter sessions complete the corresponding prefix of the three moves. No timer, streak, deadline, or automatic daily reset is used. Paused activities have separate save slots so changing activity does not discard a different paused session.

## Learning and help

A system solution makes BOTH original equations true. Graph lessons include rewriting into y = mx + b, signed/fractional slopes, and horizontal lines. Classification distinguishes one crossing, distinct parallel lines, and the same line. Different slopes meet once even with equal intercepts. Elimination teaches aligned addition/subtraction, negative multipliers, scaling one or both entire equations, finding the second variable, ordered-pair order, and checking both originals.

Wrong choices have targeted feedback for misconceptions such as checking only one equation, swapping coordinates, confusing parallel and coincident lines, retaining a canceled term, subtracting signs incorrectly, or forgetting to scale the right side.

Help offers Give me a clue, Show one move, and Try an easier example. Separate simpler examples and one-move panels never advance the original problem or create XP/mastery evidence. Returning restores the original problem and keyboard focus. Opening support marks the original step assisted, including after refresh. Full worked solutions remain available after worked support. Lesson support offers progressive explanations through Explain this another way.

Correct-answer feedback names the completed action; finish screens describe the skills practiced without claiming independent mastery. Settings retains light/dark appearance, reduced motion (on by default and respecting the device), and immediate/on-request extra explanations. Essential facts and mistake feedback remain visible. No sound plays. Settings saves do not reset learning progress.

## Architecture

- `src/data/chapters/chapter5.ts`: section metadata, six lessons, worked examples, guided sequences, and resolved problem references.
- `src/data/chapters/chapter5Practice.ts`: authored numeric cases, 36 questions, choices, hints, and misconception feedback.
- `src/data/chapters/chapter5Sessions.ts`: three-move activities and their labels/recaps.
- `src/data/chapters/chapter5Support.ts`: smaller support examples and success feedback per skill.
- `src/types/`: curriculum, practice, equation/system, and progress domain types. Content stays separate from React presentation.
- `src/utils/systems.ts`: equation formatting, signed scaling/combining, numeric checks, and solution classification.
- `src/components/graph/CoordinatePlane.tsx`: native SVG plot with optional second line, legends, and accessible point selection.
- `src/components/learning/EquationSystem.tsx`: aligned original-equation table.
- `src/context/ProgressContext.tsx`, `src/utils/progress.ts`, `mastery.ts`, and `storage.ts`: persistence and replaceable evidence/mastery policy.
- `src/utils/shortSession.ts` and `practiceRounds.ts`: validated session/round state and activity selection.
- `src/context/PreferencesContext.tsx`: appearance and help preferences.
- `tests/chapter5.test.ts`: scope, arithmetic, independent answers, session coherence, validation, isolation, and evidence integrity.

To add another lesson within the authorized scope, add original problem data for its skill, a guided sequence, and a lesson record with section/source/support and the four lesson stages. Add numeric solution proofs and verify the resulting browser flow. Do not change existing IDs for already-used questions or lessons.

## Progress

Chapter 5 keys:

- `algebra-lab.chapter5.progress.v1`
- `algebra-lab.chapter5.practice-round.v1`
- `algebra-lab.chapter5.short-session.v1` (last activity)
- `algebra-lab.chapter5.short-session.v1.graph`, `.elimination`, `.scaling` (activity slots)

Earlier Chapter 4/3/2 browser keys are left untouched. They are not interpreted as Chapter 5 performance. Preferences stay at `algebra-lab.preferences.v1` across the content change. Chapter 5 begins with zero actual progress, not demo scores.

Skill mastery is first unassisted correct answers divided by first unassisted attempts. Three independent correct answers and at least 80% produce MASTERED; other states are NOT_STARTED, LEARNING, and PRACTICING. Saved per-round/step evidence prevents retries or refreshes from rewriting first-answer results. Guided work contributes learning attempts and existing once-per-step XP, but never independent mastery. Session completion is separate from lesson completion. The mastery indicator is not a validated adaptive assessment.

## Verification and limits

TypeScript, the production build, and 16 curriculum/math/progress tests pass. Isolated browser checks exercised all six complete lessons, all 36 independent questions, all 18 three-move sets, keyboard graph selection, feedback, clues, worked support, easier examples, refresh/finish persistence, optional lengths, paused-activity switching, prior chapter isolation, and both themes. Desktop and 390px mobile layouts were checked without horizontal overflow or runtime/console errors. Verification files, dependencies, and build output remain ignored.

Scope ends at the supplied 5.1/5.2 notes. There is no later-section content, word-problem unit, substitution as a separate method, backend, authentication, AI, or free-form algebra parser. Graph practice uses authored point choices rather than arbitrary freehand plotting. Progress remains local to the browser/origin and does not sync between devices or localhost and deployment. Intermediate help screens can restart on refresh; completed moves and assistance evidence remain saved.

After verified updates, commit and push to `origin/main` as authorized in `AGENTS.md`.
