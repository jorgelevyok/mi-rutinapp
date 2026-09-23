import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import type { WorkoutExercise } from '@/types';
import { colors, fontFamilies, fontSizes, iconSizes, radius, spacing } from '@/theme';

interface ExerciseSwitcherProps {
  exercises: WorkoutExercise[];
  selectedId: string;
  onSelect: (exerciseId: string) => void;
}

export function ExerciseSwitcher({ exercises, selectedId, onSelect }: ExerciseSwitcherProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>EXERCISES</Text>
      <View style={styles.list}>
        {exercises.map((exercise) => {
          const isSelected = exercise.id === selectedId;
          return (
            <Pressable
              key={exercise.id}
              onPress={() => onSelect(exercise.id)}
              style={[
                styles.chip,
                exercise.completed && styles.chipCompleted,
                isSelected && styles.chipSelected,
              ]}
            >
              {exercise.completed ? (
                <Check size={iconSizes.sm} color={isSelected ? colors.ink : colors.white} />
              ) : null}
              <Text
                style={[
                  styles.chipText,
                  exercise.completed && !isSelected && styles.chipTextCompleted,
                  isSelected && styles.chipTextSelected,
                ]}
              >
                {exercise.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  label: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.sm,
    letterSpacing: 1,
    color: colors.inkMuted,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.sandSoft,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipSelected: {
    backgroundColor: colors.coralSoft,
    borderColor: colors.ink,
    borderWidth: 2,
  },
  chipCompleted: {
    backgroundColor: '#2F9E6B',
    borderColor: '#2F9E6B',
  },
  chipText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.md,
    color: colors.ink,
  },
  chipTextSelected: {
    fontFamily: fontFamilies.bodySemiBold,
  },
  chipTextCompleted: {
    color: colors.white,
    fontFamily: fontFamilies.bodySemiBold,
  },
});
