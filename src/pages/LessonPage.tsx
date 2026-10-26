import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { lessons, problems } from "../data/chapters/chapter4";
import type { Lesson } from "../types/curriculum";
import { useProgress } from "../context/ProgressContext";
import { GraphExplorer } from "../components/learning/GraphExplorer";
import { UnderstandingHelp } from "../components/learning/UnderstandingHelp";
import { ValueTable } from "../components/learning/ValueTable";
import { WorkedExample } from "../components/learning/WorkedExample";
import { PracticePlayer } from "../components/practice/PracticePlayer";
import { CoordinatePlane } from "../components/graph/CoordinatePlane";
export function LessonPage() {
  const { lessonId } = useParams();
  const lesson = lessons.find((l) => l.id === lessonId);
  return lesson ? (
    <LessonContent key={lesson.id} lesson={lesson} />
  ) : (
    <>
      <h1>Lesson not found</h1>
      <Link to="/chapter/4">Explore Chapter 4</Link>
    </>
  );
}
function LessonContent({ lesson }: { lesson: Lesson }) {
  const { progress, setPosition, completeLesson, markAssisted } = useProgress();
  const [position, setLocalPosition] = useState(
    Math.min(progress.lessonPositions[lesson.id] ?? 0, lesson.steps.length),
  );
  const [problemIndex, setProblemIndex] = useState(0);
  const [furthest, setFurthest] = useState(position);
  const panel = useRef<HTMLElement>(null);
  useEffect(() => {
    panel.current?.focus();
  }, [position, problemIndex]);
  const current = lesson.steps[position];
  function move(next: number) {
    setLocalPosition(next);
    setFurthest((n) => Math.max(n, next));
    setPosition(lesson.id, next);
    setProblemIndex(0);
  }
  function next() {
    if (position === lesson.steps.length - 1) completeLesson(lesson.id);
    move(position + 1);
  }
  const practice = current && "problemIds" in current ? current : null;
  const nextLesson = lessons[lessons.findIndex((l) => l.id === lesson.id) + 1];
  return (
    <>
      <div className="lesson-heading">
        <Link className="text-link" to="/chapter/4">
          ← Chapter 4
        </Link>
        <span className="muted">
          {Math.min(position + 1, lesson.steps.length)} / {lesson.steps.length}{" "}
          stages
        </span>
      </div>
      <h1 className="lesson-title">{lesson.title}</h1>
      <p className="source-note">
        {lesson.supplemental
          ? "Supplemental foundation · missing-page topics unverified"
          : lesson.source}
      </p>
      <div className="lesson-layout">
        <nav className="lesson-nav" aria-label="Lesson stages">
          {lesson.steps.map((step, index) => (
            <button
              key={step.id}
              disabled={index > furthest}
              aria-current={index === position ? "step" : undefined}
              onClick={() => move(index)}
            >
              <span>{index < position ? "✓" : index + 1}</span>
              {step.title}
            </button>
          ))}
          <p>
            Take your time.
            <br />
            Understanding comes first.
          </p>
        </nav>
        <section
          className="lesson-panel"
          key={position}
          ref={panel}
          tabIndex={-1}
          aria-label={current?.title ?? "Lesson complete"}
        >
          {current ? (
            <>
              <span className="eyebrow">
                {current.type.replaceAll("-", " ").toUpperCase()}
              </span>
              <h2>{current.title}</h2>
              <p className="lesson-intro">{current.body}</p>
              {current.type === "example" &&
              current.revealOneAtATime &&
              current.lines ? (
                <WorkedExample
                  lines={current.lines}
                  graph={current.graph}
                  table={current.table}
                />
              ) : (
                current.type === "example" && (
                  <>
                    {current.comparisonGraphs && (
                      <div className="graph-comparison">
                        {current.comparisonGraphs.map((graph) => (
                          <CoordinatePlane
                            key={graph.description}
                            spec={graph}
                          />
                        ))}
                      </div>
                    )}
                    {current.lines && (
                      <ol className="worked-example">
                        {current.lines.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ol>
                    )}
                    {current.table && <ValueTable points={current.table} />}
                  </>
                )
              )}
              {current.type === "visual" && current.interactive ? (
                <GraphExplorer />
              ) : "graph" in current &&
                current.graph &&
                !(current.type === "example" && current.revealOneAtATime) ? (
                <CoordinatePlane spec={current.graph} />
              ) : null}
              {practice && (
                <>
                  <div className="problem-count">
                    Practice {problemIndex + 1} of {practice.problemIds.length}
                  </div>
                  <PracticePlayer
                    key={practice.problemIds[problemIndex]}
                    problem={problems[practice.problemIds[problemIndex]]}
                    assessmentId={"lesson-" + lesson.id}
                    onComplete={() =>
                      problemIndex < practice.problemIds.length - 1
                        ? setProblemIndex(problemIndex + 1)
                        : next()
                    }
                  />
                </>
              )}
              <UnderstandingHelp
                explanations={lesson.support}
                onHelp={() => {
                  if (practice) {
                    const p = problems[practice.problemIds[problemIndex]];
                    p.steps.forEach((s) =>
                      markAssisted(`lesson-${lesson.id}:${p.id}:${s.id}`),
                    );
                  }
                }}
              />
              {!practice && (
                <button className="primary" onClick={next}>
                  Continue →
                </button>
              )}
            </>
          ) : (
            <div className="completion">
              <span className="tag">LESSON COMPLETE</span>
              <h2>You made a connection.</h2>
              <p>
                You worked through {lesson.title.toLowerCase()}. Your actual
                answers update this skill’s progress.
              </p>
              <div className="round-actions">
                {nextLesson && (
                  <Link className="primary" to={"/lesson/" + nextLesson.id}>
                    Next lesson →
                  </Link>
                )}
                <Link className="text-link" to="/">
                  See my progress
                </Link>
                <Link className="text-link" to="/practice">
                  Practice this chapter
                </Link>
                <button className="text-button" onClick={() => move(0)}>
                  Review the lesson
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
