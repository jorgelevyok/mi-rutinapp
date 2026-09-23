import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamilies, fontSizes, spacing } from '@/theme';

interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontFamily: fontFamilies.displayBold,
    fontSize: fontSizes.xl,
    color: colors.ink,
    textAlign: 'center',
  },
  description: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.base,
    color: colors.inkMuted,
    textAlign: 'center',
  },
});
