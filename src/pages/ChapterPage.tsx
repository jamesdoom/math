import { Link } from "react-router-dom";
import { chapter4 } from "../data/chapters/chapter4";
import { useProgress } from "../context/ProgressContext";
export function ChapterPage() {
  const { progress } = useProgress();
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">CHAPTER 04 · YOUR ROADMAP</span>
        <h1>Writing Linear Equations</h1>
        <p>{chapter4.description}</p>
      </div>
      <aside className="callout">
        Start small: find m, find b, then build the equation. This learning path
        covers only section 4.1 on your supplied page 1. Later Chapter 4 topics
        are not included yet.
      </aside>
      <div className="topic-grid">
        {chapter4.topics.map((topic, index) => (
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
