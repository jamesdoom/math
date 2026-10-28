import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import { lessons } from "../data/chapters/chapter4";
import { skillIds } from "../types/progress";
import { overallMastery } from "../utils/mastery";
import { SkillCard } from "../components/progress/SkillCard";

export function Dashboard() {
  const { progress } = useProgress();
  const unfinished = lessons.find((lesson) => !progress.completedLessons.includes(lesson.id));
  const current = unfinished ?? lessons[0];
  const resuming = unfinished !== undefined && (progress.lessonPositions[current.id] ?? 0) > 0;
  const score = overallMastery(progress);

  return (
    <div className="start-page">
      <section className="start-card" aria-labelledby="start-title">
        <span className="eyebrow">CHAPTER 4 · WRITING LINEAR EQUATIONS</span>
        <h1 id="start-title">One small step today.</h1>
        <p className="start-intro">{unfinished ? "Build an equation, one piece at a time." : "Revisit an idea with help, at your own pace."}</p>
        <div className="start-task">
          <span className="eyebrow">{unfinished ? "YOUR NEXT LESSON" : "REVIEW WITH HELP"}</span>
          <h2>{current.title}</h2>
          <p>First, one idea. Then, an example. Help is available as you go.</p>
        </div>
        <Link className="primary" to={"/lesson/" + current.id}>
          {resuming ? "Continue with help" : "Start with help"}
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
