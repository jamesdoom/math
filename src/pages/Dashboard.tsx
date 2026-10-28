import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import { lessons } from "../data/chapters/chapter4";
import { skillIds } from "../types/progress";
import { overallMastery } from "../utils/mastery";
import { SkillCard } from "../components/progress/SkillCard";
import { parseSession, SESSION_KEY } from "../utils/shortSession";

export function Dashboard() {
  const { progress } = useProgress();
  let session = null;
  try { session = parseSession(localStorage.getItem(SESSION_KEY)); } catch { /* Storage warning appears in the session. */ }
  const finished = session !== null && session.completed === session.length;
  const resuming = session !== null && session.completed > 0 && !finished;
  const score = overallMastery(progress);

  return (
    <div className="start-page">
      <section className="start-card" aria-labelledby="start-title">
        <span className="eyebrow">CHAPTER 4 · WRITING LINEAR EQUATIONS</span>
        <h1 id="start-title">{finished ? "You’re done for today." : "One small step today."}</h1>
        <p className="start-intro">{finished ? "Your session is complete. You can stop here." : "Build an equation, one piece at a time."}</p>
        <div className="start-task">
          <span className="eyebrow">{finished ? "SESSION COMPLETE" : "YOUR SHORT SESSION"}</span>
          <h2>{session && session.kind !== 'graph' ? 'Build an equation from slope and intercept' : 'Build an equation from a graph'}</h2>
          <p>{session?.length ?? 3} small moves. Help is available as you go.</p>
        </div>
        <Link className={finished ? "text-link" : "primary"} to="/session">
          {finished ? "View finished session" : resuming ? "Continue with help" : "Start with help"}
        </Link>
        <p className="start-reassurance">No timer. You can pause and come back.</p>
      </section>

      <details className="start-details">
        <summary>View progress</summary>
        <div className="start-details-body">
          <p>{progress.completedLessons.length} of {lessons.length} lessons completed · {progress.xp} XP</p>
          <div className="mastery-line"><span>Chapter mastery</span><strong>{score}%</strong></div>
          <progress value={score} max={100} aria-label="Chapter mastery" />
          <p className="fine-print">Mastery reflects independent answers. Using help is part of learning.</p>
          <section className="skills-panel" aria-label="Skill progress">
            {skillIds.map((id) => <SkillCard key={id} id={id} />)}
          </section>
        </div>
      </details>
      <details className="start-details">
        <summary>Choose another activity</summary>
        <div className="start-details-body start-alternatives">
          <Link className="text-link" to="/chapter/4">Browse Chapter 4 lessons</Link>
          <Link className="text-link" to="/practice">Choose independent practice</Link>
        </div>
      </details>
    </div>
  );
}
