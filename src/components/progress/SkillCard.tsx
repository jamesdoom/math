import type { SkillId } from "../../types/progress";
import { useProgress } from "../../context/ProgressContext";
import { mastery, masteryState, skillLabels } from "../../utils/mastery";
export function SkillCard({ id }: { id: SkillId }) {
  const { progress } = useProgress();
  const skill = progress.skills[id];
  const score = mastery(skill);
  const state = masteryState(skill);
  return (
    <div className="skill-row">
      <div>
        <strong>{skillLabels[id]}</strong>
        <span>
          {state.toLowerCase().replace("_", " ")}
          {skill.independentAttempts > 0 && score < 80
            ? " · Needs practice"
            : ""}
        </span>
      </div>
      <div className="skill-score">{score}%</div>
      <progress
        max="100"
        value={score}
        aria-label={`${skillLabels[id]} mastery`}
      />
    </div>
  );
}
