export interface WorkoutSet {
  id: string;
  reps: number;
  weightKg: number | null;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  muscleGroup?: string;
  sets: WorkoutSet[];
  restSeconds: number;
  completed: boolean;
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  /** Rest pause after finishing an exercise, before starting the next one. */
  restBetweenExercisesSeconds: number;
  /** How many times this routine should be done each week. */
  timesPerWeek: number;
  /** ISO timestamps for each completed session (kept across weeks; filtered by week in UI). */
  completedAtDates: string[];
  accentColor: string;
  estimatedMinutes: number;
}

export type RoutineFormMode = 'create' | 'edit';

export interface ExerciseSetDraft {
  reps: number;
  weightKg: number | null;
}

export interface ExerciseFormValues {
  name: string;
  sets: ExerciseSetDraft[];
  restSeconds: number;
}

export interface RoutineFormValues {
  name: string;
  exercises: WorkoutExercise[];
  restBetweenExercisesSeconds: number;
  timesPerWeek: number;
}
