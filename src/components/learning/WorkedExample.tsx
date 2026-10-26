import { useState } from "react";
import type { GraphSpec, Point } from "../../types/practice";
import { CoordinatePlane } from "../graph/CoordinatePlane";
import { ValueTable } from "./ValueTable";
export function WorkedExample({
  lines,
  graph,
  table,
}: {
  lines: string[];
  graph?: GraphSpec;
  table?: Point[];
}) {
  const [index, setIndex] = useState(0);
  return (
    <section
      className="small-example"
      aria-label="Worked example, one step at a time"
    >
      {table && <ValueTable points={table} />}
      <p className="eyebrow">
        SMALL STEP {index + 1} OF {lines.length}
      </p>
      <div className="example-move" aria-live="polite">
        {lines[index]}
      </div>
      <div className="round-actions">
        <button
          className="text-button"
          disabled={index === 0}
          onClick={() => setIndex((n) => n - 1)}
        >
          Previous step
        </button>
        {index < lines.length - 1 ? (
          <button className="primary" onClick={() => setIndex((n) => n + 1)}>
            Next small step →
          </button>
        ) : (
          <span className="muted">
            Example complete · ready to build with help
          </span>
        )}
      </div>
      {index === lines.length - 1 && graph && <CoordinatePlane spec={graph} />}
    </section>
  );
}
