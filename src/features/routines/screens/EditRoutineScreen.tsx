import { Href, router } from 'expo-router';
import type { RoutineFormValues } from '@/types';
import { RoutineForm } from '@/features/routines/components/RoutineForm';
import { useRoutines } from '@/features/routines/hooks/useRoutines';
import { EmptyState } from '@/components/common/EmptyState';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { AppHeader } from '@/components/common/AppHeader';

interface EditRoutineScreenProps {
  routineId: string;
}

export function EditRoutineScreen({ routineId }: EditRoutineScreenProps) {
  const { getRoutineById, updateRoutine, deleteRoutine } = useRoutines();
  const routine = getRoutineById(routineId);

  async function handleSubmit(values: RoutineFormValues) {
    await updateRoutine(routineId, values);
    router.replace(`/routine/${routineId}` as Href);
  }

  async function handleDelete() {
    await deleteRoutine(routineId);
    router.replace('/home' as Href);
  }

  if (!routine) {
    return (
      <ScreenContainer>
        <AppHeader title="Edit Routine" onBack={() => router.back()} />
        <EmptyState title="Routine not found" description="This routine may have been deleted." />
      </ScreenContainer>
    );
  }

  return (
    <RoutineForm
      mode="edit"
      initialValues={{
        name: routine.name,
        exercises: routine.exercises,
        restBetweenExercisesSeconds: routine.restBetweenExercisesSeconds,
        timesPerWeek: routine.timesPerWeek,
      }}
      onBack={() => router.back()}
      onSubmit={handleSubmit}
      onDeleteRoutine={handleDelete}
    />
  );
}
