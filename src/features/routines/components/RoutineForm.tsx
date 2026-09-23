import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Trash2, Minus, Plus, Repeat, Timer } from 'lucide-react-native';
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
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AddExerciseModal } from './AddExerciseModal';
import { ExerciseEditorCard } from './ExerciseEditorCard';

const DEFAULT_REST_BETWEEN_EXERCISES = 120;
const DEFAULT_TIMES_PER_WEEK = 1;

interface RoutineFormProps {
  mode: RoutineFormMode;
  initialValues?: RoutineFormValues;
  onBack: () => void;
  onSubmit: (values: RoutineFormValues) => void;
  onDeleteRoutine?: () => void;
}

export function RoutineForm({
  mode,
  initialValues,
  onBack,
  onSubmit,
  onDeleteRoutine,
}: RoutineFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [restBetweenExercisesSeconds, setRestBetweenExercisesSeconds] = useState(
    initialValues?.restBetweenExercisesSeconds ?? DEFAULT_REST_BETWEEN_EXERCISES,
  );
  const [timesPerWeek, setTimesPerWeek] = useState(
    initialValues?.timesPerWeek ?? DEFAULT_TIMES_PER_WEEK,
  );
  const [exercises, setExercises] = useState<WorkoutExercise[]>(initialValues?.exercises ?? []);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [exercisePendingDelete, setExercisePendingDelete] = useState<WorkoutExercise | null>(
    null,
  );
  const [isDeleteRoutineVisible, setIsDeleteRoutineVisible] = useState(false);

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
    setExercisePendingDelete(null);
  }

  function requestDeleteExercise(exercise: WorkoutExercise) {
    setExercisePendingDelete(exercise);
  }

  function confirmDeleteExercise() {
    if (!exercisePendingDelete) return;
    handleDeleteExercise(exercisePendingDelete.id);
  }

  function confirmDeleteRoutine() {
    setIsDeleteRoutineVisible(false);
    onDeleteRoutine?.();
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
      timesPerWeek: Math.min(7, Math.max(1, timesPerWeek)),
    });
  }

  return (
    <>
      <ScreenContainer scrollable={false} contentStyle={styles.screen}>
        <AppHeader title={mode === 'create' ? 'Create Routine' : 'Edit Routine'} onBack={onBack} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
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

          <View style={styles.restField}>
            <Text style={styles.restLabel}>TIMES PER WEEK</Text>
            <View style={styles.timesRow}>
              <View style={styles.timesLeft}>
                <View style={[styles.restIcon, styles.timesIcon]}>
                  <Repeat size={iconSizes.md} color={colors.ink} />
                </View>
                <Text style={styles.timesValue}>{timesPerWeek}</Text>
                <Text style={styles.restUnit}>
                  {timesPerWeek === 1 ? 'time' : 'times'}
                </Text>
              </View>
              <View style={styles.stepper}>
                <Pressable
                  onPress={() => setTimesPerWeek((current) => Math.max(1, current - 1))}
                  disabled={timesPerWeek <= 1}
                  style={({ pressed }) => [
                    styles.stepButton,
                    timesPerWeek <= 1 && styles.stepButtonDisabled,
                    pressed && timesPerWeek > 1 && styles.stepButtonPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Decrease times per week"
                >
                  <Minus
                    size={iconSizes.md}
                    color={timesPerWeek <= 1 ? colors.inkMuted : colors.ink}
                  />
                </Pressable>
                <Pressable
                  onPress={() => setTimesPerWeek((current) => Math.min(7, current + 1))}
                  disabled={timesPerWeek >= 7}
                  style={({ pressed }) => [
                    styles.stepButton,
                    timesPerWeek >= 7 && styles.stepButtonDisabled,
                    pressed && timesPerWeek < 7 && styles.stepButtonPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Increase times per week"
                >
                  <Plus
                    size={iconSizes.md}
                    color={timesPerWeek >= 7 ? colors.inkMuted : colors.ink}
                  />
                </Pressable>
              </View>
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
                    onDelete={() => requestDeleteExercise(exercise)}
                    onMoveUp={() => moveExercise(index, -1)}
                    onMoveDown={() => moveExercise(index, 1)}
                    canMoveUp={index > 0}
                    canMoveDown={index < exercises.length - 1}
                  />
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <SecondaryButton label="Add Exercise" icon={Plus} onPress={openCreateModal} />
          <PrimaryButton
            label={mode === 'create' ? 'Save Routine' : 'Save Changes'}
            onPress={handleSubmit}
            disabled={!name.trim() || exercises.length === 0}
          />
          {mode === 'edit' && onDeleteRoutine ? (
            <SecondaryButton
              label="Delete Routine"
              icon={Trash2}
              onPress={() => setIsDeleteRoutineVisible(true)}
            />
          ) : null}
        </View>
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

      <ConfirmModal
        visible={exercisePendingDelete !== null}
        title="Delete exercise?"
        message={
          exercisePendingDelete
            ? `Remove “${exercisePendingDelete.name}” from this routine? This can’t be undone.`
            : ''
        }
        confirmLabel="Delete"
        onConfirm={confirmDeleteExercise}
        onCancel={() => setExercisePendingDelete(null)}
      />

      <ConfirmModal
        visible={isDeleteRoutineVisible}
        title="Delete routine?"
        message={
          name.trim()
            ? `Delete “${name.trim()}” and all its exercises? This can’t be undone.`
            : 'Delete this routine and all its exercises? This can’t be undone.'
        }
        confirmLabel="Delete"
        onConfirm={confirmDeleteRoutine}
        onCancel={() => setIsDeleteRoutineVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: spacing.lg,
    paddingBottom: spacing.md,
  },
  footer: {
    gap: 12,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.sandSoft,
  },
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
  timesIcon: {
    backgroundColor: colors.mintSoft,
  },
  timesRow: {
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.sandSoft,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  timesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  timesValue: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.lg,
    color: colors.ink,
    minWidth: 16,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.sandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonDisabled: {
    opacity: 0.45,
  },
  stepButtonPressed: {
    opacity: 0.75,
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
