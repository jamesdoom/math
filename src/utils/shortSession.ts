import { sessionSets } from '../data/chapters/chapter4Sessions';
import { graphSessionSets } from '../data/chapters/chapter4GraphSessions';
export const SESSION_KEY = 'algebra-lab.chapter4.short-session.v1';
export interface ShortSession { version: 1; id: string; set: number; length: number; completed: number; kind?: 'given' | 'graph' }
export function sessionMoves(session: ShortSession) {
  return (session.kind === 'graph' ? graphSessionSets : sessionSets)[session.set];
}
export function createSession(set = 0, length = 3, kind: 'given' | 'graph' = 'graph'): ShortSession {
  return { version: 1, id: crypto.randomUUID(), set: set % (kind === 'graph' ? graphSessionSets.length : sessionSets.length), length, completed: 0, kind };
}
export function parseSession(raw: string | null): ShortSession | null {
  try {
    const value: unknown = JSON.parse(raw ?? 'null');
    if (!value || typeof value !== 'object') return null;
    const s = value as Record<string, unknown>;
    if ((s.kind !== undefined && s.kind !== 'given' && s.kind !== 'graph') || s.version !== 1 || typeof s.id !== 'string' || !s.id ||
      typeof s.set !== 'number' || !Number.isInteger(s.set) || s.set < 0 || s.set >= (s.kind === 'graph' ? graphSessionSets.length : sessionSets.length) ||
      typeof s.length !== 'number' || !Number.isInteger(s.length) || s.length < 1 || s.length > 3 ||
      typeof s.completed !== 'number' || !Number.isInteger(s.completed) || s.completed < 0 || s.completed > s.length) return null;
    return s as unknown as ShortSession;
  } catch { return null; }
}
