import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';

interface ScreenContainerProps extends PropsWithChildren {
  scrollable?: boolean;
  padded?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
}

export function ScreenContainer({
  children,
  scrollable = true,
  padded = true,
  style,
  contentStyle,
  edges = ['top', 'bottom'],
}: ScreenContainerProps) {
  const paddingStyle = padded
    ? { paddingHorizontal: spacing.screen, paddingBottom: spacing.xl }
    : undefined;

  return (
    <SafeAreaView style={[styles.safe, style]} edges={edges}>
      {scrollable ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, paddingStyle, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.body, paddingStyle, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  body: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    gap: spacing.lg,
    paddingTop: spacing.sm,
  },
});
