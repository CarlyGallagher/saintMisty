// Y2K Theme - Red, Black, White with Leopard Print

export const colors = {
  // Primary colors
  primary: '#FF0000',        // Bright red
  primaryDark: '#CC0000',    // Dark red
  primaryLight: '#FF3333',   // Light red

  // Neutrals
  black: '#000000',
  white: '#FFFFFF',
  grayLight: '#F5F5F5',
  grayMedium: '#CCCCCC',
  grayDark: '#666666',

  // Accents
  accent: '#FF0000',         // Red accent
  accentHover: '#CC0000',    // Darker red on hover

  // Card backgrounds
  cardBg: '#FFFFFF',
  cardBgAlt: '#000000',
  cardBgTransparent: 'rgba(255, 255, 255, 0.9)',
  cardBgTransparentDark: 'rgba(0, 0, 0, 0.85)',

  // Text
  textPrimary: '#000000',
  textSecondary: '#666666',
  textLight: '#FFFFFF',
  textAccent: '#FF0000',

  // Borders
  border: '#000000',
  borderLight: '#CCCCCC',
  borderAccent: '#FF0000',
};

export const typography = {
  fontFamily: {
    primary: '"Arial", "Helvetica", sans-serif',
    heading: '"Arial Black", "Arial Bold", sans-serif',
    accent: '"Comic Sans MS", "Comic Sans", cursive',
  },
  fontSize: {
    xs: '10px',
    sm: '12px',
    base: '14px',
    md: '16px',
    lg: '18px',
    xl: '24px',
    xxl: '32px',
    xxxl: '48px',
  },
  fontWeight: {
    normal: 400,
    bold: 700,
    black: 900,
  },
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  base: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

export const card = {
  borderRadius: '8px',
  border: `2px solid ${colors.black}`,
  shadow: '4px 4px 0px rgba(0, 0, 0, 0.8)',
  shadowHover: '6px 6px 0px rgba(0, 0, 0, 0.8)',
  padding: spacing.base,
};

export const transitions = {
  fast: '0.15s ease',
  normal: '0.3s ease',
  slow: '0.5s ease',
};

// Leopard print pattern as data URI
export const leopardPrint = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cdefs%3E%3Cpattern id='leopard' x='0' y='0' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Crect fill='%23D4A574' width='100' height='100'/%3E%3Cellipse cx='20' cy='20' rx='12' ry='8' fill='%23000' opacity='0.3'/%3E%3Cellipse cx='22' cy='21' rx='8' ry='6' fill='%23C89968' opacity='0.6'/%3E%3Cellipse cx='60' cy='15' rx='10' ry='7' fill='%23000' opacity='0.3'/%3E%3Cellipse cx='62' cy='16' rx='7' ry='5' fill='%23C89968' opacity='0.6'/%3E%3Cellipse cx='45' cy='45' rx='13' ry='9' fill='%23000' opacity='0.3'/%3E%3Cellipse cx='47' cy='46' rx='9' ry='7' fill='%23C89968' opacity='0.6'/%3E%3Cellipse cx='15' cy='60' rx='11' ry='8' fill='%23000' opacity='0.3'/%3E%3Cellipse cx='17' cy='61' rx='8' ry='6' fill='%23C89968' opacity='0.6'/%3E%3Cellipse cx='75' cy='70' rx='12' ry='7' fill='%23000' opacity='0.3'/%3E%3Cellipse cx='77' cy='71' rx='8' ry='5' fill='%23C89968' opacity='0.6'/%3E%3Cellipse cx='85' cy='35' rx='9' ry='6' fill='%23000' opacity='0.3'/%3E%3Cellipse cx='87' cy='36' rx='6' ry='4' fill='%23C89968' opacity='0.6'/%3E%3Cellipse cx='30' cy='85' rx='10' ry='8' fill='%23000' opacity='0.3'/%3E%3Cellipse cx='32' cy='86' rx='7' ry='6' fill='%23C89968' opacity='0.6'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23leopard)' width='100' height='100'/%3E%3C/svg%3E")`;

export default {
  colors,
  typography,
  spacing,
  card,
  transitions,
  leopardPrint,
};
