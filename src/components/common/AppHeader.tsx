import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { colors, fontFamilies, fontSizes, iconSizes, radius, spacing } from '@/theme';

interface AppHeaderProps {
  title: string;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
}

export function AppHeader({ title, onBack, rightSlot }: AppHeaderProps) {
  return (
    <View style={styles.row}>
      {onBack ? (
        <Pressable onPress={onBack} style={styles.backButton} hitSlop={8}>
          <ChevronLeft size={iconSizes.xl} color={colors.ink} />
        </Pressable>
      ) : (
        <View style={styles.spacer} />
      )}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {rightSlot ?? <View style={styles.spacer} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    minHeight: 48,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.sandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fontFamilies.displayBold,
    fontSize: fontSizes['3xl'],
    color: colors.ink,
  },
  spacer: {
    width: 40,
    height: 40,
  },
});
