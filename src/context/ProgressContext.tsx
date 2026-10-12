import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { StudentProgress } from "../types/progress";
import { emptyProgress, parseProgress, STORAGE_KEY } from "../utils/storage";
import {
  recordProgressAttempt,
  markProgressAssisted,
  type Attempt,
} from "../utils/progress";
interface ProgressValue {
  progress: StudentProgress;
  storageError: boolean;
  recordAttempt: (attempt: Attempt) => void;
  setPosition: (id: string, position: number) => void;
  completeLesson: (id: string) => void;
  markAssisted: (evidenceKey: string) => void;
}
const ProgressContext = createContext<ProgressValue | null>(null);
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [storageError, setStorageError] = useState(false);
  const [progress, setProgress] = useState(() => {
    try {
      return parseProgress(localStorage.getItem(STORAGE_KEY));
    } catch {
      return emptyProgress();
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [progress]);
  function update(transform: (p: StudentProgress) => StudentProgress) {
    setProgress(transform);
  }
  function recordAttempt(a: Attempt) {
    update((p) => recordProgressAttempt(p, a));
  }
  return (
    <ProgressContext.Provider
      value={{
        progress,
        storageError,
        recordAttempt,
        markAssisted: (evidenceKey) =>
          update((p) => markProgressAssisted(p, evidenceKey)),
        setPosition: (id, position) =>
          update((p) => ({
            ...p,
            lessonPositions: { ...p.lessonPositions, [id]: position },
          })),
        completeLesson: (id) =>
          update((p) => ({
            ...p,
            completedLessons: p.completedLessons.includes(id)
              ? p.completedLessons
              : [...p.completedLessons, id],
          })),
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("ProgressProvider missing");
  return context;
}
