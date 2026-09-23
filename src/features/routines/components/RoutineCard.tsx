import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, ChevronRight } from 'lucide-react-native';
import type { WorkoutRoutine } from '@/types';
import {
  countCompletionsThisWeek,
  formatWeeklyProgress,
  isWeeklyTargetMet,
} from '@/utils/format';
import { colors, fontFamilies, fontSizes, iconSizes, radius, shadows } from '@/theme';

interface RoutineCardProps {
  routine: WorkoutRoutine;
  onPress: () => void;
  onToggleSessionThisWeek?: () => void;
  onLongPress?: () => void;
}

export function RoutineCard({
  routine,
  onPress,
  onToggleSessionThisWeek,
  onLongPress,
}: RoutineCardProps) {
  const timesPerWeek = Math.max(1, routine.timesPerWeek);
  const doneCount = countCompletionsThisWeek(routine.completedAtDates);
  const targetMet = isWeeklyTargetMet(timesPerWeek, routine.completedAtDates);
  const hasProgress = doneCount > 0;
  const meta = `${routine.exercises.length} exercises  ·  ~${routine.estimatedMinutes} min  ·  ${timesPerWeek}x/week`;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: routine.accentColor },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.texts}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{routine.name}</Text>
          {hasProgress ? (
            <View style={[styles.badge, targetMet && styles.badgeDone]}>
              {targetMet ? <Check size={12} color={colors.white} strokeWidth={3} /> : null}
              <Text style={styles.badgeText}>
                {formatWeeklyProgress(doneCount, timesPerWeek)} this week
              </Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.meta}>{meta}</Text>
      </View>

      {onToggleSessionThisWeek ? (
        <Pressable
          onPress={onToggleSessionThisWeek}
          hitSlop={8}
          style={[styles.checkButton, targetMet && styles.checkButtonDone]}
          accessibilityRole="button"
          accessibilityLabel={
            targetMet
              ? 'Undo last session this week'
              : `Mark session done this week, ${doneCount} of ${timesPerWeek}`
          }
        >
          <Check
            size={iconSizes.md}
            color={targetMet ? colors.white : colors.inkMuted}
            strokeWidth={targetMet ? 3 : 2}
          />
        </Pressable>
      ) : null}

      <View style={styles.arrow}>
        <ChevronRight size={iconSizes.lg} color={colors.ink} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 84,
    borderRadius: radius.lg,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  pressed: {
    opacity: 0.92,
  },
  texts: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  name: {
    fontFamily: fontFamilies.displayBold,
    fontSize: fontSizes['2xl'],
    color: colors.ink,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.ink,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
    opacity: 0.85,
  },
  badgeDone: {
    opacity: 1,
  },
  badgeText: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.xs,
    letterSpacing: 0.4,
    color: colors.white,
  },
  meta: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.md,
    color: colors.inkMuted,
  },
  checkButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.sandSoft,
  },
  checkButtonDone: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  arrow: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
});
