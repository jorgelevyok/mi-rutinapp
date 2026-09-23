export const fontFamilies = {
  display: 'Syne_700Bold',
  displayRegular: 'Syne_400Regular',
  displaySemiBold: 'Syne_600SemiBold',
  displayBold: 'Syne_700Bold',
  displayExtraBold: 'Syne_800ExtraBold',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodySemiBold: 'DMSans_600SemiBold',
  bodyBold: 'DMSans_700Bold',
} as const;

export const fontSizes = {
  xs: 10,
  sm: 11,
  md: 13,
  base: 15,
  lg: 16,
  xl: 18,
  '2xl': 22,
  '3xl': 24,
  '4xl': 26,
  '5xl': 34,
} as const;

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const typography = {
  displayTitle: {
    fontFamily: fontFamilies.displayBold,
    fontSize: fontSizes['5xl'],
  },
  screenTitle: {
    fontFamily: fontFamilies.displayBold,
    fontSize: fontSizes['3xl'],
  },
  sectionTitle: {
    fontFamily: fontFamilies.displayBold,
    fontSize: fontSizes.xl,
  },
  body: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.base,
  },
  bodyMedium: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.base,
  },
  bodySemiBold: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.lg,
  },
  label: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.sm,
    letterSpacing: 1,
  },
  caption: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.md,
  },
  overline: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.xs,
    letterSpacing: 1,
  },
} as const;
