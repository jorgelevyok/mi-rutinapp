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

/** Start of the current week (Monday 00:00 local time). */
export function getWeekStart(date = new Date()): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  const day = result.getDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;
  result.setDate(result.getDate() - daysSinceMonday);
  return result;
}

export function getCompletionsThisWeek(completedAtDates: string[] | undefined): string[] {
  if (!completedAtDates?.length) return [];
  const weekStart = getWeekStart().getTime();
  return completedAtDates.filter((iso) => {
    const time = new Date(iso).getTime();
    return !Number.isNaN(time) && time >= weekStart;
  });
}

export function countCompletionsThisWeek(completedAtDates: string[] | undefined): number {
  return getCompletionsThisWeek(completedAtDates).length;
}

export function isWeeklyTargetMet(
  timesPerWeek: number,
  completedAtDates: string[] | undefined,
): boolean {
  const target = Math.max(1, timesPerWeek);
  return countCompletionsThisWeek(completedAtDates) >= target;
}

/** @deprecated Prefer countCompletionsThisWeek / isWeeklyTargetMet */
export function isCompletedThisWeek(lastCompletedAt: string | null | undefined): boolean {
  if (!lastCompletedAt) return false;
  const completed = new Date(lastCompletedAt);
  if (Number.isNaN(completed.getTime())) return false;
  return completed >= getWeekStart();
}

export function formatWeeklyProgress(done: number, target: number): string {
  return `${done}/${Math.max(1, target)}`;
}
