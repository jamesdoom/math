import test from 'node:test';
import assert from 'node:assert/strict';
import { graphSessionCases, graphSessionSets } from '../src/data/chapters/chapter4GraphSessions';
import { parseSession, sessionMoves } from '../src/utils/shortSession';
import { sessionSets } from '../src/data/chapters/chapter4Sessions';
import { equation } from '../src/utils/linear';
test('graph sessions connect crossing, intercept and signed rise/run without losing facts', () => {
 graphSessionSets.forEach((moves,i)=>{
  const c=graphSessionCases[i];assert.equal(moves.length,3);
  const first=moves[0].steps[0];
  for(const p of moves){assert.equal(p.mode,'guided');assert.equal(new Set(p.steps[0].choices.map(c=>c.label)).size,3);}
  for(const point of first.pointChoices ?? []) assert.equal(first.choices.find(c=>c.id===point.choiceId)?.label,point.label);
  assert.deepEqual(first.pointChoices?.find(p=>p.choiceId===first.answer)?.point,{x:0,y:c.intercept});
  assert.deepEqual(moves[1].steps[0].graph?.points,[{x:0,y:c.intercept}]);
  const last=moves[2].steps[0]; assert.equal(last.graph?.slopeTriangle,true);
  const points=last.graph!.points!;assert.equal((points[1].y-points[0].y)/(points[1].x-points[0].x),c.slope);
  assert.equal(moves[2].answer,equation(c.slope,c.intercept));
 });
});
test('legacy sessions keep original given moves; new graph sessions use a separate stable bank',()=>{
 const legacy={version:1,id:'saved',set:2,length:3,completed:1};
 assert.deepEqual(parseSession(JSON.stringify(legacy)),legacy);
 assert.equal(sessionMoves(legacy as Parameters<typeof sessionMoves>[0]),sessionSets[2]);
 assert.equal(sessionMoves({...legacy,version:1,kind:'graph'}),graphSessionSets[2]);
 assert.equal(parseSession(JSON.stringify({...legacy,kind:'unknown'})),null);
});
