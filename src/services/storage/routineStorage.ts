import AsyncStorage from '@react-native-async-storage/async-storage';
import type { WorkoutRoutine } from '@/types';

const ROUTINES_STORAGE_KEY = '@mi_rutinapp/routines_v2';

export const routineStorage = {
  async load(): Promise<WorkoutRoutine[] | null> {
    const raw = await AsyncStorage.getItem(ROUTINES_STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as WorkoutRoutine[];
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  },

  async save(routines: WorkoutRoutine[]): Promise<void> {
    await AsyncStorage.setItem(ROUTINES_STORAGE_KEY, JSON.stringify(routines));
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(ROUTINES_STORAGE_KEY);
  },
};
