import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Href, router } from 'expo-router';
import type { WorkoutRoutine } from '@/types';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { LogoMark } from '@/components/common/LogoMark';
import { BottomNavigation } from '@/components/common/BottomNavigation';
import { EmptyState } from '@/components/common/EmptyState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { IconButton } from '@/components/ui/IconButton';
import { RoutineCard } from '@/features/routines/components/RoutineCard';
import { colors, fontFamilies, fontSizes, spacing } from '@/theme';
import { useRoutines } from '@/features/routines/hooks/useRoutines';

export function HomeScreen() {
  const { routines } = useRoutines();

  function openRoutine(routine: WorkoutRoutine) {
    router.push(`/routine/${routine.id}` as Href);
  }

  return (
    <ScreenContainer scrollable={false} contentStyle={styles.content}>
      <View style={styles.header}>
        <LogoMark compact showTagline />
        <Image
          source={require('../../../../assets/images/illustrations/home.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.title}>My Routines</Text>
        <IconButton
          icon={Plus}
          onPress={() => router.push('/routine/create')}
          size={48}
          backgroundColor={colors.ink}
          iconColor={colors.white}
          bordered={false}
        />
      </View>

      <FlatList
        data={routines}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title="No routines yet"
            description="Create your first routine to start training."
          />
        }
        renderItem={({ item }) => (
          <RoutineCard routine={item} onPress={() => openRoutine(item)} />
        )}
      />

      <PrimaryButton
        label="Create New Routine"
        icon={Plus}
        onPress={() => router.push('/routine/create')}
      />

      <View style={styles.navWrap}>
        <BottomNavigation
          active="routines"
          onChange={(tab) => {
            if (tab === 'progress') router.push('/progress');
            if (tab === 'profile') router.push('/profile');
          }}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: spacing.lg,
    paddingTop: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  illustration: {
    width: 72,
    height: 72,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fontFamilies.displayBold,
    fontSize: fontSizes['5xl'],
    color: colors.ink,
  },
  list: {
    flexGrow: 1,
    gap: 12,
    paddingBottom: spacing.sm,
  },
  navWrap: {
    paddingTop: spacing.sm,
  },
});
