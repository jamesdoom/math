import { Link } from "react-router-dom";
import { chapter3 } from "../data/chapters/chapter3";
import { useProgress } from "../context/ProgressContext";
export function ChapterPage() {
  const { progress } = useProgress();
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">CHAPTER 03 · YOUR ROADMAP</span>
        <h1>Linear Functions</h1>
        <p>{chapter3.description}</p>
      </div>
      <aside className="callout">
        Pages 1–2 are now integrated: linear versus nonlinear functions and
        discrete versus continuous domains. The PDF file numbered pages 5–6
        remains missing; its exact contents are unverified.
      </aside>
      <div className="topic-grid">
        {chapter3.topics.map((topic, index) => (
          <section className="topic-card" key={topic.id}>
            <div className="card-top">
              <span className="topic-number">0{index + 1}</span>
              <span className="tag">
                {topic.lessons.every((l) => l.supplemental)
                  ? "SUPPLEMENTAL"
                  : topic.lessons.some((l) => l.supplemental)
                    ? "INCLUDES SUPPLEMENT"
                    : "FROM CLASS NOTES"}
              </span>
            </div>
            <h2>{topic.title}</h2>
            <p>{topic.description}</p>
            <ul>
              {topic.objectives.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
            {topic.lessons.map((l) => (
              <div key={l.id}>
                <p className="source-note">{l.source}</p>
                <Link className="primary" to={"/lesson/" + l.id}>
                  {progress.completedLessons.includes(l.id)
                    ? "Review lesson"
                    : "Open lesson"}{" "}
                  →
                </Link>
              </div>
            ))}
          </section>
        ))}
      </div>
    </>
  );
}
