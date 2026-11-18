import type { Point, StandardEquation, LinearSystem } from '../types/practice';
export type { StandardEquation, LinearSystem } from '../types/practice';
import { equation, formatNumber } from './linear';
export type SystemSolution = { kind: 'one'; point: Point } | { kind: 'none' | 'infinite' };
const nearZero = (n: number) => Math.abs(n) < 1e-9;
const cleanZero = (n: number) => nearZero(n) ? 0 : n;
export function satisfies(e: StandardEquation, p: Point) { return nearZero(e.a * p.x + e.b * p.y - e.c); }
export function solveSystem(s: LinearSystem): SystemSolution {
  const { first: p, second: q } = s;
  if ([p, q].some(e => nearZero(e.a) && nearZero(e.b) && !nearZero(e.c))) return { kind: 'none' };
  const determinant = p.a * q.b - q.a * p.b;
  if (!nearZero(determinant)) return { kind: 'one', point: {
    x: cleanZero((p.c * q.b - q.c * p.b) / determinant),
    y: cleanZero((p.a * q.c - q.a * p.c) / determinant),
  } };
  return { kind: nearZero(p.a * q.c - q.a * p.c) && nearZero(p.b * q.c - q.b * p.c) ? 'infinite' : 'none' };
}
export function scaleEquation(e: StandardEquation, factor: number): StandardEquation {
  return { a: e.a * factor, b: e.b * factor, c: e.c * factor };
}
export function combineEquations(p: StandardEquation, q: StandardEquation, operation: 'add' | 'subtract'): StandardEquation {
  const sign = operation === 'add' ? 1 : -1;
  return { a: p.a + sign * q.a, b: p.b + sign * q.b, c: p.c + sign * q.c };
}
export function formatStandard(e: StandardEquation): string {
  const terms = [[e.a, 'x'], [e.b, 'y']] as const;
  let text = '';
  for (const [value, variable] of terms) {
    if (nearZero(value)) continue;
    const coefficient = Math.abs(value) === 1 ? '' : Number.isInteger(value)
      ? formatNumber(Math.abs(value)) : '(' + formatNumber(Math.abs(value)) + ')';
    const sign = text ? (value < 0 ? ' − ' : ' + ') : (value < 0 ? '−' : '');
    text += sign + coefficient + variable;
  }
  return `${text || '0'} = ${formatNumber(e.c)}`;
}
export function slopeIntercept(e: StandardEquation) {
  if (nearZero(e.b)) throw new Error('This graph lesson requires a nonvertical line.');
  return { slope: -e.a / e.b, intercept: e.c / e.b };
}
export function lineEquation(e: StandardEquation) { const l = slopeIntercept(e); return equation(l.slope, l.intercept); }
export function formatSystem(s: LinearSystem) { return `A: ${formatStandard(s.first)}\nB: ${formatStandard(s.second)}`; }
export function formatPoint(p: Point) { return `(${formatNumber(p.x)}, ${formatNumber(p.y)})`; }
