import { useRoutineStore } from '@/store/routineStore';

export function useRoutines() {
  const routines = useRoutineStore((state) => state.routines);
  const isLoading = useRoutineStore((state) => state.isLoading);
  const isHydrated = useRoutineStore((state) => state.isHydrated);
  const error = useRoutineStore((state) => state.error);
  const hydrate = useRoutineStore((state) => state.hydrate);
  const createRoutine = useRoutineStore((state) => state.createRoutine);
  const updateRoutine = useRoutineStore((state) => state.updateRoutine);
  const deleteRoutine = useRoutineStore((state) => state.deleteRoutine);
  const getRoutineById = useRoutineStore((state) => state.getRoutineById);
  const updateSetField = useRoutineStore((state) => state.updateSetField);
  const replaceExercises = useRoutineStore((state) => state.replaceExercises);
  const setExerciseCompleted = useRoutineStore((state) => state.setExerciseCompleted);
  const toggleRoutineSessionThisWeek = useRoutineStore(
    (state) => state.toggleRoutineSessionThisWeek,
  );

  return {
    routines,
    isLoading,
    isHydrated,
    error,
    hydrate,
    createRoutine,
    updateRoutine,
    deleteRoutine,
    getRoutineById,
    updateSetField,
    replaceExercises,
    setExerciseCompleted,
    toggleRoutineSessionThisWeek,
  };
}
