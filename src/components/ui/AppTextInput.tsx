import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, fontFamilies, fontSizes, radius, spacing } from '@/theme';

interface AppTextInputProps extends TextInputProps {
  label?: string;
}

export function AppTextInput({ label, style, ...props }: AppTextInputProps) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.inkMuted}
        style={[styles.input, style]}
        {...props}
      />
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
    textTransform: 'uppercase',
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
});
