import { Image, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { LogoMark } from '@/components/common/LogoMark';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { colors, fontFamilies, fontSizes, spacing } from '@/theme';

export function SplashScreen() {
  return (
    <ScreenContainer scrollable={false} contentStyle={styles.content}>
      <View style={styles.center}>
        <Image
          source={require('../../../../assets/images/illustrations/splash.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
        <LogoMark centered showTagline />
        <Text style={styles.support}>
          Train smarter. Track better.{'\n'}Build consistency that lasts.
        </Text>
      </View>
      <PrimaryButton
        label="Get Started"
        variant="coral"
        onPress={() => router.replace('/home')}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: spacing.xl,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  illustration: {
    width: 280,
    height: 280,
    marginBottom: spacing.md,
  },
  support: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.base,
    color: colors.inkMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
