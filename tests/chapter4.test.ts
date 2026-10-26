import test from "node:test";
import assert from "node:assert/strict";
import {
  lessons,
  problems,
  guidedProblems,
  chapter4,
} from "../src/data/chapters/chapter4";
import {
  equationCases,
  independentProblems,
  independentProblemMap,
  practiceSkills,
  tableFor,
} from "../src/data/chapters/chapter4Practice";
import {
  equation,
  slopeBetween,
  lineEndpoints,
  evaluateChoice,
  evaluateLinear,
} from "../src/utils/linear";
import {
  emptyProgress,
  parseProgress,
  STORAGE_KEY,
} from "../src/utils/storage";
import {
  createRound,
  parseRound,
  ROUND_STORAGE_KEY,
} from "../src/utils/practiceRounds";
import {
  markProgressAssisted,
  recordProgressAttempt,
} from "../src/utils/progress";
import { mastery, masteryState } from "../src/utils/mastery";
test("page 1 alone defines five bite-size lessons with resolved source and practice references", () => {
  assert.equal(chapter4.number, 4);
  assert.equal(lessons.length, 5);
  assert.equal(guidedProblems.length, 5);
  for (const l of lessons) {
    assert.match(l.source, /Ch 4\. Page 1 notes\.pdf/);
    assert.equal(l.steps.length, 4);
    assert.equal(l.support.length, 3);
    const example = l.steps.find((s) => s.type === "example")!;
    assert.ok("revealOneAtATime" in example && example.revealOneAtATime);
    for (const s of l.steps)
      if ("problemIds" in s)
        for (const id of s.problemIds) assert.ok(problems[id], id);
  }
  for (const p of guidedProblems)
    assert.ok(p.steps.length >= 2 && p.steps.length <= 5);
});
test("30 original independent items have unique choices, hints, feedback and varied correct positions", () => {
  assert.equal(independentProblems.length, 30);
  assert.equal(new Set(independentProblems.map((p) => p.id)).size, 30);
  for (const skill of practiceSkills) {
    const items = independentProblems.filter((p) => p.steps[0].skill === skill);
    assert.equal(items.length, 6);
    assert.ok(
      new Set(
        items.map((p) =>
          p.steps[0].choices.findIndex((c) => c.id === p.steps[0].answer),
        ),
      ).size >= 2,
    );
  }
  for (const p of Object.values(problems))
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
});
test("signed coefficients, fractional slopes, decimals and zero simplify accurately", () => {
  assert.equal(equation(-1, 0.5), "y = −x + 0.5");
  assert.equal(equation(0, -2.5), "y = −2.5");
  assert.equal(equation(0, 0), "y = 0");
  assert.equal(equation(0.5, -1), "y = (1/2)x − 1");
  assert.equal(equation(-1.5, 2), "y = (−3/2)x + 2");
});
test("every table supplies x = 0 and consistent slopes and outputs", () => {
  for (const c of equationCases.filter(
    (c) => c.skill === "equation-from-table",
  )) {
    const rows = tableFor(c);
    assert.equal(rows.find((p) => p.x === 0)!.y, c.intercept);
    for (let i = 1; i < rows.length; i++)
      assert.equal(slopeBetween(rows[i - 1], rows[i]), c.slope);
    for (const p of rows) assert.equal(p.y, c.slope * p.x + c.intercept);
  }
});
test("rendered graph points satisfy the authored equations and do not disclose them in captions", () => {
  for (const c of equationCases.filter(
    (c) => c.skill === "equation-from-graph",
  )) {
    const graph = independentProblemMap[c.id].steps[0].graph!;
    assert.ok(!graph.description.includes("y ="));
    assert.equal(graph.points![0].x, 0);
    assert.equal(graph.points![0].y, c.intercept);
    assert.equal(slopeBetween(graph.points![0], graph.points![1]), c.slope);
    for (const p of graph.points!)
      assert.equal(p.y, evaluateLinear(c.slope, c.intercept, p.x));
  }
  const bounds = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };
  for (const c of equationCases) {
    const ends = lineEndpoints(c.slope, c.intercept, bounds);
    assert.equal(ends.length, 2);
    for (const p of ends)
      assert.ok(Math.abs(p.y - c.slope * p.x - c.intercept) < 1e-8);
  }
});
test("full equation choices match independently derived numeric cases", () => {
  const expected: Record<string, string> = {
    "given-0": "y = −2x + 3",
    "given-2": "y = (1/2)x + 1",
    "graph-2": "y = (1/2)x − 1",
    "table-3": "y = −2x − 1",
    "horizontal-0": "y = −3",
    "horizontal-3": "y = 1.5",
    "horizontal-4": "y = −2.5",
  };
  for (const [id, answer] of Object.entries(expected))
    assert.equal(independentProblemMap[id].answer, answer);
  const p = guidedProblems.find((p) => p.id === "c4-guided-table")!;
  assert.equal(p.answer, "y = −2x + 1");
  for (const row of p.steps[0].table!) assert.equal(row.y, -2 * row.x + 1);
});
test("short rounds are distinct, balanced, validated and prefer less-seen questions", () => {
  const round = createRound("mixed", {}, "one", () => 0.5);
  assert.equal(round.problemIds.length, 5);
  for (const skill of practiceSkills)
    assert.equal(
      round.problemIds.filter(
        (id) => independentProblemMap[id].steps[0].skill === skill,
      ).length,
      1,
    );
  assert.deepEqual(parseRound(JSON.stringify(round)), round);
  const short = createRound("equation-from-information", {}, "two", () => 0.5);
  assert.equal(short.problemIds.length, 3);
  assert.equal(new Set(short.problemIds).size, 3);
  assert.deepEqual(parseRound(JSON.stringify(short)), short);
  const evidence = Object.fromEntries(
    short.problemIds.map((id) => ["old:" + id + ":check", "correct" as const]),
  );
  assert.ok(
    createRound(
      "equation-from-information",
      evidence,
      "three",
      () => 0.5,
    ).problemIds.every((id) => !short.problemIds.includes(id)),
  );
  assert.equal(parseRound(JSON.stringify({ ...round, index: 6 })), null);
  assert.equal(
    parseRound(
      JSON.stringify({
        ...round,
        problemIds: Array(5).fill(round.problemIds[0]),
      }),
    ),
    null,
  );
});
test("Chapter 4 persistence starts at zero and leaves earlier chapters on separate keys", () => {
  assert.equal(STORAGE_KEY, "algebra-lab.chapter4.progress.v1");
  assert.equal(ROUND_STORAGE_KEY, "algebra-lab.chapter4.practice-round.v1");
  const p = emptyProgress();
  assert.deepEqual(parseProgress(JSON.stringify(p)), p);
  assert.deepEqual(parseProgress("{bad"), p);
  assert.equal(mastery(p.skills["identify-m-and-b"]), 0);
  assert.equal(masteryState(p.skills["identify-m-and-b"]), "NOT_STARTED");
});
test("refreshes, hints, retries and replay do not inflate evidence or XP", () => {
  const a = {
    skill: "equation-from-graph" as const,
    correct: false,
    independent: true,
    stepKey: "graph-0:check",
    evidenceKey: "round:graph-0:check",
  };
  let p = recordProgressAttempt(emptyProgress(), a);
  p = recordProgressAttempt(parseProgress(JSON.stringify(p)), {
    ...a,
    correct: true,
  });
  assert.equal(p.skills[a.skill].independentAttempts, 1);
  assert.equal(p.skills[a.skill].independentCorrect, 0);
  assert.equal(p.xp, 10);
  p = markProgressAssisted(p, "new:graph-0:check");
  p = recordProgressAttempt(parseProgress(JSON.stringify(p)), {
    ...a,
    correct: true,
    evidenceKey: "new:graph-0:check",
  });
  assert.equal(p.skills[a.skill].independentAttempts, 1);
  assert.equal(p.xp, 10);
});
test("targeted feedback separates a lost slope sign from a wrong intercept", () => {
  const step = independentProblemMap["given-0"].steps[0];
  assert.match(evaluateChoice(step, "error0").feedback, /sign/);
  assert.match(evaluateChoice(step, "error1").feedback, /x = 0/);
});
