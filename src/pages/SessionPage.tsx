import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PracticePlayer } from '../components/practice/PracticePlayer';
import { sessionSets } from '../data/chapters/chapter4Sessions';
import { createSession, parseSession, SESSION_KEY, type ShortSession } from '../utils/shortSession';

export function SessionPage() {
  const [session, setSession] = useState(() => {
    try { return parseSession(localStorage.getItem(SESSION_KEY)) ?? createSession(); }
    catch { return createSession(); }
  });
  // Keep feedback visible after saving a completed move. Refresh resumes after it.
  const [visibleMove, setVisibleMove] = useState(session.completed);
  const [saveError, setSaveError] = useState(false);
  const [nextLength, setNextLength] = useState(session.length);
  const heading = useRef<HTMLHeadingElement>(null);
  function save(next: ShortSession) {
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(next)); setSaveError(false); }
    catch { setSaveError(true); }
    setSession(next);
  }
  useEffect(() => {
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); }
    catch { setSaveError(true); }
  }, [session]); // Also persist the initial session before the first move.
  useEffect(() => { heading.current?.focus(); }, [visibleMove]);
  const finished = visibleMove >= session.length;
  return <div className="start-page">
    {saveError && <p role="alert" className="callout">This browser could not save your session. You can continue, but a refresh may repeat a move.</p>}
    {finished ? <section className="start-card">
      <span className="eyebrow">SESSION COMPLETE</span>
      <h1 ref={heading} tabIndex={-1}>You’re done for today.</h1>
      <p>You completed {session.length} {session.length === 1 ? 'move' : 'moves'}. Using help counts as learning.</p>
      <p>You can stop here.</p>
      <Link className="primary" to="/">Back to home</Link>
      <details className="start-details">
        <summary>Optional: do another session</summary>
        <div className="start-details-body">
          <label htmlFor="session-length">Moves in the next session </label>
          <select id="session-length" value={nextLength} onChange={e => setNextLength(Number(e.target.value))}>
            {[1, 2, 3].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <p className="fine-print">The next session starts with the slope. Its length stays fixed once you start.</p>
          <button className="primary" onClick={() => {
            save(createSession(session.set + 1, nextLength)); setVisibleMove(0);
          }}>Do another</button>
        </div>
      </details>
    </section> : <section className="lesson-panel">
      <h1 ref={heading} tabIndex={-1} className="session-heading">Move {visibleMove + 1} of {session.length}</h1>
      <p>One piece at a time. Help is available.</p>
      <progress value={session.completed} max={session.length} aria-label="Completed session moves" />
      <PracticePlayer key={session.id + ':' + visibleMove}
        problem={sessionSets[session.set][visibleMove]} assessmentId={session.id}
        hideStepCounter completionLabel={visibleMove === session.length - 1 ? 'Finish session' : 'Next move'}
        onResolved={() => save({ ...session, completed: Math.max(session.completed, visibleMove + 1) })}
        onComplete={() => setVisibleMove(visibleMove + 1)} />
      <p className="fine-print" role="status">{saveError ? 'Progress is not saved.' : session.completed > visibleMove ? 'Move saved. You can pause here.' : 'Completed moves are saved on this browser.'}</p>
      <Link className="text-link" to="/">Pause and go home</Link>
    </section>}
  </div>;
}
