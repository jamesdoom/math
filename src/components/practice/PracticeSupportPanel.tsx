import { useEffect, useRef, useState } from 'react';
import type { PracticeSupport } from '../../data/chapters/chapter4Support';
import { CoordinatePlane } from '../graph/CoordinatePlane';
import { ValueTable } from '../learning/ValueTable';
import { evaluateChoice } from '../../utils/linear';

export function PracticeSupportPanel({ support, mode, onReturn }: {
  support: PracticeSupport; mode: 'move' | 'example'; onReturn: () => void;
}) {
  const [move, setMove] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [correct, setCorrect] = useState(false);
  const [clue, setClue] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const step = support.example.steps[0];
  useEffect(() => { heading.current?.focus(); }, []);
  return <section className="support-panel" aria-label="Help with a similar example">
    <span className="eyebrow">{mode === 'move' ? 'ONE WORKED MOVE' : 'A SIMPLER EXAMPLE'}</span>
    <h3 ref={heading} tabIndex={-1}>{support.title}</h3>
    <p>Your original problem is paused. This example does not move your session forward.</p>
    {step.graph && <CoordinatePlane spec={step.graph} />}
    {step.table && <ValueTable points={step.table} />}
    {mode === 'move' ? <>
      <p className="example-move" aria-live="polite">{support.moves[move]}</p>
      <div className="support-actions">
        <button className="text-button" disabled={move === 0} onClick={() => setMove(move - 1)}>Previous move</button>
        {move < support.moves.length - 1 && <button className="text-button" onClick={() => setMove(move + 1)}>Show next move</button>}
      </div>
    </> : <>
      <p className="equation">{step.expression}</p>
      <p><strong>{step.prompt}</strong></p>
      <div className="choices">
        {step.choices.map(choice => <button key={choice.id} disabled={correct} className={correct && choice.id === step.answer ? 'correct-choice' : undefined}
          onClick={() => { const result = evaluateChoice(step, choice.id); setFeedback(result.feedback); setCorrect(result.correct); }}>{choice.label}</button>)}
      </div>
      {feedback && <div className={'feedback' + (correct ? ' success' : '')} role="status"><strong>{correct ? 'You used the idea in this example.' : 'Here is a clue.'}</strong><p>{feedback}</p></div>}
      {!correct && <button className="text-button" onClick={() => setClue(Math.min(clue + 1, 2))}>{clue === 0 ? 'Give me a clue for this example' : 'Show another clue for this example'}</button>}
      {clue > 0 && <p role="status">{step.hints[clue - 1].text}</p>}
    </>}
    <button className="primary" onClick={onReturn}>Back to my problem</button>
  </section>;
}
