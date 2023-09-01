import { Breakpoint, useTheme } from "@mui/material/styles";
import { Typography } from "@mui/material/styles/createTypography";
import { CSSProperties } from "react";
import useResponsive from "../hooks/useResponsive";

function useWidth(): Breakpoint {
  const theme = useTheme();

  const keys = [...theme.breakpoints.keys].reverse();

  return (
    keys.reduce((output: Breakpoint, key: Breakpoint) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useResponsive("up", key);

      return !output && matches ? key : output;
    }) || "xs"
  );
}

export function remToPx(value: string) {
  return Math.round(parseFloat(value) * 16);
}

export function pxToRem(value: number) {
  return `${value / 16}rem`;
}

export function responsiveFontSizes({
  sm,
  md,
  lg,
}: {
  sm: number;
  md: number;
  lg: number;
}) {
  return {
    "@media (min-width:600px)": {
      fontSize: pxToRem(sm),
    },
    "@media (min-width:900px)": {
      fontSize: pxToRem(md),
    },
    "@media (min-width:1200px)": {
      fontSize: pxToRem(lg),
    },
  };
}

export default function GetFontValue(variant: keyof Typography) {
  const theme = useTheme();

  const breakpoints = useWidth();

  const key = theme.breakpoints.up(breakpoints === "xl" ? "lg" : breakpoints);

  const hasResponsive =
    variant === "h1" ||
    variant === "h2" ||
    variant === "h3" ||
    variant === "h4" ||
    variant === "h5" ||
    variant === "h6";

  const getFont = (
    hasResponsive && theme.typography[variant][key]
      ? theme.typography[variant][key]
      : theme.typography[variant]
  ) as CSSProperties;

  const fontSize = remToPx(getFont.fontSize as string);

  const lineHeight =
    Number((theme.typography[variant] as CSSProperties)?.lineHeight) * fontSize;

  const { fontWeight, letterSpacing } = theme.typography[
    variant
  ] as CSSProperties;

  return { fontSize, lineHeight, fontWeight, letterSpacing };
}
