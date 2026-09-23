export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  screen: 20,
} as const;

export type SpacingToken = keyof typeof spacing;
