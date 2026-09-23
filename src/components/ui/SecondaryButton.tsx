import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { colors, fontFamilies, fontSizes, iconSizes, radius, spacing } from '@/theme';

interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: LucideIcon;
  style?: ViewStyle;
}

export function SecondaryButton({ label, onPress, icon: Icon, style }: SecondaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
    >
      {Icon ? <Icon size={iconSizes.lg} color={colors.ink} /> : null}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.ink,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.base,
    color: colors.ink,
  },
});
