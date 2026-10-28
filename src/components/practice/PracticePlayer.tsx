import { useState, useEffect, useRef } from "react";
import type { PracticeProblem } from "../../types/practice";
import { evaluateChoice } from "../../utils/linear";
import { useProgress } from "../../context/ProgressContext";
import { CoordinatePlane } from "../graph/CoordinatePlane";
import { ValueTable } from "../learning/ValueTable";
import { OptionalExplanation } from "../learning/OptionalExplanation";
import { supportFor, successFor } from "../../data/chapters/chapter4Support";
import { PracticeSupportPanel } from "./PracticeSupportPanel";
export function PracticePlayer({
  problem,
  onComplete,
  assessmentId,
  onResolved,
  completionLabel,
  hideStepCounter = false,
}: {
  problem: PracticeProblem;
  onComplete: () => void;
  assessmentId?: string;
  onResolved?: () => void;
  completionLabel?: string;
  hideStepCounter?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [correct, setCorrect] = useState(false);
  const [helpLevel, setHelpLevel] = useState(0);
  const [assisted, setAssisted] = useState(false);
  const [solutionShown, setSolutionShown] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [supportMode, setSupportMode] = useState<'move' | 'example' | null>(null);
  const { recordAttempt, markAssisted } = useProgress();
  const current = problem.steps[index];
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (index > 0) heading.current?.focus();
  }, [index]);
  function choose(id: string) {
    const result = evaluateChoice(current, id);
    recordAttempt({
      skill: current.skill,
      correct: result.correct,
      // Feedback-assisted retries are learning, not new independent evidence.
      independent:
        problem.mode === "independent" &&
        !assisted &&
        !attempted &&
        !solutionShown,
      stepKey: `${problem.id}:${current.id}`,
      evidenceKey: assessmentId
        ? `${assessmentId}:${problem.id}:${current.id}`
        : undefined,
      misconception: result.misconception?.id,
    });
    setAttempted(true);
    setFeedback(result.feedback);
    setCorrect(result.correct);
    if (result.correct) onResolved?.();
  }
  function next() {
    if (index === problem.steps.length - 1) {
      onComplete();
      return;
    }
    setIndex(index + 1);
    setFeedback("");
    setCorrect(false);
    setHelpLevel(0);
    setAssisted(solutionShown);
    setAttempted(false);
  }
  function markHelpUsed(allSteps = false) {
    setAssisted(true);
    if (assessmentId) {
      (allSteps ? problem.steps : [current]).forEach(step =>
        markAssisted(`${assessmentId}:${problem.id}:${step.id}`),
      );
    }
  }
  if (supportMode) return <PracticeSupportPanel support={supportFor(current)} mode={supportMode} onReturn={() => {
    setSupportMode(null);
    // The original problem keeps its answer/feedback state; restore keyboard context.
    requestAnimationFrame(() => heading.current?.focus());
  }} />;
  return (
    <div className="practice">
      <div className="practice-top">
        <span className="eyebrow">
          {problem.mode === "guided" ? "GUIDED PRACTICE" : "MASTERY CHECK"}
        </span>
        {!hideStepCounter && <span>
          Step {index + 1} of {problem.steps.length}
        </span>}
      </div>
      <p>{problem.prompt}</p>
      <div className="equation">
        {correct && index === problem.steps.length - 1
          ? problem.answer
          : current.expression}
      </div>
      {current.table && <ValueTable points={current.table} />}
      <h3 ref={heading} tabIndex={-1}>
        {current.prompt}
      </h3>
      {current.graph && <CoordinatePlane spec={current.graph}
        pointChoices={current.pointChoices} onSelect={choose}
        disabled={correct || helpLevel === 4} selected={correct ? current.answer : undefined} />}
      <div className="choices">
        {current.choices.map((choice) => (
          <button
            key={choice.id}
            className={
              correct && choice.id === current.answer
                ? "correct-choice"
                : undefined
            }
            disabled={correct || helpLevel === 4}
            onClick={() => choose(choice.id)}
          >
            {choice.label}
          </button>
        ))}
      </div>
      {feedback && (
        <div className={`feedback ${correct ? "success" : ""}`} role="status">
          <strong>
            {correct ? successFor(current) : "Let’s look at this step."}
          </strong>
          {correct ? <OptionalExplanation text={feedback} /> : <p>{feedback}</p>}
        </div>
      )}
      {correct &&
        problem.solutionGraph &&
        index === problem.steps.length - 1 && (
          <CoordinatePlane spec={problem.solutionGraph} />
        )}
      {!correct && (
        <div className="hint-area">
          <button
            className="text-button"
            disabled={helpLevel === 4}
            onClick={() => {
              setHelpLevel((n) => Math.min(n + 1, 4));
              markHelpUsed(helpLevel === 3);
              if (helpLevel === 2) setSupportMode('move');
              if (helpLevel === 3) { setSolutionShown(true); onResolved?.(); }
            }}
          >
            {
              [
                "Give me a clue",
                "Another clue",
                "Show one move",
                "Show solution",
                "Solution shown",
              ][helpLevel]
            }
          </button>
          {helpLevel < 2 && <button className="text-button" onClick={() => {
            markHelpUsed(); setHelpLevel(3); setSupportMode('move');
          }}>Show one move</button>}
          {helpLevel < 4 && <button className="text-button" onClick={() => {
            markHelpUsed(); setSupportMode('example');
          }}>Try an easier example</button>}
          {helpLevel > 0 && (
            <div aria-live="polite">
              {helpLevel <= 2 ? (
                <p>{current.hints[helpLevel - 1]?.text}</p>
              ) : helpLevel === 3 ? (
                <p>
                  Your problem is still here. Use the same idea from the worked example.
                </p>
              ) : (
                <>
                  <ol>
                    {problem.workedSolution.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ol>
                  <p className="muted">
                    You reviewed this problem with help. You can move on when ready.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}
      {(correct || helpLevel === 4) && (
        <button className="primary" onClick={next}>
          {index === problem.steps.length - 1 ? (completionLabel ?? "Continue →") : "Next step →"}
        </button>
      )}
    </div>
  );
}
