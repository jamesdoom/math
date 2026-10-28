import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultPreferences, parsePreferences } from '../src/utils/preferences';
import { practiceSupport, supportFor, successFor } from '../src/data/chapters/chapter4Support';
import { independentProblems } from '../src/data/chapters/chapter4Practice';
import { guidedProblems } from '../src/data/chapters/chapter4';
import { graphSessionSets } from '../src/data/chapters/chapter4GraphSessions';
import { sessionSets } from '../src/data/chapters/chapter4Sessions';

test('comfort preferences default safely and validate saved values without touching progress', () => {
  for (const raw of [null, 'bad', 'null', '[]', '5', '{}', '{"theme":"pink","reducedMotion":"no","explanations":"none"}'])
    assert.deepEqual(parsePreferences(raw), defaultPreferences);
  const custom = {theme:'light',reducedMotion:false,explanations:'on-request'};
  assert.deepEqual(parsePreferences(JSON.stringify(custom)),custom);
  assert.deepEqual(parsePreferences('{"theme":"light"}'),{...defaultPreferences,theme:'light'});
});
test('every active practice step has a small worked example, useful clues and concrete success feedback', () => {
  const all=[...independentProblems,...guidedProblems,...graphSessionSets.flat(),...sessionSets.flat()];
  for(const problem of all) for(const step of problem.steps){
    const support=supportFor(step);
    assert.ok(support.title);assert.ok(support.moves.length >= 2 && support.moves.length <= 3);
    assert.ok(support.moves.every(line=>line.length>10));
    assert.doesNotMatch(successFor(step),/without help|independently|mastered|XP/);
  }
  for(const support of Object.values(practiceSupport)){
    const example=support.example,step=example.steps[0];
    assert.equal(example.mode,'guided');assert.equal(example.steps.length,1);
    assert.equal(new Set(step.choices.map(c=>c.label)).size,3);
    assert.equal(step.choices.find(c=>c.id===step.answer)?.label,example.answer);
    assert.ok(step.choices.filter(c=>c.id!==step.answer).every(c=>c.misconception?.feedback));
    assert.equal(step.hints.length,2);
  }
  const graph=graphSessionSets[0];
  assert.equal(supportFor(graph[0].steps[0]),practiceSupport['graph-crossing']);
  assert.equal(supportFor(graph[1].steps[0]),practiceSupport['graph-intercept']);
  assert.equal(supportFor(graph[2].steps[0]),practiceSupport['graph-slope']);
});
