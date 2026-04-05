/**
 * Dark mode color palette helper
 */

export const darkColors = {
  // Backgrounds
  pageLight: "#FFFFFF",
  pageDark: "#0F172A",
  cardLight: "#FFFFFF",
  cardDark: "#1E293B",
  inputLight: "#FFFFFF",
  inputDark: "#1E293B",
  subtleLight: "#F8FAFC",
  subtleDark: "#0F172A",
  
  // Text
  textPrimaryLight: "#0F172A",
  textPrimaryDark: "#F1F5F9",
  textSecondaryLight: "#64748B",
  textSecondaryDark: "#94A3B8",
  textTertiaryLight: "#94A3B8",
  textTertiaryDark: "#64748B",
  
  // Borders
  borderLight: "#E2E8F0",
  borderDark: "#334155",
  borderSubtleLight: "#F1F5F9",
  borderSubtleDark: "#475569",
  
  // Shadows
  shadowLight: "0 1px 4px rgba(0,0,0,0.06)",
  shadowDark: "0 1px 4px rgba(0,0,0,0.3)",
  shadowLightIntense: "0 12px 28px rgba(0,0,0,0.11)",
  shadowDarkIntense: "0 12px 28px rgba(0,0,0,0.5)",
  
  // Progress/bars
  progressLight: "#F1F5F9",
  progressDark: "#334155",
  
  // Icons
  iconSecondaryLight: "#94A3B8",
  iconSecondaryDark: "#64748B",
};

export const getColor = (lightColor, darkColor, isDark) => {
  return isDark ? darkColor : lightColor;
};

export const containerStyle = (isDark) => ({
  background: isDark ? darkColors.pageDark : darkColors.pageLight,
});

export const cardStyle = (isDark) => ({
  background: isDark ? darkColors.cardDark : darkColors.cardLight,
  border: `1px solid ${isDark ? darkColors.borderDark : darkColors.borderLight}`,
  boxShadow: isDark ? darkColors.shadowDark : darkColors.shadowLight,
});

export const textStyle = {
  primary: (isDark) => isDark ? darkColors.textPrimaryDark : darkColors.textPrimaryLight,
  secondary: (isDark) => isDark ? darkColors.textSecondaryDark : darkColors.textSecondaryLight,
  tertiary: (isDark) => isDark ? darkColors.textTertiaryDark : darkColors.textTertiaryLight,
};
