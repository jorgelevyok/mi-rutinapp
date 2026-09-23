import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Timer } from 'lucide-react-native';
import { colors, fontFamilies, fontSizes, iconSizes, radius, spacing } from '@/theme';

const chronometerGreen = '#2F9E6B';
const chronometerRed = '#E23B3B';

interface RestChronometerProps {
  visible: boolean;
  formattedTime: string;
  targetRestSeconds: number;
  isOverTarget: boolean;
  onStop: () => void;
}

export function RestChronometer({
  visible,
  formattedTime,
  targetRestSeconds,
  isOverTarget,
  onStop,
}: RestChronometerProps) {
  if (!visible) return null;

  const accent = isOverTarget ? chronometerRed : chronometerGreen;

  return (
    <View style={[styles.card, { backgroundColor: accent }]}>
      <View style={styles.left}>
        <View style={styles.iconWrap}>
          <Timer size={iconSizes.lg} color={colors.ink} />
        </View>
        <View>
          <Text style={styles.label}>{isOverTarget ? 'OVER REST' : 'REST'}</Text>
          <Text style={styles.time}>{formattedTime}</Text>
          {targetRestSeconds > 0 ? (
            <Text style={styles.target}>Target {targetRestSeconds}s</Text>
          ) : null}
        </View>
      </View>
      <Pressable onPress={onStop} style={styles.stop}>
        <Text style={styles.stopLabel}>Stop</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 78,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.sm,
    letterSpacing: 1,
    color: colors.white,
  },
  time: {
    fontFamily: fontFamilies.displayBold,
    fontSize: fontSizes['2xl'],
    color: colors.white,
  },
  target: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.xs,
    color: colors.white,
    opacity: 0.9,
    marginTop: 2,
  },
  stop: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
  stopLabel: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.md,
    color: colors.ink,
  },
});
