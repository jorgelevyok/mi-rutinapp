import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import type { WorkoutExercise } from '@/types';
import { ExerciseSetList } from './ExerciseSetList';
import { colors, fontFamilies, fontSizes, iconSizes, radius, spacing } from '@/theme';
import { formatRestLabel } from '@/utils/format';

interface RoutineExercisePanelProps {
  exercise: WorkoutExercise;
  onToggleComplete: (setId: string) => void;
  onChangeWeight: (setId: string, value: number | null) => void;
  onChangeReps: (setId: string, value: number) => void;
  onToggleExerciseComplete: () => void;
}

export function RoutineExercisePanel({
  exercise,
  onToggleComplete,
  onChangeWeight,
  onChangeReps,
  onToggleExerciseComplete,
}: RoutineExercisePanelProps) {
  const meta = [
    exercise.muscleGroup,
    `${exercise.sets.length} sets`,
    formatRestLabel(exercise.restSeconds),
  ]
    .filter(Boolean)
    .join('  ·  ');

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{exercise.name}</Text>
          <Text style={styles.meta}>{meta}</Text>
        </View>
        <Pressable
          onPress={onToggleExerciseComplete}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={
            exercise.completed ? 'Mark exercise incomplete' : 'Mark exercise complete'
          }
          style={({ pressed }) => [
            styles.completeButton,
            exercise.completed && styles.completeButtonDone,
            pressed && styles.pressed,
          ]}
        >
          <Check
            size={iconSizes.md}
            color={exercise.completed ? colors.white : colors.inkMuted}
            pointerEvents="none"
          />
          <Text
            style={[styles.completeLabel, exercise.completed && styles.completeLabelDone]}
          >
            {exercise.completed ? 'Done' : 'Complete'}
          </Text>
        </Pressable>
      </View>

      <ExerciseSetList
        sets={exercise.sets}
        onToggleComplete={onToggleComplete}
        onChangeWeight={onChangeWeight}
        onChangeReps={onChangeReps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  titleWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: fontFamilies.displayBold,
    fontSize: fontSizes['4xl'],
    color: colors.ink,
  },
  meta: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.md,
    color: colors.inkMuted,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.sandSoft,
    backgroundColor: colors.bg,
  },
  completeButtonDone: {
    backgroundColor: '#2F9E6B',
    borderColor: '#2F9E6B',
  },
  completeLabel: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.sm,
    color: colors.inkMuted,
  },
  completeLabelDone: {
    color: colors.white,
  },
  pressed: {
    opacity: 0.75,
  },
});
