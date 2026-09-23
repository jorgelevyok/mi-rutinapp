import { StyleSheet, Text, View } from 'react-native';
import type { WorkoutSet } from '@/types';
import { SetRow } from './SetRow';
import { colors, fontFamilies, fontSizes, spacing } from '@/theme';

interface ExerciseSetListProps {
  sets: WorkoutSet[];
  onToggleComplete: (setId: string) => void;
  onChangeWeight: (setId: string, value: number | null) => void;
  onChangeReps: (setId: string, value: number) => void;
}

export function ExerciseSetList({
  sets,
  onToggleComplete,
  onChangeWeight,
  onChangeReps,
}: ExerciseSetListProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.headers}>
        <Text style={[styles.header, styles.setCol]}>SET</Text>
        <Text style={[styles.header, styles.kgCol]}>KG</Text>
        <Text style={[styles.header, styles.repsCol]}>REPS</Text>
        <View style={styles.checkSpacer} />
      </View>
      {sets.map((set, index) => (
        <SetRow
          key={set.id}
          index={index}
          set={set}
          onToggleComplete={() => onToggleComplete(set.id)}
          onChangeWeight={(value) => onChangeWeight(set.id, value)}
          onChangeReps={(value) => onChangeReps(set.id, value)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  headers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  header: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.xs,
    letterSpacing: 0.6,
    color: colors.inkMuted,
  },
  setCol: { width: 28, textAlign: 'center' },
  kgCol: { flex: 1, textAlign: 'center' },
  repsCol: { width: 64, textAlign: 'center' },
  checkSpacer: { width: 36 },
});
