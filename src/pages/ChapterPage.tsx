import { Link } from "react-router-dom";
import { chapter5 } from "../data/chapters/chapter5";
import { useProgress } from "../context/ProgressContext";
export function ChapterPage() {
  const { progress } = useProgress();
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">CHAPTER 05 · YOUR ROADMAP</span>
        <h1>Systems of Equations</h1>
        <p>{chapter5.description}</p>
      </div>
      <aside className="callout">
        Start with one pair and two checks. Then find shared points on graphs,
        or eliminate a variable using aligned equations. This path follows only
        the supplied notes for sections 5.1 and 5.2.
      </aside>
      <div className="topic-grid">
        {chapter5.topics.map((topic, index) => (
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
              <div key={l.id} className="chapter-lesson">
                <h3>{l.title}</h3>
                <p className="source-note">{l.source}</p>
                <Link className="primary" to={"/lesson/" + l.id}
                  aria-label={(progress.completedLessons.includes(l.id) ? 'Review ' : 'Open ') + l.title}>
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
