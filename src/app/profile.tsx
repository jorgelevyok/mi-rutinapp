import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { BottomNavigation } from '@/components/common/BottomNavigation';
import { EmptyState } from '@/components/common/EmptyState';
import { colors, fontFamilies, fontSizes, spacing } from '@/theme';

export default function ProfileRoute() {
  return (
    <ScreenContainer scrollable={false} contentStyle={styles.content}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.body}>
        <EmptyState
          title="Coming soon"
          description="Account settings and training preferences will live here."
        />
      </View>
      <BottomNavigation
        active="profile"
        onChange={(tab) => {
          if (tab === 'routines') router.replace('/home');
          if (tab === 'progress') router.replace('/progress');
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: spacing.lg,
  },
  title: {
    fontFamily: fontFamilies.displayBold,
    fontSize: fontSizes['5xl'],
    color: colors.ink,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
});
