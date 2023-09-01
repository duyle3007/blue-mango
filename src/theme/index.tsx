import { PropsWithChildren, useMemo } from "react";
import { CssBaseline, Direction, Shadows } from "@mui/material";
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import palette from "./palette";
import typography from "./typography";
import breakpoints from "./breakpoints";
import componentsOverride from "./overrides";
import shadows, { customShadows } from "./shadows";

export default function ThemeProvider({ children }: PropsWithChildren) {
  const theme = createTheme({
    palette: palette.light,
    typography,
    breakpoints,
    shape: { borderRadius: 8 },
    direction: 'light' as Direction,
    shadows: shadows.light as Shadows,
    customShadows: customShadows.light,
  });

  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}
