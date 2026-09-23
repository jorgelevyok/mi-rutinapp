import { create } from 'zustand';
import type {
  RoutineFormValues,
  WorkoutExercise,
  WorkoutRoutine,
  WorkoutSet,
} from '@/types';
import { routineService } from '@/services/routines/routineService';

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
  replaceExercises: (routineId: string, exercises: WorkoutExercise[]) => Promise<void>;
}

function mapRoutine(
  routines: WorkoutRoutine[],
  routineId: string,
  updater: (routine: WorkoutRoutine) => WorkoutRoutine,
): WorkoutRoutine[] {
  return routines.map((routine) => (routine.id === routineId ? updater(routine) : routine));
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
    });
    set({ routines: [...get().routines, routine] });
    return routine;
  },

  updateRoutine: async (id, values) => {
    const routine = await routineService.update(id, {
      name: values.name.trim(),
      exercises: values.exercises,
      restBetweenExercisesSeconds: values.restBetweenExercisesSeconds,
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

    const nextRoutine: WorkoutRoutine = {
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
    };

    set({
      routines: mapRoutine(get().routines, routineId, () => nextRoutine),
    });

    try {
      await routineService.replace(nextRoutine);
    } catch {
      // Keep optimistic UI state even if persistence fails.
    }
  },

  setExerciseCompleted: async (routineId, exerciseId, completed) => {
    const current = get().getRoutineById(routineId);
    if (!current) return;

    const nextRoutine: WorkoutRoutine = {
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
    };

    set({
      routines: mapRoutine(get().routines, routineId, () => nextRoutine),
    });

    try {
      await routineService.replace(nextRoutine);
    } catch {
      // Keep optimistic UI state even if persistence fails.
    }
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
