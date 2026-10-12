import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import { lessons } from "../data/chapters/chapter3";
import { independentProblems } from "../data/chapters/chapter3Practice";
import { skillIds } from "../types/progress";
import { overallMastery, mastery, skillLabels } from "../utils/mastery";
import { SkillCard } from "../components/progress/SkillCard";
import { CoordinatePlane } from "../components/graph/CoordinatePlane";
export function Dashboard() {
  const { progress } = useProgress();
  const current =
    lessons.find((l) => !progress.completedLessons.includes(l.id)) ??
    lessons[0];
  const score = overallMastery(progress);
  const strengths = skillIds.filter(
    (id) =>
      progress.skills[id].independentAttempts > 0 &&
      mastery(progress.skills[id]) >= 80,
  );
  const needs = skillIds.filter(
    (id) =>
      progress.skills[id].independentAttempts > 0 &&
      mastery(progress.skills[id]) < 80,
  );
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">YOUR LEARNING SPACE · CHAPTER 3</span>
        <h1>
          See the pattern.
          <br />
          <span>Understand the line.</span>
        </h1>
        <p>
          Tables, graphs, and equations tell the same story.
          <br />
          Let’s connect them, one step at a time.
        </p>
      </div>
      <div className="dashboard-grid">
        <section className="hero-card">
          <div className="card-top">
            <span className="tag">CHAPTER 03</span>
            <span className="muted">{lessons.length} focused lessons</span>
          </div>
          <h2>Linear Functions</h2>
          <p>From one input to a whole picture.</p>
          <CoordinatePlane
            spec={{
              model: { kind: "line", slope: 1, intercept: 2 },
              points: [
                { x: 0, y: 2 },
                { x: 2, y: 4 },
              ],
              description: "Example: y = x + 2. Each step right 1 goes up 1.",
            }}
          />
          <div className="mastery-line">
            <span>Chapter mastery</span>
            <strong>{score}%</strong>
          </div>
          <progress value={score} max={100} aria-label="Chapter mastery" />
          <div className="hero-actions">
            <Link className="primary" to={"/lesson/" + current.id}>
              Continue learning →
            </Link>
            <Link className="text-link" to="/chapter/3">
              Explore chapter
            </Link>
          </div>
        </section>
        <aside className="next-card">
          <span className="eyebrow">YOUR NEXT SMALL STEP</span>
          <div className="lesson-icon">y = mx + b</div>
          <h2>{current.title}</h2>
          <p>{current.description}</p>
          <div className="lesson-meta">
            <span>At your own pace</span>
            <span>5 lesson stages</span>
          </div>
          <div className="status-pill">
            {current.supplemental
              ? "Supplemental foundation · clearly labeled"
              : "Original instruction based on your class notes"}
          </div>
          <p className="fine-print">
            {progress.completedLessons.length} of {lessons.length} lessons
            completed
          </p>
        </aside>
      </div>
      <div className="section-title">
        <div>
          <span className="eyebrow">PROGRESS WITH A PURPOSE</span>
          <h2>Your Chapter 3 skills</h2>
        </div>
      </div>
      <section className="skills-panel">
        {skillIds.map((id) => (
          <SkillCard key={id} id={id} />
        ))}
      </section>
      <section className="lesson-banner practice-entry">
        <div>
          <span className="eyebrow">BUILD YOUR EVIDENCE</span>
          <h2>Same idea. Fresh examples.</h2>
          <p>
            {independentProblems.length} original independent questions across
            seven skills. Hints are always available.
          </p>
        </div>
        <Link className="primary" to="/practice">
          Choose practice →
        </Link>
      </section>
      <div className="insights">
        <div>
          <strong>Skill strengths</strong>
          <p>
            {strengths.length
              ? strengths.map((id) => skillLabels[id]).join(", ")
              : "Your independent answers will show what is clicking."}
          </p>
        </div>
        <div>
          <strong>Where to focus</strong>
          <p>
            {needs.length
              ? needs.map((id) => skillLabels[id]).join(", ")
              : "Begin a lesson to discover your next practice area."}
          </p>
        </div>
      </div>
      <p className="fine-print">
        Chapter 3 starts with fresh progress. Scores reflect your actual
        independent answers, not demo data.
      </p>
    </>
  );
}
