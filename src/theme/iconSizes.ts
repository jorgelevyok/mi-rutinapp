export const iconSizes = {
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 22,
} as const;

export type IconSizeToken = keyof typeof iconSizes;
