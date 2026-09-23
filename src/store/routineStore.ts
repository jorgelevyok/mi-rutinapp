import { create } from 'zustand';
import type {
  RoutineFormValues,
  WorkoutExercise,
  WorkoutRoutine,
  WorkoutSet,
} from '@/types';
import { routineService } from '@/services/routines/routineService';
import {
  countCompletionsThisWeek,
  getCompletionsThisWeek,
  isWeeklyTargetMet,
} from '@/utils/format';

interface RoutineStore {
  routines: WorkoutRoutine[];
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  createRoutine: (values: RoutineFormValues) => Promise<WorkoutRoutine>;
  updateRoutine: (id: string, values: RoutineFormValues) => Promise<WorkoutRoutine | null>;
  deleteRoutine: (id: string) => Promise<void>;
  getRoutineById: (id: string) => WorkoutRoutine | undefined;
  updateSetField: (
    routineId: string,
    exerciseId: string,
    setId: string,
    patch: Partial<Pick<WorkoutSet, 'reps' | 'weightKg' | 'completed'>>,
  ) => Promise<void>;
  setExerciseCompleted: (
    routineId: string,
    exerciseId: string,
    completed: boolean,
  ) => Promise<void>;
  /** Adds one weekly session if under target; otherwise undoes the last session this week. */
  toggleRoutineSessionThisWeek: (routineId: string) => Promise<void>;
  replaceExercises: (routineId: string, exercises: WorkoutExercise[]) => Promise<void>;
}

function mapRoutine(
  routines: WorkoutRoutine[],
  routineId: string,
  updater: (routine: WorkoutRoutine) => WorkoutRoutine,
): WorkoutRoutine[] {
  return routines.map((routine) => (routine.id === routineId ? updater(routine) : routine));
}

function isExerciseFullyDone(exercise: WorkoutExercise): boolean {
  if (exercise.completed) return true;
  return exercise.sets.length > 0 && exercise.sets.every((setItem) => setItem.completed);
}

function resetExercisesForNextSession(exercises: WorkoutExercise[]): WorkoutExercise[] {
  return exercises.map((exercise) => ({
    ...exercise,
    completed: false,
    sets: exercise.sets.map((setItem) => ({ ...setItem, completed: false })),
  }));
}

function addSessionCompletion(routine: WorkoutRoutine): WorkoutRoutine {
  if (isWeeklyTargetMet(routine.timesPerWeek, routine.completedAtDates)) {
    return routine;
  }
  return {
    ...routine,
    completedAtDates: [...routine.completedAtDates, new Date().toISOString()],
  };
}

function removeLastSessionThisWeek(routine: WorkoutRoutine): WorkoutRoutine {
  const thisWeek = getCompletionsThisWeek(routine.completedAtDates);
  if (thisWeek.length === 0) return routine;
  const lastIso = thisWeek[thisWeek.length - 1];
  let removed = false;
  const completedAtDates = [...routine.completedAtDates].reverse().filter((iso) => {
    if (!removed && iso === lastIso) {
      removed = true;
      return false;
    }
    return true;
  });
  completedAtDates.reverse();
  return { ...routine, completedAtDates };
}

/**
 * When every exercise is complete, count +1 session for the week (if under target)
 * and reset exercise/set checkmarks so the next session can start clean.
 */
function withSessionProgressIfFullyDone(routine: WorkoutRoutine): WorkoutRoutine {
  const exercises = routine.exercises.map((exercise) => {
    if (exercise.completed || !isExerciseFullyDone(exercise)) return exercise;
    return { ...exercise, completed: true };
  });

  const allDone = exercises.length > 0 && exercises.every(isExerciseFullyDone);
  if (!allDone) {
    return { ...routine, exercises };
  }

  const stamped = addSessionCompletion({ ...routine, exercises });
  return {
    ...stamped,
    exercises: resetExercisesForNextSession(stamped.exercises),
  };
}

async function persistRoutine(
  set: (partial: Partial<RoutineStore>) => void,
  get: () => RoutineStore,
  routineId: string,
  nextRoutine: WorkoutRoutine,
) {
  set({
    routines: mapRoutine(get().routines, routineId, () => nextRoutine),
  });
  try {
    await routineService.replace(nextRoutine);
  } catch {
    // Keep optimistic UI state even if persistence fails.
  }
}

export const useRoutineStore = create<RoutineStore>((set, get) => ({
  routines: [],
  isLoading: false,
  isHydrated: false,
  error: null,

  hydrate: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const routines = await routineService.getAll();
      set({ routines, isLoading: false, isHydrated: true });
    } catch {
      set({ error: 'Failed to load routines', isLoading: false, isHydrated: true });
    }
  },

  createRoutine: async (values) => {
    const routine = await routineService.create({
      name: values.name.trim(),
      exercises: values.exercises,
      restBetweenExercisesSeconds: values.restBetweenExercisesSeconds,
      timesPerWeek: values.timesPerWeek,
    });
    set({ routines: [...get().routines, routine] });
    return routine;
  },

  updateRoutine: async (id, values) => {
    const routine = await routineService.update(id, {
      name: values.name.trim(),
      exercises: values.exercises,
      restBetweenExercisesSeconds: values.restBetweenExercisesSeconds,
      timesPerWeek: values.timesPerWeek,
    });
    if (!routine) return null;
    set({
      routines: get().routines.map((item) => (item.id === id ? routine : item)),
    });
    return routine;
  },

  deleteRoutine: async (id) => {
    await routineService.remove(id);
    set({ routines: get().routines.filter((item) => item.id !== id) });
  },

  getRoutineById: (id) => get().routines.find((item) => item.id === id),

  updateSetField: async (routineId, exerciseId, setId, patch) => {
    const current = get().getRoutineById(routineId);
    if (!current) return;

    const nextRoutine = withSessionProgressIfFullyDone({
      ...current,
      exercises: current.exercises.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;

        const sets = exercise.sets.map((workoutSet) =>
          workoutSet.id === setId ? { ...workoutSet, ...patch } : workoutSet,
        );
        const allSetsComplete = sets.length > 0 && sets.every((setItem) => setItem.completed);

        let completed = exercise.completed;
        if (allSetsComplete) {
          completed = true;
        } else if (patch.completed === false) {
          completed = false;
        }

        return {
          ...exercise,
          sets,
          completed,
        };
      }),
    });

    await persistRoutine(set, get, routineId, nextRoutine);
  },

  setExerciseCompleted: async (routineId, exerciseId, completed) => {
    const current = get().getRoutineById(routineId);
    if (!current) return;

    const nextRoutine = withSessionProgressIfFullyDone({
      ...current,
      exercises: current.exercises.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;
        return {
          ...exercise,
          completed,
          sets: exercise.sets.map((setItem) => ({
            ...setItem,
            completed,
          })),
        };
      }),
    });

    await persistRoutine(set, get, routineId, nextRoutine);
  },

  toggleRoutineSessionThisWeek: async (routineId) => {
    const current = get().getRoutineById(routineId);
    if (!current) return;

    const done = countCompletionsThisWeek(current.completedAtDates);
    const target = Math.max(1, current.timesPerWeek);
    const nextRoutine =
      done < target ? addSessionCompletion(current) : removeLastSessionThisWeek(current);

    await persistRoutine(set, get, routineId, nextRoutine);
  },

  replaceExercises: async (routineId, exercises) => {
    const current = get().getRoutineById(routineId);
    if (!current) return;
    const nextRoutine: WorkoutRoutine = { ...current, exercises };
    set({
      routines: mapRoutine(get().routines, routineId, () => nextRoutine),
    });
    await routineService.replace(nextRoutine);
  },
}));
