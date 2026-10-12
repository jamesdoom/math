import type { Point } from "../../types/practice";
export function ValueTable({ points }: { points: Point[] }) {
  return (
    <table className="value-table">
      <caption>Input and output values</caption>
      <thead>
        <tr>
          <th scope="col">x · input</th>
          <th scope="col">y · output</th>
          <th scope="col">Point (x, y)</th>
        </tr>
      </thead>
      <tbody>
        {points.map((p, i) => (
          <tr key={i}>
            <td>{p.x}</td>
            <td>{p.y}</td>
            <td>
              ({p.x}, {p.y})
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
