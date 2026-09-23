import { StyleSheet, Text, View } from 'react-native';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react-native';
import type { WorkoutExercise } from '@/types';
import { formatRestLabel, summarizeReps } from '@/utils/format';
import { colors, fontFamilies, fontSizes, iconSizes, radius, spacing } from '@/theme';
import { IconButton } from '@/components/ui/IconButton';

interface ExerciseEditorCardProps {
  exercise: WorkoutExercise;
  accentColor: string;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export function ExerciseEditorCard({
  exercise,
  accentColor,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
}: ExerciseEditorCardProps) {
  const repsSummary = summarizeReps(exercise.sets);

  return (
    <View style={[styles.card, { backgroundColor: accentColor }]}>
      <View style={styles.topRow}>
        <View style={styles.info}>
          <Text style={styles.name}>{exercise.name}</Text>
          {exercise.muscleGroup ? (
            <Text style={styles.muscle}>{exercise.muscleGroup}</Text>
          ) : null}
        </View>
        <View style={styles.actions}>
          {onMoveUp ? (
            <IconButton
              icon={ChevronUp}
              onPress={onMoveUp}
              size={32}
              iconColor={canMoveUp ? colors.ink : colors.inkMuted}
              backgroundColor={colors.white}
            />
          ) : null}
          {onMoveDown ? (
            <IconButton
              icon={ChevronDown}
              onPress={onMoveDown}
              size={32}
              iconColor={canMoveDown ? colors.ink : colors.inkMuted}
              backgroundColor={colors.white}
            />
          ) : null}
          {onDelete ? (
            <IconButton
              icon={Trash2}
              onPress={onDelete}
              size={32}
              iconColor={colors.coral}
              backgroundColor={colors.white}
            />
          ) : null}
        </View>
      </View>

      <View style={styles.metrics}>
        <MetricField label="SETS" value={String(exercise.sets.length)} />
        <MetricField label="REPS" value={repsSummary} />
        <MetricField label="REST" value={formatRestLabel(exercise.restSeconds)} />
      </View>
    </View>
  );
}

function MetricField({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontFamily: fontFamilies.displayBold,
    fontSize: fontSizes.xl,
    color: colors.ink,
  },
  muscle: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.md,
    color: colors.inkMuted,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metric: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 6,
  },
  metricLabel: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.sm,
    letterSpacing: 0.8,
    color: colors.inkMuted,
  },
  metricValue: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.lg,
    color: colors.ink,
  },
});
