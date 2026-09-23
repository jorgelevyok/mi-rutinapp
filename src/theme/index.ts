import { colors } from './colors';
import { spacing } from './spacing';
import { radius } from './radius';
import { typography, fontFamilies, fontSizes, fontWeights } from './typography';
import { shadows } from './shadows';
import { iconSizes } from './iconSizes';

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  fontFamilies,
  fontSizes,
  fontWeights,
  shadows,
  iconSizes,
} as const;

export type Theme = typeof theme;

export {
  colors,
  spacing,
  radius,
  typography,
  fontFamilies,
  fontSizes,
  fontWeights,
  shadows,
  iconSizes,
};
