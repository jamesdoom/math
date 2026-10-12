import test from "node:test";
import assert from "node:assert/strict";
import {
  evaluateLinear,
  slopeBetween,
  intercepts,
  equation,
  lineEndpoints,
  evaluateChoice,
} from "../src/utils/linear";
import {
  chapter3,
  lessons,
  problems,
  guidedProblems,
} from "../src/data/chapters/chapter3";
import {
  independentProblems,
  independentProblemMap,
  practiceSkills,
} from "../src/data/chapters/chapter3Practice";
import { createRound, parseRound } from "../src/utils/practiceRounds";
import {
  emptyProgress,
  parseProgress,
  STORAGE_KEY,
} from "../src/utils/storage";
import {
  recordProgressAttempt,
  markProgressAssisted,
} from "../src/utils/progress";
import { mastery, masteryState } from "../src/utils/mastery";
test("Chapter 3 references resolve; sources and supplemental material are explicit", () => {
  assert.equal(chapter3.number, 3);
  assert.equal(lessons.length, 8);
  assert.equal(lessons.filter((l) => l.supplemental).length, 2);
  assert.equal(guidedProblems.length, 8);
  for (const lesson of lessons) {
    assert.ok(lesson.source);
    assert.equal(lesson.steps.length, 5);
    assert.equal(lesson.support.length, 3);
    for (const step of lesson.steps)
      if ("problemIds" in step)
        for (const id of step.problemIds) assert.ok(problems[id], id);
  }
});
test("42 independent items cover seven skills with meaningful feedback and unique choices", () => {
  assert.equal(independentProblems.length, 42);
  assert.equal(new Set(independentProblems.map((p) => p.id)).size, 42);
  for (const skill of practiceSkills)
    assert.equal(
      independentProblems.filter((p) => p.steps[0].skill === skill).length,
      6,
    );
  for (const p of Object.values(problems)) {
    for (const s of p.steps) {
      assert.equal(s.choices.filter((c) => c.id === s.answer).length, 1);
      assert.equal(
        new Set(s.choices.map((c) => c.label)).size,
        s.choices.length,
      );
      assert.ok(s.hints.length >= 2);
      for (const c of s.choices)
        if (c.id !== s.answer) assert.ok(c.misconception?.feedback);
    }
  }
});
test("linear math handles signed inputs, fractions, and implicit coefficients", () => {
  assert.equal(evaluateLinear(3, 2, -2), -4);
  assert.equal(evaluateLinear(0.5, -1, 6), 2);
  assert.equal(evaluateLinear(2, 1, -2), -3);
  assert.equal(equation(-1, 0), "y = −x");
  assert.equal(equation(0, 4), "y = 4");
  assert.equal(equation(0.5, -2), "y = 1/2x − 2");
});
test("slope order, horizontal/vertical lines, and exact intercepts are correct", () => {
  const a = { x: -1, y: 4 },
    b = { x: 3, y: -4 };
  assert.equal(slopeBetween(a, b), -2);
  assert.equal(slopeBetween(b, a), -2);
  assert.equal(slopeBetween({ x: 0, y: 4 }, { x: 2, y: 4 }), 0);
  assert.equal(slopeBetween({ x: 2, y: 0 }, { x: 2, y: 4 }), null);
  assert.throws(() => slopeBetween(a, a));
  assert.deepEqual(intercepts(3, 2).x, { x: -2 / 3, y: 0 });
  assert.equal(intercepts(0, 3).x, null);
  assert.equal(intercepts(0, 0).x, "all");
});
test("rendered line endpoints lie on the equation and within the viewing bounds", () => {
  const bounds = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };
  for (const [m, b] of [
    [2, 1],
    [-1.5, 4],
    [0, 4],
    [3, -2],
  ]) {
    const points = lineEndpoints(m, b, bounds);
    assert.equal(points.length, 2);
    for (const p of points) {
      assert.ok(Math.abs(p.y - (m * p.x + b)) < 1e-9);
      assert.ok(p.x >= -6 && p.x <= 6 && p.y >= -6 && p.y <= 6);
    }
  }
  assert.deepEqual(lineEndpoints(0, 20, bounds), []);
});
test("authored numeric answers agree with independently calculated values", () => {
  const expected: Record<string, string> = {
    "input-negative": String(3 * -2 + 2).replace("-", "−"),
    "input-fraction": String(6 / 2 - 1),
    "evaluate-parentheses": String(2 * (-2 - 1) + 3).replace("-", "−"),
    "evaluate-zero": String(-4 * 0 + 5),
    "points-negative": String((-1 - 5) / (4 - 1)).replace("-", "−"),
    "points-positive": "3/2",
    "table-slope": String((5 - 1) / (2 - 0)),
    "table-horizontal": String((4 - 4) / (2 - 0)),
    "signed-run": String(-6 / -3),
    "negative-rise": "−1/2",
    "rise-run": "3/2",
    "x-intercept": "(2, 0)",
    "fraction-intercept": "(−2/3, 0)",
    "context-balance": "$" + String(60 - 12 * 3),
    "context-affordable": "At most " + String((23 - 8) / 3),
  };
  for (const [id, answer] of Object.entries(expected))
    assert.equal(independentProblemMap[id].answer, answer, id);
  assert.equal(independentProblemMap["vertical-slope"].answer, "Undefined");
  assert.equal(independentProblemMap["horizontal-range"].answer, "{4}");
});
test("discrete contextual graph has only feasible points, not a connecting line", () => {
  const real = lessons.find((l) => l.id === "real-world-lines")!;
  const visual = real.steps.find((s) => s.type === "visual")!;
  assert.ok("graph" in visual);
  if ("graph" in visual && visual.graph.model.kind === "points") {
    const points = visual.graph.model.points;
    assert.equal(points.length, 6);
    for (const p of points) {
      assert.ok(Number.isInteger(p.x));
      assert.ok(p.x >= 0 && p.x <= 5);
      assert.equal(p.y, 60 - 12 * p.x);
      assert.ok(p.y >= 0);
    }
  } else assert.fail("Expected discrete points");
});
test("rounds are balanced, distinct, validated, and favor less-seen items", () => {
  const round = createRound("mixed", {}, "one", () => 0.5);
  assert.equal(round.problemIds.length, 7);
  for (const skill of practiceSkills)
    assert.equal(
      round.problemIds.filter(
        (id) => independentProblemMap[id].steps[0].skill === skill,
      ).length,
      1,
    );
  assert.deepEqual(parseRound(JSON.stringify(round)), round);
  assert.equal(parseRound(JSON.stringify({ ...round, index: 8 })), null);
  assert.equal(
    parseRound(
      JSON.stringify({
        ...round,
        problemIds: Array(7).fill(round.problemIds[0]),
      }),
    ),
    null,
  );
  const ids = independentProblems
    .filter((p) => p.steps[0].skill === "coordinates-tables")
    .map((p) => p.id);
  const evidence = Object.fromEntries(
    ids.slice(0, 2).map((id) => ["old:" + id + ":check", "correct" as const]),
  );
  const fresh = createRound("coordinates-tables", evidence, "new", () => 0.5);
  assert.equal(fresh.problemIds.length, 4);
  assert.ok(fresh.problemIds.every((id) => !ids.slice(0, 2).includes(id)));
});
test("refreshes and hints cannot rewrite first-answer evidence; XP is awarded once", () => {
  const a = {
    skill: "slope-graphs" as const,
    correct: false,
    independent: true,
    stepKey: "rise-run:check",
    evidenceKey: "round:rise-run:check",
  };
  let p = recordProgressAttempt(emptyProgress(), a);
  p = recordProgressAttempt(parseProgress(JSON.stringify(p)), {
    ...a,
    correct: true,
  });
  assert.equal(p.skills[a.skill].independentAttempts, 1);
  assert.equal(p.skills[a.skill].independentCorrect, 0);
  assert.equal(p.xp, 10);
  p = markProgressAssisted(p, "round2:rise-run:check");
  p = recordProgressAttempt(parseProgress(JSON.stringify(p)), {
    ...a,
    correct: true,
    evidenceKey: "round2:rise-run:check",
  });
  assert.equal(p.skills[a.skill].independentAttempts, 1);
  assert.equal(p.xp, 10);
});
test("progress is Chapter 3 specific and malformed data resets safely", () => {
  assert.equal(STORAGE_KEY, "algebra-lab.chapter3.progress.v1");
  const p = emptyProgress();
  assert.deepEqual(parseProgress(JSON.stringify(p)), p);
  assert.deepEqual(parseProgress("{bad"), p);
  assert.equal(mastery(p.skills["linear-graphs"]), 0);
  assert.equal(masteryState(p.skills["linear-graphs"]), "NOT_STARTED");
  p.skills["linear-graphs"].correct = 5;
  assert.deepEqual(parseProgress(JSON.stringify(p)), emptyProgress());
});
test("feedback explicitly addresses swapped slope differences", () => {
  const step = independentProblemMap["same-order"].steps[0];
  const result = evaluateChoice(step, "error0");
  assert.equal(result.correct, false);
  assert.match(result.feedback, /different point orders/);
});
