import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamilies, fontSizes } from '@/theme';

interface SectionHeaderProps {
  title: string;
  meta?: string | number;
}

export function SectionHeader({ title, meta }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {meta !== undefined ? <Text style={styles.meta}>{meta}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fontFamilies.displayBold,
    fontSize: fontSizes.xl,
    color: colors.ink,
  },
  meta: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.md,
    color: colors.inkMuted,
  },
});
