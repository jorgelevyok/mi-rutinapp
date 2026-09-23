import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Dumbbell, LineChart, User } from 'lucide-react-native';
import { colors, fontFamilies, fontSizes, iconSizes, radius, shadows, spacing } from '@/theme';

export type BottomTabKey = 'routines' | 'progress' | 'profile';

interface BottomNavigationProps {
  active: BottomTabKey;
  onChange: (tab: BottomTabKey) => void;
}

const tabs: { key: BottomTabKey; label: string; icon: typeof Dumbbell }[] = [
  { key: 'routines', label: 'Routines', icon: Dumbbell },
  { key: 'progress', label: 'Progress', icon: LineChart },
  { key: 'profile', label: 'Profile', icon: User },
];

export function BottomNavigation({ active, onChange }: BottomNavigationProps) {
  return (
    <View style={styles.bar}>
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        const Icon = tab.icon;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={[styles.item, isActive && styles.itemActive]}
          >
            <Icon
              size={iconSizes['2xl']}
              color={isActive ? colors.coral : colors.inkMuted}
              fill="transparent"
              strokeWidth={isActive ? 2.4 : 2}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    ...shadows.card,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  itemActive: {
    backgroundColor: `${colors.coral}18`,
  },
  label: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.xs,
    color: colors.inkMuted,
  },
  labelActive: {
    fontFamily: fontFamilies.bodyBold,
    color: colors.coral,
  },
});
