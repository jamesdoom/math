import test from 'node:test';
import assert from 'node:assert/strict';
import { sessionSets } from '../src/data/chapters/chapter4Sessions';
import { createSession, parseSession } from '../src/utils/shortSession';
import { equationCases } from '../src/data/chapters/chapter4Practice';
import { equation } from '../src/utils/linear';
test('short sessions contain three guided moves with unique choices and accurate equations', () => {
  const cases = equationCases.filter(c => c.skill === 'equation-from-information');
  sessionSets.forEach((moves, i) => {
    assert.equal(moves.length, 3);
    moves.forEach(p => {
      assert.equal(p.mode, 'guided'); assert.equal(p.steps.length, 1);
      assert.equal(new Set(p.steps[0].choices.map(c => c.label)).size, p.steps[0].choices.length);
      assert.equal(p.steps[0].choices.find(c => c.id === p.steps[0].answer)?.label, p.answer);
      assert.equal(p.steps[0].hints.length, 2);
    });
    assert.equal(moves[2].answer, equation(cases[i].slope, cases[i].intercept));
  });
});
test('session storage validates lengths, completed moves and version while preserving completion', () => {
  const s = createSession(); assert.equal(s.length, 3);
  assert.deepEqual(parseSession(JSON.stringify(s)), s);
  assert.equal(createSession(sessionSets.length).set, 0);
  for (const patch of [{length:0},{length:4},{completed:4},{completed:-1},{set:99},{version:2},{id:''}])
    assert.equal(parseSession(JSON.stringify({...s,...patch})),null);
  for (const length of [1,2,3]) assert.equal(parseSession(JSON.stringify({...s,length,completed:length}))?.completed,length);
  assert.equal(parseSession('broken'), null);
});
