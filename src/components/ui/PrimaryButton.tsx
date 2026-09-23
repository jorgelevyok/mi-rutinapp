import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { colors, fontFamilies, fontSizes, iconSizes, radius, spacing } from '@/theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: LucideIcon;
  variant?: 'ink' | 'coral';
  disabled?: boolean;
  style?: ViewStyle;
}

export function PrimaryButton({
  label,
  onPress,
  icon: Icon,
  variant = 'ink',
  disabled = false,
  style,
}: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === 'coral' && styles.coral,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {Icon ? <Icon size={iconSizes.lg} color={colors.white} /> : null}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.ink,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  coral: {
    backgroundColor: colors.coral,
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.lg,
    color: colors.white,
  },
});
