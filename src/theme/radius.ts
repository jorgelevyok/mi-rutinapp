export const radius = {
  sm: 14,
  md: 16,
  lg: 22,
  xl: 24,
  card: 28,
  pill: 999,
  full: 999,
} as const;

export type RadiusToken = keyof typeof radius;
