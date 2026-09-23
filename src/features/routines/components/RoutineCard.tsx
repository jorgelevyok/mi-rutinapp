import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import type { WorkoutRoutine } from '@/types';
import { colors, fontFamilies, fontSizes, iconSizes, radius, shadows, spacing } from '@/theme';

interface RoutineCardProps {
  routine: WorkoutRoutine;
  onPress: () => void;
  onLongPress?: () => void;
}

export function RoutineCard({ routine, onPress, onLongPress }: RoutineCardProps) {
  const meta = `${routine.exercises.length} exercises  ·  ~${routine.estimatedMinutes} min`;

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
        <Text style={styles.name}>{routine.name}</Text>
        <Text style={styles.meta}>{meta}</Text>
      </View>
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
    gap: 14,
  },
  pressed: {
    opacity: 0.92,
  },
  texts: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontFamily: fontFamilies.displayBold,
    fontSize: fontSizes['2xl'],
    color: colors.ink,
  },
  meta: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.md,
    color: colors.inkMuted,
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
