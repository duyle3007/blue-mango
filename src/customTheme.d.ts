import { Palette, ThemeOptions as BaseThemeOptions } from "@mui/material/styles";

declare module '@mui/material/styles' {
  interface Theme {
    palette: Record<string, any> & Palette;
    customShadows: {
      z1: string;
      z24: string;
      z8: string;
      z20: string;
      z12: string;
      dropdown: string;
      primary: string;
      secondary: string;
      info: string;
      success: string;
      warning: string;
      error: string;
      card: string;
      dialog: string;
    }
    components?: BaseThemeOptions
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    palette?: Record<string, any> & Palette;
    customShadows?: {
      z1?: string;
      z24?: string;
      z8?: string;
      z20?: string;
      z12?: string;
      dropdown?: string;
      primary?: string;
      secondary?: string;
      info?: string;
      success?: string;
      warning?: string;
      error?: string;
      card?: string;
      dialog?: string;
    },
    components?: BaseThemeOptions
  }
}

export {};