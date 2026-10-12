import { useState, useId } from "react";
import { CoordinatePlane } from "../graph/CoordinatePlane";
import { equation } from "../../utils/linear";
export function GraphExplorer() {
  const id = useId();
  const [m, setM] = useState(1);
  const [b, setB] = useState(2);
  return (
    <>
      <div className="explorer-controls">
        <div>
          <label htmlFor={id + "m"}>Slope m</label>
          <select
            id={id + "m"}
            value={m}
            onChange={(e) => setM(Number(e.target.value))}
          >
            {[-3, -2, -1, -0.5, 0, 0.5, 1, 2, 3].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={id + "b"}>Intercept b</label>
          <select
            id={id + "b"}
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
          >
            {[-4, -2, 0, 2, 4].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>
        <div className="math">{equation(m, b)}</div>
      </div>
      <CoordinatePlane
        spec={{
          model: { kind: "line", slope: m, intercept: b },
          slopeTriangle: true,
          points: [
            { x: 0, y: b },
            { x: 1, y: m + b },
          ],
          description: `${equation(m, b)}. The y-intercept is (0, ${b}). Moving right 1 changes y by ${m}.`,
        }}
      />
      <div className="reason-grid">
        <div>
          <strong>m changes the steepness</strong>
          <p>
            {m === 0
              ? "Zero slope gives a horizontal line."
              : m > 0
                ? "Positive slope rises from left to right."
                : "Negative slope falls from left to right."}
          </p>
        </div>
        <div>
          <strong>b changes the starting height</strong>
          <p>
            The line crosses the y-axis at (0, {b}). Changing b moves the line
            up or down.
          </p>
        </div>
      </div>
    </>
  );
}
