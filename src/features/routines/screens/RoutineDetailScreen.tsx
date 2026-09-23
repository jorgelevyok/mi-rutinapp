import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, Pencil, Timer } from 'lucide-react-native';
import { Href, router } from 'expo-router';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { AppHeader } from '@/components/common/AppHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { RoutineExercisePanel } from '@/features/routines/components/RoutineExercisePanel';
import { ExerciseSwitcher } from '@/features/routines/components/ExerciseSwitcher';
import { RestChronometer } from '@/features/routines/components/RestChronometer';
import { useRoutineStore } from '@/store/routineStore';
import { useRestChronometer } from '@/features/routines/hooks/useRestChronometer';
import { formatRestLabel, countCompletionsThisWeek, formatWeeklyProgress, isWeeklyTargetMet } from '@/utils/format';
import { colors, fontFamilies, fontSizes, iconSizes, radius, spacing } from '@/theme';

interface RoutineDetailScreenProps {
  routineId: string;
}

export function RoutineDetailScreen({ routineId }: RoutineDetailScreenProps) {
  const routine = useRoutineStore((state) =>
    state.routines.find((item) => item.id === routineId),
  );
  const updateSetField = useRoutineStore((state) => state.updateSetField);
  const setExerciseCompleted = useRoutineStore((state) => state.setExerciseCompleted);
  const toggleRoutineSessionThisWeek = useRoutineStore(
    (state) => state.toggleRoutineSessionThisWeek,
  );

  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const {
    isRunning,
    formatted,
    targetRestSeconds,
    isOverTarget,
    startChronometer,
    stopChronometer,
  } = useRestChronometer();

  useEffect(() => {
    if (!routine) return;
    const stillExists = routine.exercises.some((exercise) => exercise.id === selectedExerciseId);
    if (!stillExists) {
      setSelectedExerciseId(routine.exercises[0]?.id ?? null);
    }
  }, [routine, selectedExerciseId]);

  function goToEdit() {
    router.push(`/routine/${routineId}/edit` as Href);
  }

  if (!routine) {
    return (
      <ScreenContainer>
        <AppHeader title="Routine" onBack={() => router.back()} />
        <EmptyState title="Routine not found" description="This routine may have been deleted." />
      </ScreenContainer>
    );
  }

  const selectedIndex = Math.max(
    0,
    routine.exercises.findIndex((exercise) => exercise.id === selectedExerciseId),
  );
  const selectedExercise = routine.exercises[selectedIndex] ?? routine.exercises[0];

  if (!selectedExercise) {
    return (
      <ScreenContainer>
        <AppHeader title={routine.name} onBack={() => router.back()} />
        <EmptyState
          title="No exercises"
          description="Edit this routine to add exercises."
        />
        <SecondaryButton label="Edit Routine" icon={Pencil} onPress={goToEdit} />
      </ScreenContainer>
    );
  }

  const currentRoutine = routine;
  const currentExercise = selectedExercise;
  const restBetweenExercises = currentRoutine.restBetweenExercisesSeconds;
  const timesPerWeek = Math.max(1, currentRoutine.timesPerWeek);
  const doneCount = countCompletionsThisWeek(currentRoutine.completedAtDates);
  const targetMet = isWeeklyTargetMet(timesPerWeek, currentRoutine.completedAtDates);

  function handleToggleSetComplete(setId: string) {
    const setItem = currentExercise.sets.find((item) => item.id === setId);
    if (!setItem) return;

    const nextCompleted = !setItem.completed;
    void updateSetField(currentRoutine.id, currentExercise.id, setId, {
      completed: nextCompleted,
    });

    if (nextCompleted) {
      const setIndex = currentExercise.sets.findIndex((item) => item.id === setId);
      const isLastSet = setIndex === currentExercise.sets.length - 1;
      if (!isLastSet) {
        startChronometer(currentExercise.restSeconds);
      } else {
        const isLastExercise = selectedIndex >= currentRoutine.exercises.length - 1;
        if (!isLastExercise && restBetweenExercises > 0) {
          startChronometer(restBetweenExercises);
        }
      }
    }
  }

  function handleToggleExerciseComplete() {
    void setExerciseCompleted(
      currentRoutine.id,
      currentExercise.id,
      !currentExercise.completed,
    );
  }

  return (
    <ScreenContainer>
      <AppHeader title={currentRoutine.name} onBack={() => router.back()} />

      <Pressable
        onPress={() => void toggleRoutineSessionThisWeek(currentRoutine.id)}
        style={[styles.weekBanner, targetMet && styles.weekBannerDone]}
        accessibilityRole="button"
        accessibilityLabel={
          targetMet
            ? 'Undo last session this week'
            : `Mark session done this week, ${doneCount} of ${timesPerWeek}`
        }
      >
        <View style={[styles.weekIcon, targetMet && styles.weekIconDone]}>
          <Check
            size={iconSizes.md}
            color={targetMet ? colors.white : colors.inkMuted}
            strokeWidth={targetMet ? 3 : 2}
            pointerEvents="none"
          />
        </View>
        <View style={styles.weekTextWrap}>
          <Text style={styles.weekHint}>THIS WEEK</Text>
          <Text style={styles.weekLabel}>
            {targetMet
              ? `${formatWeeklyProgress(doneCount, timesPerWeek)} done — tap to undo last`
              : `${formatWeeklyProgress(doneCount, timesPerWeek)} done — tap to add session`}
          </Text>
        </View>
      </Pressable>

      <SecondaryButton label="Edit Routine" icon={Pencil} onPress={goToEdit} />

      <Pressable
        onPress={() => startChronometer(restBetweenExercises)}
        style={styles.restButton}
        accessibilityRole="button"
        accessibilityLabel={`Start ${restBetweenExercises} second rest chronometer between exercises`}
      >
        <View style={styles.restIcon}>
          <Timer size={iconSizes.lg} color={colors.ink} pointerEvents="none" />
        </View>
        <View style={styles.restTextWrap}>
          <Text style={styles.restHint}>REST BETWEEN EXERCISES</Text>
          <Text style={styles.restLabel}>{formatRestLabel(restBetweenExercises)} chronometer</Text>
        </View>
      </Pressable>

      <RestChronometer
        visible={isRunning}
        formattedTime={formatted}
        targetRestSeconds={targetRestSeconds}
        isOverTarget={isOverTarget}
        onStop={stopChronometer}
      />

      <ExerciseSwitcher
        exercises={currentRoutine.exercises}
        selectedId={currentExercise.id}
        onSelect={setSelectedExerciseId}
      />

      <View style={styles.panel}>
        <RoutineExercisePanel
          exercise={currentExercise}
          onToggleComplete={handleToggleSetComplete}
          onChangeWeight={(setId, value) => {
            void updateSetField(currentRoutine.id, currentExercise.id, setId, {
              weightKg: value,
            });
          }}
          onChangeReps={(setId, value) => {
            void updateSetField(currentRoutine.id, currentExercise.id, setId, {
              reps: value,
            });
          }}
          onToggleExerciseComplete={handleToggleExerciseComplete}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: spacing.md,
  },
  weekBanner: {
    minHeight: 56,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.sandSoft,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  weekBannerDone: {
    borderColor: colors.ink,
    backgroundColor: colors.bgCream,
  },
  weekIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.beigeSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekIconDone: {
    backgroundColor: colors.ink,
  },
  weekTextWrap: {
    flex: 1,
  },
  weekHint: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.xs,
    letterSpacing: 1,
    color: colors.inkMuted,
    marginBottom: 2,
  },
  weekLabel: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.base,
    color: colors.ink,
  },
  restButton: {
    minHeight: 56,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.sandSoft,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  restIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.coralSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restTextWrap: {
    flex: 1,
  },
  restHint: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.xs,
    letterSpacing: 1,
    color: colors.inkMuted,
    marginBottom: 2,
  },
  restLabel: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.base,
    color: colors.ink,
  },
});
