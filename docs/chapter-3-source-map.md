# Chapter 3 source map

Updated October 12, 2026. The student-facing curriculum is now Chapter 3 — Linear Functions. Chapter 2 curriculum, questions, navigation, and planning content have been replaced.

Subsequent source update: `Ch 3 Notes pgs 1-2.pdf` is now accessible and has been visually inspected. It covers identifying linear/nonlinear functions and discrete/continuous domains. The availability table below records the initial implementation inputs; integration of the newly supplied material and correction of the in-app availability labels are pending. Filename pages 5–6 remain missing.

## Source availability and the missing material

The user confirmed that missing pages 5–6 refer to PDF filename numbering. The following files were read visually because they are scanned images without extractable text:

| Supplied file                                      | Visible content                                                                                                                       | App lessons                                   |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `C:/Users/Brian/Downloads/Ch 3 Notes pg 3-4.pdf`   | Two pages marked 5 and 6 by hand; 3.3 Day 2: Graphing Linear Functions; tables, graphing, domain/range, intercepts, slope             | Tables to graphs; features of lines           |
| `C:/Users/Brian/Downloads/Ch 3 Notes pgs 7-8.pdf`  | 3.6 Day 1: slopes, signed rise/run, slope types, graphs, tables, point-pair formula                                                   | Slope on graphs; slope from points and tables |
| `C:/Users/Brian/Downloads/Ch 3 Notes pgs 9-10.pdf` | 3.6 Day 2: slope-intercept form, equations from graph features, isolating y, graphing from slope and intercept                        | Slope-intercept form; graph features          |
| `C:/Users/Brian/Downloads/Ch 3 Notes pg 11.pdf`    | Writing and Graphing Linear Equations — Real World; initial values, rates, discrete counts, contextual domain/range and affordability | Real-world linear models                      |
| `C:/Users/Brian/Downloads/Ch 3 Notes pgs 1-2.pdf`  | File not present at the supplied path; not read                                                                                       | No claims about its contents                  |
| Missing filename pages 5–6                         | Not supplied; contents cannot be verified from the surrounding files                                                                  | Supplemental foundation, labeled as such      |

Filename numbers and handwritten numbers differ; the app does not silently treat them as interchangeable.

## Supplemental bridge

The first lesson, **Inputs, outputs, and coordinates**, provides original prerequisite instruction for the confirmed topics: functions assign one output to each input; substitute signed inputs and use order of operations; evaluate parenthesized rules; write and plot ordered pairs. This is mathematically appropriate support for the available lessons, not a reconstruction of missing pages 1–2 or filename pages 5–6. The exact missing section titles and objectives remain unknown.

The second supplement, **A constant rate connects the representations**, bridges the table/graph material into the slope lessons. It explains signed output change per input change, equal input steps, identifying a nonconstant pattern, and using a rate and starting value to predict outputs. It sits after table graphing and is explicitly labeled as an inferred bridge for missing filename pages 5–6.

Both supplemental labels are displayed in Chapter navigation and on their lessons. Once the missing files are available, compare their scope with these bridges and adjust rather than assuming the gap has been exactly recovered.

## Mathematical clarifications

- Use the conventional signed form `y = mx + b`; a negative b is written as subtraction. Classroom `± b` shorthand is not a separate rule.
- Domain and range are sets of possible input/output values, not merely where a graph appears to stop in the displayed grid.
- An unrestricted nonhorizontal line has real-number domain and range. A horizontal line has a single-valued range. A vertical line has undefined slope and is not y as a function of x.
- Calculate intercepts exactly by setting the other coordinate to zero. A grid's limited visibility or fractional crossing does not mean the intercept cannot be found exactly.
- Keep point order consistent in both differences for slope; reversed order in both is valid, but reversing only one difference changes the sign.
- Contextual visit/activity counts are discrete. A depleted card stops at zero and disallows further visits when debt is prohibited. A cost equation may have a negative algebraic x-intercept that is outside its nonnegative contextual domain.
- Graphs distinguish continuous lines from unconnected points; the visible graph window is not a domain restriction.

## Implemented content

Eight lessons with five stages each: understand, worked example, visualization, guided decisions, independent checkpoint. There are eight original two-step guided problems and 42 original independent questions, six per skill. Skill rounds select four questions; mixed rounds select one per skill for seven total. Four questions per skill are also used as lesson checkpoints; checkpoints are not a separately reserved unseen pool. The two table/linear-pattern lessons share a skill and checkpoint pool.

Skills: coordinates/tables, linear graphs, domain/range/intercepts, slope on graphs, slope from points/tables, slope-intercept form, and real-world models. Progressive hints, targeted feedback, simpler explanations, actual skill progress, and local persistence remain. The SVG coordinate plane supports continuous/horizontal/vertical lines, sample points, discrete contextual plots, and accessible captions; the slope/intercept explorer updates its graph through labeled keyboard-accessible controls.

The authored choices teach each step; the app does not parse arbitrary algebra or accept free-form plotted points. Independent evidence is first-answer accuracy, not a validated adaptive assessment. A lesson checkpoint has a stable evidence ID to prevent refresh/review inflation; additional practice rounds provide new evidence opportunities. The percentage and three-correct/80% mastery-state policy remain simple and replaceable.

## Progress isolation

Chapter 3 uses `algebra-lab.chapter3.progress.v1` and `algebra-lab.chapter3.practice-round.v1`. Old Chapter 2 browser records are neither loaded into the new chapter nor deleted. Old lesson and chapter URLs are not advertised and show the not-found fallback. No backend, authentication, AI, new state library, or charting dependency was introduced.

## Review limits

The missing files prevent confirmation that every original Chapter 3 subsection has been recovered. Available notes are covered with original teaching and practice, rather than worksheet reproduction. A final comparison against the missing notes and a student trial remain useful before calling the curriculum fully aligned to the class.
