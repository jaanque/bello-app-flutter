// styles/theme.ts
export const colors = {
  background: '#ffffff', // Standard white background
  text: '#000000',       // Standard black text
  primary: '#0D6EFD',    // Apple's typical blue for interactive elements
  secondary: '#6c757d',  // A secondary gray for less important text/icons
  lightGray: '#f8f9fa',  // Light gray for backgrounds or borders
  mediumGray: '#e9ecef', // Medium gray for disabled states or dividers
  darkGray: '#343a40',   // Dark gray for some text elements or icons
  white: '#ffffff',
  black: '#000000',
  red: '#dc3545',       // For destructive actions
  // ... add more as needed
};

export const typography = {
  fonts: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16, // Base size
    lg: 18,
    xl: 20,
    xxl: 24,
    // ... add more as needed for specific text styles like titles, captions
  },
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 22,
    lg: 24,
    xl: 28,
    xxl: 32,
  },
  // Predefined text styles
  textStyles: {
    body: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: colors.text,
    },
    caption: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      color: colors.secondary,
    },
    button: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      color: colors.primary,
    },
    title1: {
      fontFamily: 'Inter-Bold',
      fontSize: 28, // Example size for a large title
      color: colors.text,
    },
    title2: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 22, // Example size for a subtitle
      color: colors.text,
    },
    // ... more text styles
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16, // Base spacing unit
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 4,
  md: 8, // Standard corner radius
  lg: 16,
  full: 9999, // For circular elements
};

const theme = {
  colors,
  typography,
  spacing,
  radii,
};

export default theme;
