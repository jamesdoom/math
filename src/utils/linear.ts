import type { GraphSpec, Point, ProblemStep } from "../types/practice";
export function evaluateLinear(slope: number, intercept: number, x: number) {
  return slope * x + intercept;
}
export function slopeBetween(a: Point, b: Point): number | null {
  if (a.x === b.x && a.y === b.y) throw new Error("Choose two distinct points");
  return a.x === b.x ? null : (b.y - a.y) / (b.x - a.x);
}
export function intercepts(slope: number, intercept: number) {
  return {
    y: { x: 0, y: intercept },
    x:
      slope === 0
        ? intercept === 0
          ? ("all" as const)
          : null
        : { x: -intercept / slope, y: 0 },
  };
}
export function formatNumber(value: number): string {
  if (Number.isInteger(value)) return String(value).replace("-", "−");
  for (let d = 2; d <= 20; d++) {
    const n = Math.round(value * d);
    if (Math.abs(n / d - value) < 1e-9) return `${n}/${d}`.replace("-", "−");
  }
  return String(Number(value.toFixed(3))).replace("-", "−");
}
export function equation(m: number, b: number) {
  if (m === 0) return `y = ${formatNumber(b)}`;
  return `y = ${m === 1 ? "" : m === -1 ? "−" : formatNumber(m)}x${b === 0 ? "" : b > 0 ? " + " + formatNumber(b) : " − " + formatNumber(-b)}`;
}
export function evaluateChoice(step: ProblemStep, choiceId: string) {
  const choice = step.choices.find((c) => c.id === choiceId);
  if (!choice) throw new Error("Unknown choice");
  const correct = choiceId === step.answer;
  return {
    correct,
    misconception: choice.misconception,
    feedback: correct
      ? step.explanation
      : (choice.misconception?.feedback ??
        "Compare the values again, one step at a time."),
  };
}
export function graphBounds(spec: GraphSpec) {
  return spec.bounds ?? { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };
}
export function lineEndpoints(
  m: number,
  b: number,
  bounds: ReturnType<typeof graphBounds>,
): Point[] {
  const candidates: Point[] = [];
  const add = (x: number, y: number) => {
    if (
      x >= bounds.xMin - 1e-9 &&
      x <= bounds.xMax + 1e-9 &&
      y >= bounds.yMin - 1e-9 &&
      y <= bounds.yMax + 1e-9 &&
      !candidates.some(
        (p) => Math.abs(p.x - x) < 1e-9 && Math.abs(p.y - y) < 1e-9,
      )
    )
      candidates.push({ x, y });
  };
  add(bounds.xMin, m * bounds.xMin + b);
  add(bounds.xMax, m * bounds.xMax + b);
  if (m !== 0) {
    add((bounds.yMin - b) / m, bounds.yMin);
    add((bounds.yMax - b) / m, bounds.yMax);
  }
  return candidates.slice(0, 2);
}
