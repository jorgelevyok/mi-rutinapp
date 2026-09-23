import { ViewStyle } from 'react-native';
import { colors } from './colors';

export const shadows = {
  soft: {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  } satisfies ViewStyle,
  card: {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  } satisfies ViewStyle,
} as const;
