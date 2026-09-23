import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Plus, Timer } from 'lucide-react-native';
import type {
  ExerciseFormValues,
  RoutineFormMode,
  RoutineFormValues,
  WorkoutExercise,
} from '@/types';
import { createId } from '@/utils/format';
import { routineAccentColors } from '@/theme/colors';
import { colors, fontFamilies, fontSizes, iconSizes, radius, spacing } from '@/theme';
import { AppHeader } from '@/components/common/AppHeader';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { AppTextInput } from '@/components/ui/AppTextInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AddExerciseModal } from './AddExerciseModal';
import { ExerciseEditorCard } from './ExerciseEditorCard';

const DEFAULT_REST_BETWEEN_EXERCISES = 120;

interface RoutineFormProps {
  mode: RoutineFormMode;
  initialValues?: RoutineFormValues;
  onBack: () => void;
  onSubmit: (values: RoutineFormValues) => void;
}

export function RoutineForm({ mode, initialValues, onBack, onSubmit }: RoutineFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [restBetweenExercisesSeconds, setRestBetweenExercisesSeconds] = useState(
    initialValues?.restBetweenExercisesSeconds ?? DEFAULT_REST_BETWEEN_EXERCISES,
  );
  const [exercises, setExercises] = useState<WorkoutExercise[]>(initialValues?.exercises ?? []);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);

  const editingExercise = exercises.find((exercise) => exercise.id === editingExerciseId);

  function openCreateModal() {
    setEditingExerciseId(null);
    setIsModalVisible(true);
  }

  function openEditModal(exerciseId: string) {
    setEditingExerciseId(exerciseId);
    setIsModalVisible(true);
  }

  function handleSaveExercise(values: ExerciseFormValues) {
    if (editingExerciseId) {
      setExercises((current) =>
        current.map((exercise) => {
          if (exercise.id !== editingExerciseId) return exercise;
          const previousSets = exercise.sets;
          return {
            ...exercise,
            name: values.name,
            restSeconds: values.restSeconds,
            sets: values.sets.map((draft, index) => ({
              id: previousSets[index]?.id ?? createId('set'),
              reps: draft.reps,
              weightKg: draft.weightKg,
              completed: previousSets[index]?.completed ?? false,
            })),
          };
        }),
      );
      return;
    }

    const exercise: WorkoutExercise = {
      id: createId('exercise'),
      name: values.name,
      restSeconds: values.restSeconds,
      completed: false,
      sets: values.sets.map((draft) => ({
        id: createId('set'),
        reps: draft.reps,
        weightKg: draft.weightKg,
        completed: false,
      })),
    };
    setExercises((current) => [...current, exercise]);
  }

  function handleDeleteExercise(id: string) {
    setExercises((current) => current.filter((exercise) => exercise.id !== id));
  }

  function moveExercise(index: number, direction: -1 | 1) {
    setExercises((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  }

  function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed || exercises.length === 0) return;
    onSubmit({
      name: trimmed,
      exercises,
      restBetweenExercisesSeconds: Math.max(0, restBetweenExercisesSeconds),
    });
  }

  return (
    <>
      <ScreenContainer>
        <AppHeader title={mode === 'create' ? 'Create Routine' : 'Edit Routine'} onBack={onBack} />

        <AppTextInput
          label="ROUTINE NAME"
          value={name}
          onChangeText={setName}
          placeholder="Push Day"
        />

        <View style={styles.restField}>
          <Text style={styles.restLabel}>REST BETWEEN EXERCISES</Text>
          <View style={styles.restInput}>
            <View style={styles.restLeft}>
              <View style={styles.restIcon}>
                <Timer size={iconSizes.md} color={colors.ink} />
              </View>
              <TextInput
                value={String(restBetweenExercisesSeconds)}
                onChangeText={(value) => {
                  const parsed = Number.parseInt(value.replace(/[^0-9]/g, ''), 10);
                  setRestBetweenExercisesSeconds(Number.isNaN(parsed) ? 0 : parsed);
                }}
                keyboardType="number-pad"
                style={styles.restValue}
              />
            </View>
            <Text style={styles.restUnit}>seconds</Text>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Exercises" meta={exercises.length} />
          <View style={styles.list}>
            {exercises.map((exercise, index) => (
              <Pressable key={exercise.id} onPress={() => openEditModal(exercise.id)}>
                <ExerciseEditorCard
                  exercise={exercise}
                  accentColor={routineAccentColors[index % routineAccentColors.length]}
                  onDelete={() => handleDeleteExercise(exercise.id)}
                  onMoveUp={() => moveExercise(index, -1)}
                  onMoveDown={() => moveExercise(index, 1)}
                  canMoveUp={index > 0}
                  canMoveDown={index < exercises.length - 1}
                />
              </Pressable>
            ))}
          </View>
          <SecondaryButton label="Add Exercise" icon={Plus} onPress={openCreateModal} />
        </View>

        <PrimaryButton
          label={mode === 'create' ? 'Save Routine' : 'Save Changes'}
          onPress={handleSubmit}
          disabled={!name.trim() || exercises.length === 0}
        />
      </ScreenContainer>

      <AddExerciseModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setEditingExerciseId(null);
        }}
        onSubmit={handleSaveExercise}
        title={editingExercise ? 'Edit Exercise' : 'Add Exercise'}
        submitLabel={editingExercise ? 'Save Exercise' : 'Add Exercise'}
        initialValues={
          editingExercise
            ? {
                name: editingExercise.name,
                restSeconds: editingExercise.restSeconds,
                sets: editingExercise.sets.map((set) => ({
                  reps: set.reps,
                  weightKg: set.weightKg,
                })),
              }
            : undefined
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  list: {
    gap: spacing.md,
  },
  restField: {
    gap: spacing.sm,
  },
  restLabel: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.sm,
    letterSpacing: 1,
    color: colors.inkMuted,
    textTransform: 'uppercase',
  },
  restInput: {
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.sandSoft,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  restLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  restIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.coralSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restValue: {
    flex: 1,
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.lg,
    color: colors.ink,
    paddingVertical: 0,
  },
  restUnit: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.md,
    color: colors.inkMuted,
  },
});
