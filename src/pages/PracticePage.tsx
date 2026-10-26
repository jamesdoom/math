import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import {
  practiceSkills,
  independentProblemMap,
} from "../data/chapters/chapter4Practice";
import { PracticePlayer } from "../components/practice/PracticePlayer";
import { SkillCard } from "../components/progress/SkillCard";
import { lessons } from "../data/chapters/chapter4";
import { skillLabels } from "../utils/mastery";
import {
  createRound,
  parseRound,
  ROUND_STORAGE_KEY,
  type PracticeRound,
  type PracticeSelection,
} from "../utils/practiceRounds";
export function PracticePage() {
  const { progress } = useProgress();
  const [round, setRound] = useState<PracticeRound | null>(() => {
    try {
      return parseRound(localStorage.getItem(ROUND_STORAGE_KEY));
    } catch {
      return null;
    }
  });
  const [saveError, setSaveError] = useState(false);
  const panel = useRef<HTMLElement>(null);
  useEffect(() => {
    try {
      if (round) localStorage.setItem(ROUND_STORAGE_KEY, JSON.stringify(round));
      else localStorage.removeItem(ROUND_STORAGE_KEY);
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }, [round]);
  useEffect(() => {
    if (round) panel.current?.focus();
  }, [round?.id, round?.index]);
  function start(selection: PracticeSelection) {
    setRound(
      createRound(selection, progress.practiceEvidence, crypto.randomUUID()),
    );
  }
  const complete = round && round.index === round.problemIds.length;
  const evidence = round
    ? round.problemIds.map(
        (id) => progress.practiceEvidence[`${round.id}:${id}:check`],
      )
    : [];
  return (
    <>
      <Link className="text-link" to="/">
        ← My learning
      </Link>
      <div className="page-heading practice-heading">
        <span className="eyebrow">CHAPTER 04 · KEEP BUILDING</span>
        <h1>
          Practice a little.
          <br />
          <span>Understand a little more.</span>
        </h1>
        <p>
          Section 4.1 only. Start with small steps, then write a whole equation.
        </p>
      </div>
      {saveError && (
        <p className="callout" role="alert">
          This browser could not save your practice round. It may restart on
          refresh.
        </p>
      )}
      {!round ? (
        <>
          <section className="lesson-banner">
            <div>
              <span className="tag">START SMALL</span>
              <h2>Build the equation one piece at a time</h2>
              <p>Use the guided learning path before trying a whole problem.</p>
            </div>
            <Link className="primary" to={"/lesson/" + lessons[0].id}>
              Start bite-size learning →
            </Link>
          </section>
          <section className="lesson-banner">
            <div>
              <span className="tag">A LITTLE OF EVERYTHING</span>
              <h2>Connect the five skills</h2>
              <p>5 problems · 1 per skill · hints available</p>
            </div>
            <button className="primary" onClick={() => start("mixed")}>
              Start mixed practice →
            </button>
          </section>
          <div className="topic-grid">
            {practiceSkills.map((skill) => (
              <section className="topic-card" key={skill}>
                <span className="eyebrow">FOCUS ON ONE SKILL</span>
                <h2>{skillLabels[skill]}</h2>
                <p>3 short problems from 6 examples · hints available.</p>
                <button className="primary" onClick={() => start(skill)}>
                  Practice {skillLabels[skill].toLowerCase()} →
                </button>
                <p>
                  <Link
                    className="text-link"
                    to={
                      "/lesson/" +
                      lessons.find((l) => l.skills.includes(skill))!.id
                    }
                  >
                    Build with help first →
                  </Link>
                </p>
              </section>
            ))}
          </div>
          <p className="fine-print">
            Rounds favor problems you have checked independently less often.
            Your first unassisted answer counts toward mastery. Hints and
            retries count as learning.
          </p>
        </>
      ) : (
        <section
          ref={panel}
          tabIndex={-1}
          className="lesson-panel practice-round"
          aria-label={complete ? "Practice round complete" : "Practice round"}
        >
          {complete ? (
            <>
              <span className="tag">ROUND COMPLETE</span>
              <h2>You made time to learn.</h2>
              <p>
                {evidence.filter((value) => value === "correct").length} correct
                independently out of{" "}
                {
                  evidence.filter(
                    (value) => value === "correct" || value === "incorrect",
                  ).length
                }{" "}
                independent checks.{" "}
                {evidence.filter((value) => value === "assisted").length}{" "}
                started with hints or a worked solution.
              </p>
              <p>
                Using help is part of learning. Try another varied round when
                you feel ready.
              </p>
              <div className="skills-panel">
                {(round.selection === "mixed"
                  ? practiceSkills
                  : [round.selection]
                ).map((skill) => (
                  <SkillCard key={skill} id={skill} />
                ))}
              </div>
              <div className="round-actions">
                <button
                  className="primary"
                  onClick={() => start(round.selection)}
                >
                  Try another round →
                </button>
                <button className="text-button" onClick={() => setRound(null)}>
                  Choose a different skill
                </button>
                <Link className="text-link" to="/">
                  See dashboard
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="practice-top">
                <span className="eyebrow">
                  {round.selection === "mixed"
                    ? "MIXED PRACTICE"
                    : skillLabels[round.selection].toUpperCase()}
                </span>
                <span>
                  Problem {round.index + 1} of {round.problemIds.length}
                </span>
              </div>
              <progress
                value={round.index}
                max={round.problemIds.length}
                aria-label="Practice round progress"
              />
              <PracticePlayer
                key={`${round.id}:${round.index}`}
                assessmentId={round.id}
                problem={independentProblemMap[round.problemIds[round.index]]}
                onComplete={() =>
                  setRound({ ...round, index: round.index + 1 })
                }
              />
              <div className="round-footer">
                <Link className="text-link" to="/">
                  Pause and return to dashboard
                </Link>
                <p className="fine-print">
                  Your place and assistance status stay saved after refresh.
                </p>
              </div>
            </>
          )}
        </section>
      )}
    </>
  );
}
