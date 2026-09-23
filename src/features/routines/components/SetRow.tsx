import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Check } from 'lucide-react-native';
import type { WorkoutSet } from '@/types';
import { colors, fontFamilies, fontSizes, iconSizes, radius, spacing } from '@/theme';

interface SetRowProps {
  index: number;
  set: WorkoutSet;
  onToggleComplete: () => void;
  onChangeWeight: (value: number | null) => void;
  onChangeReps: (value: number) => void;
}

export function SetRow({
  index,
  set,
  onToggleComplete,
  onChangeWeight,
  onChangeReps,
}: SetRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.setNumber}>{index + 1}</Text>
      <TextInput
        value={set.weightKg === null ? '' : String(set.weightKg)}
        onChangeText={(text) => {
          const cleaned = text.replace(',', '.').replace(/[^0-9.]/g, '');
          if (!cleaned) {
            onChangeWeight(null);
            return;
          }
          const parsed = Number.parseFloat(cleaned);
          onChangeWeight(Number.isNaN(parsed) ? null : parsed);
        }}
        keyboardType="decimal-pad"
        style={styles.weightBox}
        placeholder="—"
        placeholderTextColor={colors.inkMuted}
      />
      <TextInput
        value={String(set.reps)}
        onChangeText={(text) => {
          const parsed = Number.parseInt(text.replace(/[^0-9]/g, ''), 10);
          onChangeReps(Number.isNaN(parsed) ? 0 : parsed);
        }}
        keyboardType="number-pad"
        style={styles.repsBox}
      />
      <Pressable
        onPress={onToggleComplete}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel={`Mark set ${index + 1} ${set.completed ? 'incomplete' : 'complete'}`}
        style={({ pressed }) => [
          styles.check,
          set.completed && styles.checkDone,
          pressed && styles.pressed,
        ]}
      >
        <Check
          size={iconSizes.sm}
          color={set.completed ? colors.white : colors.inkMuted}
          pointerEvents="none"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  setNumber: {
    width: 28,
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.base,
    color: colors.ink,
    textAlign: 'center',
  },
  weightBox: {
    flex: 1,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.sandSoft,
    textAlign: 'center',
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.base,
    color: colors.ink,
    padding: 0,
  },
  repsBox: {
    width: 64,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.sandSoft,
    textAlign: 'center',
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.base,
    color: colors.ink,
    padding: 0,
  },
  check: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.sandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: {
    backgroundColor: colors.coral,
    borderColor: colors.coral,
  },
  pressed: {
    opacity: 0.7,
  },
});
