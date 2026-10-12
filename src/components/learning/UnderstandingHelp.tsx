import { useState } from "react";
export function UnderstandingHelp({
  explanations,
  onHelp,
}: {
  explanations: string[];
  onHelp?: () => void;
}) {
  const [level, setLevel] = useState(-1);
  return (
    <section className="help">
      <button
        className="text-button"
        onClick={() => {
          onHelp?.();
          setLevel((n) => (n === explanations.length - 1 ? 0 : n + 1));
        }}
      >
        {level < 0
          ? "I don’t understand"
          : level < explanations.length - 1
            ? "Make it simpler →"
            : "Start the explanation again"}
      </button>
      {level >= 0 && (
        <div aria-live="polite">
          <span className="eyebrow">
            {
              ["SIMPLER", "CONCRETE EXAMPLE", "WORKED EXAMPLE"][
                Math.min(level, 2)
              ]
            }
          </span>
          <p>{explanations[level]}</p>
        </div>
      )}
    </section>
  );
}
