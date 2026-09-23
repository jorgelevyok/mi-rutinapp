import { Href, router } from 'expo-router';
import type { RoutineFormValues } from '@/types';
import { RoutineForm } from '@/features/routines/components/RoutineForm';
import { useRoutines } from '@/features/routines/hooks/useRoutines';

export function CreateRoutineScreen() {
  const { createRoutine } = useRoutines();

  async function handleSubmit(values: RoutineFormValues) {
    await createRoutine(values);
    router.replace('/home' as Href);
  }

  return (
    <RoutineForm
      mode="create"
      onBack={() => router.back()}
      onSubmit={handleSubmit}
    />
  );
}
