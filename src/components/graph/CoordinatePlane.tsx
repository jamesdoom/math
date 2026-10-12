import { useId } from "react";
import type { GraphSpec, Point } from "../../types/practice";
import { graphBounds, lineEndpoints } from "../../utils/linear";
export function CoordinatePlane({ spec }: { spec: GraphSpec }) {
  const id = useId().replace(/:/g, "");
  const bounds = graphBounds(spec);
  const { xMin, xMax, yMin, yMax } = bounds;
  const px = (x: number) => 50 + ((x - xMin) / (xMax - xMin)) * 400;
  const py = (y: number) => 420 - ((y - yMin) / (yMax - yMin)) * 360;
  const xStep = Math.max(1, Math.ceil((xMax - xMin) / 12));
  const yStep = Math.max(1, Math.ceil((yMax - yMin) / 12));
  const xs = Array.from(
    { length: Math.floor((xMax - xMin) / xStep) + 1 },
    (_, i) => xMin + i * xStep,
  );
  const ys = Array.from(
    { length: Math.floor((yMax - yMin) / yStep) + 1 },
    (_, i) => yMin + i * yStep,
  );
  const endpoints =
    spec.model.kind === "line"
      ? lineEndpoints(spec.model.slope, spec.model.intercept, bounds)
      : spec.model.kind === "vertical"
        ? [
            { x: spec.model.x, y: yMin },
            { x: spec.model.x, y: yMax },
          ]
        : [];
  const points: Point[] =
    spec.model.kind === "points" ? spec.model.points : (spec.points ?? []);
  const triangle =
    spec.slopeTriangle &&
    points.length === 2 &&
    points.every(
      (p) => p.x >= xMin && p.x <= xMax && p.y >= yMin && p.y <= yMax,
    );
  return (
    <figure className="coordinate-plane">
      <svg viewBox="0 0 500 480" role="img" aria-labelledby={id + "title"}>
        <title id={id + "title"}>{spec.description}</title>
        <defs>
          <clipPath id={id + "clip"}>
            <rect x="50" y="60" width="400" height="360" />
          </clipPath>
          <marker
            id={id + "arrow"}
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10Z" fill="#c8ed9f" />
          </marker>
        </defs>
        {xs.map((x) => (
          <g key={"x" + x}>
            <line
              className="grid-line"
              x1={px(x)}
              x2={px(x)}
              y1="60"
              y2="420"
            />
            <text x={px(x)} y="445" textAnchor="middle">
              {x}
            </text>
          </g>
        ))}
        {ys.map((y) => (
          <g key={"y" + y}>
            <line
              className="grid-line"
              x1="50"
              x2="450"
              y1={py(y)}
              y2={py(y)}
            />
            <text x="39" y={py(y) + 5} textAnchor="end">
              {y}
            </text>
          </g>
        ))}
        {xMin <= 0 && xMax >= 0 && (
          <line className="graph-axis" x1={px(0)} x2={px(0)} y1="60" y2="420" />
        )}
        {yMin <= 0 && yMax >= 0 && (
          <line className="graph-axis" x1="50" x2="450" y1={py(0)} y2={py(0)} />
        )}
        <g clipPath={"url(#" + id + "clip)"}>
          {endpoints.length === 2 && (
            <line
              className="graph-line"
              x1={px(endpoints[0].x)}
              y1={py(endpoints[0].y)}
              x2={px(endpoints[1].x)}
              y2={py(endpoints[1].y)}
              markerStart={"url(#" + id + "arrow)"}
              markerEnd={"url(#" + id + "arrow)"}
            />
          )}{" "}
          {triangle && (
            <g className="slope-triangle">
              <path
                d={`M ${px(points[0].x)} ${py(points[0].y)} H ${px(points[1].x)} V ${py(points[1].y)}`}
                fill="none"
                stroke="#f2dc8c"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
              <text
                x={(px(points[0].x) + px(points[1].x)) / 2}
                y={py(points[0].y) + 23}
                textAnchor="middle"
              >
                run {points[1].x - points[0].x}
              </text>
              <text
                x={px(points[1].x) + 8}
                y={(py(points[0].y) + py(points[1].y)) / 2}
              >
                rise {points[1].y - points[0].y}
              </text>
            </g>
          )}
          {points.map((p, i) => (
            <circle
              className="graph-point"
              key={i}
              cx={px(p.x)}
              cy={py(p.y)}
              r="5"
            />
          ))}
        </g>
        <text x="250" y="474" textAnchor="middle">
          {spec.xLabel ?? "x · input"}
        </text>
        <text x="55" y="37">
          {spec.yLabel ?? "y · output"}
        </text>
      </svg>
      <figcaption>{spec.description}</figcaption>
    </figure>
  );
}
