import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamilies, radius } from '@/theme';

interface LogoMarkProps {
  compact?: boolean;
  /** Center-align the stack (splash). Home uses left align. */
  centered?: boolean;
  showTagline?: boolean;
}

export function LogoMark({
  compact = false,
  centered = false,
  showTagline = false,
}: LogoMarkProps) {
  return (
    <View style={[styles.wrap, centered && styles.wrapCentered]}>
      <Text style={[styles.mi, compact && styles.miCompact]}>MI</Text>
      <Text style={[styles.brand, compact && styles.brandCompact]}>RUTINAPP</Text>
      <View style={[styles.swoosh, compact && styles.swooshCompact]} />
      {showTagline ? (
        <Text style={[styles.tagline, compact && styles.taglineCompact]}>
          BUILD A STRONGER YOU
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'flex-start',
    gap: 6,
  },
  wrapCentered: {
    alignSelf: 'center',
  },
  mi: {
    fontFamily: fontFamilies.displayExtraBold,
    fontSize: 28,
    letterSpacing: 2,
    color: colors.ink,
    lineHeight: 32,
  },
  miCompact: {
    fontSize: 16,
    letterSpacing: 1.5,
    lineHeight: 18,
  },
  brand: {
    fontFamily: fontFamilies.displayExtraBold,
    fontSize: 36,
    letterSpacing: 1,
    color: colors.ink,
    lineHeight: 40,
    marginTop: -2,
  },
  brandCompact: {
    fontSize: 22,
    letterSpacing: 0.5,
    lineHeight: 24,
    marginTop: 0,
  },
  swoosh: {
    marginTop: 4,
    height: 8,
    width: 180,
    borderRadius: radius.pill,
    backgroundColor: colors.coral,
  },
  swooshCompact: {
    marginTop: 2,
    height: 5,
    width: 110,
  },
  tagline: {
    marginTop: 8,
    alignSelf: 'stretch',
    textAlign: 'center',
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 13,
    letterSpacing: 3,
    color: colors.coral,
  },
  taglineCompact: {
    marginTop: 4,
    fontSize: 10,
    letterSpacing: 1,
  },
});
