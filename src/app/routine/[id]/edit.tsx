import { useLocalSearchParams } from 'expo-router';
import { EditRoutineScreen } from '@/features/routines/screens/EditRoutineScreen';

export default function EditRoutineRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <EditRoutineScreen routineId={id} />;
}
