import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamilies, fontSizes, radius, spacing } from '@/theme';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  destructive = true,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onCancel} />
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <SecondaryButton label={cancelLabel} onPress={onCancel} style={styles.actionButton} />
            <PrimaryButton
              label={confirmLabel}
              onPress={onConfirm}
              variant={destructive ? 'coral' : 'ink'}
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.screen,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17, 17, 17, 0.72)',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.md,
    zIndex: 1,
    borderWidth: 1,
    borderColor: colors.sandSoft,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 16,
  },
  title: {
    fontFamily: fontFamilies.displayBold,
    fontSize: fontSizes['2xl'],
    color: colors.ink,
  },
  message: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.base,
    color: colors.inkMuted,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: spacing.sm,
  },
  actionButton: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
});
