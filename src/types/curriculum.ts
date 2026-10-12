import type { SkillId } from "./progress";
import type { GraphSpec, Point } from "./practice";
export type LessonStep =
  | {
      id: string;
      type: "explanation" | "example";
      title: string;
      body: string;
      lines?: string[];
      graph?: GraphSpec;
      comparisonGraphs?: GraphSpec[];
      table?: Point[];
    }
  | {
      id: string;
      type: "visual";
      title: string;
      body: string;
      graph: GraphSpec;
      interactive?: boolean;
    }
  | {
      id: string;
      type: "guided-practice" | "independent-practice" | "checkpoint";
      title: string;
      body: string;
      problemIds: string[];
    };
export interface Lesson {
  id: string;
  title: string;
  description: string;
  skills: SkillId[];
  steps: LessonStep[];
  source: string;
  supplemental?: boolean;
  support: string[];
}
export interface Topic {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  lessons: Lesson[];
}
export interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  topics: Topic[];
}
