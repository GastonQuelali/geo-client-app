export const darkTheme = {
  background: {
    primary: '#0D1117',
    secondary: '#161B22',
    tertiary: '#1C2333',
    overlay: '#111827',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#8B9AB0',
    muted: '#4A5568',
    accent: '#60A5FA',
  },
  accent: {
    blue: '#3B82F6',
    blueSoft: '#1D3A6B',
    green: '#22C55E',
    greenSoft: '#14532D',
  },
  border: {
    default: '#1E2D40',
    subtle: '#2D3748',
  },
  nav: {
    background: '#0D1117',
    active: '#3B82F6',
    inactive: '#4A5568',
  },
};

export const lightTheme = {
  background: {
    primary: '#F0F7FF',
    secondary: '#FFFFFF',
    tertiary: '#E8F0FE',
    overlay: '#F5F5F5',
  },
  text: {
    primary: '#0D1117',
    secondary: '#4A5568',
    muted: '#9CA3AF',
    accent: '#2563EB',
  },
  accent: {
    blue: '#2563EB',
    blueSoft: '#DBEAFE',
    green: '#16A34A',
    greenSoft: '#DCFCE7',
  },
  border: {
    default: '#E2E8F0',
    subtle: '#CBD5E1',
  },
  nav: {
    background: '#FFFFFF',
    active: '#2563EB',
    inactive: '#9CA3AF',
  },
};

export type Theme = typeof darkTheme;
