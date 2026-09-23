import { seedRoutines } from '@/mocks/routines';
import type { WorkoutExercise, WorkoutRoutine, WorkoutSet } from '@/types';
import { createId, estimateRoutineMinutes } from '@/utils/format';
import { routineAccentColors } from '@/theme/colors';
import { routineStorage } from '@/services/storage/routineStorage';

function cloneSet(set: WorkoutSet): WorkoutSet {
  return { ...set };
}

function cloneExercise(exercise: WorkoutExercise): WorkoutExercise {
  return {
    ...exercise,
    completed: exercise.completed ?? false,
    sets: exercise.sets.map(cloneSet),
  };
}

const DEFAULT_REST_BETWEEN_EXERCISES = 120;

function normalizeRoutine(routine: WorkoutRoutine): WorkoutRoutine {
  return {
    ...routine,
    restBetweenExercisesSeconds:
      typeof routine.restBetweenExercisesSeconds === 'number'
        ? Math.max(0, routine.restBetweenExercisesSeconds)
        : DEFAULT_REST_BETWEEN_EXERCISES,
    exercises: routine.exercises.map(cloneExercise),
  };
}

function cloneRoutine(routine: WorkoutRoutine): WorkoutRoutine {
  return normalizeRoutine(routine);
}

function cloneAll(routines: WorkoutRoutine[]): WorkoutRoutine[] {
  return routines.map(cloneRoutine);
}

function computeEstimatedMinutes(
  exercises: WorkoutExercise[],
  restBetweenExercisesSeconds = DEFAULT_REST_BETWEEN_EXERCISES,
): number {
  const betweenSetsRest = exercises.reduce(
    (sum, exercise) => sum + exercise.restSeconds * Math.max(exercise.sets.length - 1, 0),
    0,
  );
  const betweenExercisesRest =
    Math.max(exercises.length - 1, 0) * Math.max(0, restBetweenExercisesSeconds);
  return estimateRoutineMinutes(exercises.length, betweenSetsRest + betweenExercisesRest);
}

let memoryCache: WorkoutRoutine[] | null = null;

async function ensureCache(): Promise<WorkoutRoutine[]> {
  if (memoryCache) return memoryCache;
  const stored = await routineStorage.load();
  memoryCache = stored && stored.length > 0 ? cloneAll(stored) : cloneAll(seedRoutines);
  if (!stored || stored.length === 0) {
    await routineStorage.save(memoryCache);
  }
  return memoryCache;
}

async function persist(routines: WorkoutRoutine[]): Promise<void> {
  memoryCache = cloneAll(routines);
  await routineStorage.save(memoryCache);
}

export const routineService = {
  async getAll(): Promise<WorkoutRoutine[]> {
    const cache = await ensureCache();
    return cloneAll(cache);
  },

  async getById(id: string): Promise<WorkoutRoutine | null> {
    const cache = await ensureCache();
    const routine = cache.find((item) => item.id === id);
    return routine ? cloneRoutine(routine) : null;
  },

  async create(input: {
    name: string;
    exercises: WorkoutExercise[];
    restBetweenExercisesSeconds?: number;
    accentColor?: string;
    estimatedMinutes?: number;
  }): Promise<WorkoutRoutine> {
    const cache = await ensureCache();
    const accentIndex = cache.length % routineAccentColors.length;
    const restBetweenExercisesSeconds =
      input.restBetweenExercisesSeconds ?? DEFAULT_REST_BETWEEN_EXERCISES;
    const routine: WorkoutRoutine = {
      id: createId('routine'),
      name: input.name,
      exercises: input.exercises.map(cloneExercise),
      restBetweenExercisesSeconds: Math.max(0, restBetweenExercisesSeconds),
      accentColor: input.accentColor ?? routineAccentColors[accentIndex],
      estimatedMinutes:
        input.estimatedMinutes ??
        computeEstimatedMinutes(input.exercises, restBetweenExercisesSeconds),
    };
    await persist([...cache, routine]);
    return cloneRoutine(routine);
  },

  async replace(routine: WorkoutRoutine): Promise<WorkoutRoutine> {
    const cache = await ensureCache();
    const index = cache.findIndex((item) => item.id === routine.id);
    if (index === -1) {
      throw new Error(`Routine not found: ${routine.id}`);
    }

    const next: WorkoutRoutine = {
      ...cloneRoutine(routine),
      estimatedMinutes: computeEstimatedMinutes(
        routine.exercises,
        routine.restBetweenExercisesSeconds,
      ),
    };

    const routines = [...cache.slice(0, index), next, ...cache.slice(index + 1)];
    await persist(routines);
    return cloneRoutine(next);
  },

  async update(
    id: string,
    input: Partial<Omit<WorkoutRoutine, 'id'>>,
  ): Promise<WorkoutRoutine | null> {
    const cache = await ensureCache();
    const index = cache.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const current = cache[index];
    const exercises = input.exercises ?? current.exercises;
    const restBetweenExercisesSeconds =
      input.restBetweenExercisesSeconds ?? current.restBetweenExercisesSeconds;
    const updated: WorkoutRoutine = {
      ...current,
      ...input,
      id: current.id,
      exercises: exercises.map(cloneExercise),
      restBetweenExercisesSeconds: Math.max(0, restBetweenExercisesSeconds),
      estimatedMinutes:
        input.estimatedMinutes ??
        computeEstimatedMinutes(exercises, restBetweenExercisesSeconds),
    };

    const routines = [...cache.slice(0, index), updated, ...cache.slice(index + 1)];
    await persist(routines);
    return cloneRoutine(updated);
  },

  async remove(id: string): Promise<boolean> {
    const cache = await ensureCache();
    const next = cache.filter((item) => item.id !== id);
    if (next.length === cache.length) return false;
    await persist(next);
    return true;
  },
};
