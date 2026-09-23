export const colors = {
  bg: '#F7F4EF',
  bgCream: '#F9F7F2',
  bgCreamDeep: '#F0E6D8',
  bgElevated: '#FFFFFF',
  ink: '#111111',
  inkMuted: '#8A8680',
  coral: '#FF6B4A',
  coralSoft: '#FFB8A6',
  mintSoft: '#A8DFC5',
  lilacSoft: '#C9C2F0',
  beigeSoft: '#E8E8E8',
  sandSoft: '#DCD6CC',
  white: '#FFFFFF',
  overlay: 'rgba(17, 17, 17, 0.6)',
  shadow: '#00000010',
} as const;

export type ColorToken = keyof typeof colors;

export const routineAccentColors = [
  colors.coralSoft,
  colors.mintSoft,
  colors.lilacSoft,
  colors.sandSoft,
] as const;
