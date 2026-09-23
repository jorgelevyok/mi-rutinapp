export function createId(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function formatRestLabel(seconds: number): string {
  return `${seconds}s`;
}

export function summarizeReps(sets: { reps: number }[]): string {
  if (sets.length === 0) return '—';
  const reps = sets.map((set) => set.reps);
  const unique = [...new Set(reps)];
  if (unique.length === 1) return String(unique[0]);
  const min = Math.min(...reps);
  const max = Math.max(...reps);
  return min === max ? String(min) : `${min}-${max}`;
}

export function estimateRoutineMinutes(exerciseCount: number, restSecondsTotal: number): number {
  const workMinutes = exerciseCount * 4;
  const restMinutes = Math.round(restSecondsTotal / 60);
  return Math.max(20, workMinutes + restMinutes);
}
