import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Copy, Minus, Plus, Timer, X } from 'lucide-react-native';
import type { ExerciseFormValues, ExerciseSetDraft } from '@/types';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { colors, fontFamilies, fontSizes, iconSizes, radius, spacing } from '@/theme';

interface AddExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: ExerciseFormValues) => void;
  initialValues?: ExerciseFormValues;
  title?: string;
  submitLabel?: string;
}

const DEFAULT_REPS = 10;
const DEFAULT_SETS = 4;
const DEFAULT_REST = 60;

function createDefaultSets(count: number, reps = DEFAULT_REPS): ExerciseSetDraft[] {
  return Array.from({ length: count }, () => ({ reps, weightKg: null }));
}

export function AddExerciseModal({
  visible,
  onClose,
  onSubmit,
  initialValues,
  title = 'Add Exercise',
  submitLabel = 'Add Exercise',
}: AddExerciseModalProps) {
  const [name, setName] = useState('');
  const [sets, setSets] = useState<ExerciseSetDraft[]>(createDefaultSets(DEFAULT_SETS));
  const [restSeconds, setRestSeconds] = useState(DEFAULT_REST);

  useEffect(() => {
    if (!visible) return;
    if (initialValues) {
      setName(initialValues.name);
      setSets(initialValues.sets.map((set) => ({ ...set })));
      setRestSeconds(initialValues.restSeconds);
      return;
    }
    setName('');
    setSets(createDefaultSets(DEFAULT_SETS));
    setRestSeconds(DEFAULT_REST);
  }, [visible, initialValues]);

  function handleClose() {
    onClose();
  }

  function updateSetCount(nextCount: number) {
    const count = Math.max(1, Math.min(10, nextCount));
    setSets((current) => {
      if (count === current.length) return current;
      if (count > current.length) {
        const last = current[current.length - 1] ?? { reps: DEFAULT_REPS, weightKg: null };
        return [
          ...current,
          ...Array.from({ length: count - current.length }, () => ({ ...last })),
        ];
      }
      return current.slice(0, count);
    });
  }

  function updateRepsAt(index: number, value: string) {
    const parsed = Number.parseInt(value.replace(/[^0-9]/g, ''), 10);
    setSets((current) =>
      current.map((set, i) =>
        i === index ? { ...set, reps: Number.isNaN(parsed) ? 0 : parsed } : set,
      ),
    );
  }

  function updateWeightAt(index: number, value: string) {
    const cleaned = value.replace(',', '.').replace(/[^0-9.]/g, '');
    setSets((current) =>
      current.map((set, i) => {
        if (i !== index) return set;
        if (!cleaned) return { ...set, weightKg: null };
        const parsed = Number.parseFloat(cleaned);
        return { ...set, weightKg: Number.isNaN(parsed) ? null : parsed };
      }),
    );
  }

  function replicateWeightToAllSets() {
    const source =
      sets.find((set) => set.weightKg !== null)?.weightKg ?? sets[0]?.weightKg ?? null;
    if (source === null) return;
    setSets((current) => current.map((set) => ({ ...set, weightKg: source })));
  }

  function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (sets.some((set) => set.reps <= 0)) return;

    onSubmit({
      name: trimmed,
      sets,
      restSeconds: Math.max(0, restSeconds),
    });
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <X size={iconSizes.md} color={colors.ink} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.field}>
              <Text style={styles.label}>EXERCISE NAME</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Lateral Raise"
                placeholderTextColor={colors.inkMuted}
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>SETS</Text>
              <View style={styles.setsControl}>
                <Pressable
                  onPress={() => updateSetCount(sets.length - 1)}
                  style={styles.stepperButton}
                >
                  <Minus size={iconSizes.md} color={colors.ink} />
                </Pressable>
                <Text style={styles.setsValue}>{sets.length}</Text>
                <Pressable
                  onPress={() => updateSetCount(sets.length + 1)}
                  style={[styles.stepperButton, styles.stepperPlus]}
                >
                  <Plus size={iconSizes.md} color={colors.ink} />
                </Pressable>
              </View>
            </View>

            <View style={styles.field}>
              <View style={styles.sectionHeader}>
                <Text style={styles.label}>REPS & WEIGHT PER SET</Text>
                <Pressable
                  onPress={replicateWeightToAllSets}
                  style={styles.replicateButton}
                  disabled={!sets.some((set) => set.weightKg !== null)}
                >
                  <Copy size={iconSizes.sm} color={colors.ink} />
                  <Text style={styles.replicateLabel}>Copy kg</Text>
                </Pressable>
              </View>
              <View style={styles.repsList}>
                {sets.map((set, index) => (
                  <View key={`set-${index}`} style={styles.repRow}>
                    <Text style={styles.repLabel}>Set {index + 1}</Text>
                    <View style={styles.inputsRow}>
                      <View style={styles.inlineField}>
                        <TextInput
                          value={set.reps > 0 ? String(set.reps) : ''}
                          onChangeText={(value) => updateRepsAt(index, value)}
                          keyboardType="number-pad"
                          style={styles.repInput}
                        />
                        <Text style={styles.repUnit}>reps</Text>
                      </View>
                      <View style={styles.inlineField}>
                        <TextInput
                          value={set.weightKg === null ? '' : String(set.weightKg)}
                          onChangeText={(value) => updateWeightAt(index, value)}
                          keyboardType="decimal-pad"
                          placeholder="—"
                          placeholderTextColor={colors.inkMuted}
                          style={styles.repInput}
                        />
                        <Text style={styles.repUnit}>kg</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>REST BETWEEN SETS</Text>
              <View style={styles.restInput}>
                <View style={styles.restLeft}>
                  <View style={styles.restIcon}>
                    <Timer size={iconSizes.md} color={colors.ink} />
                  </View>
                  <TextInput
                    value={String(restSeconds)}
                    onChangeText={(value) => {
                      const parsed = Number.parseInt(value.replace(/[^0-9]/g, ''), 10);
                      setRestSeconds(Number.isNaN(parsed) ? 0 : parsed);
                    }}
                    keyboardType="number-pad"
                    style={styles.restValue}
                  />
                </View>
                <Text style={styles.restUnit}>seconds</Text>
              </View>
            </View>

            <PrimaryButton
              label={submitLabel}
              icon={Plus}
              onPress={handleSubmit}
              disabled={!name.trim()}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    paddingTop: 12,
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.xl,
    maxHeight: '92%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.sandSoft,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fontFamilies.displayBold,
    fontSize: fontSizes['3xl'],
    color: colors.ink,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.sandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.md,
  },
  field: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  replicateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.coralSoft,
  },
  replicateLabel: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.sm,
    color: colors.ink,
  },
  label: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.sm,
    letterSpacing: 1,
    color: colors.inkMuted,
  },
  input: {
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.sandSoft,
    paddingHorizontal: spacing.md,
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.lg,
    color: colors.ink,
  },
  setsControl: {
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.sandSoft,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.sandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperPlus: {
    backgroundColor: colors.coralSoft,
    borderColor: colors.ink,
    borderWidth: 2,
  },
  setsValue: {
    fontFamily: fontFamilies.bodyBold,
    fontSize: fontSizes['2xl'],
    color: colors.ink,
  },
  repsList: {
    gap: spacing.sm,
  },
  repRow: {
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.sandSoft,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  repLabel: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.base,
    color: colors.inkMuted,
    minWidth: 52,
  },
  inputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  inlineField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  repInput: {
    minWidth: 40,
    textAlign: 'right',
    fontFamily: fontFamilies.bodyBold,
    fontSize: fontSizes.xl,
    color: colors.ink,
    padding: 0,
  },
  repUnit: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.md,
    color: colors.inkMuted,
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
    gap: 10,
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
    minWidth: 48,
    fontFamily: fontFamilies.bodyBold,
    fontSize: fontSizes.xl,
    color: colors.ink,
    padding: 0,
  },
  restUnit: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.md,
    color: colors.inkMuted,
  },
});
