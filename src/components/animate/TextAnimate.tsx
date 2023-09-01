import { m } from "framer-motion";
import { Box, BoxProps } from "@mui/material";
import { varFade } from "./variants";

interface TextAnimateProps extends BoxProps {
  text: string;
  variants: Record<string, any>;
}

export default function TextAnimate({
  text,
  variants,
  sx,
  ...other
}: TextAnimateProps) {
  return (
    <Box
      component={m.h1}
      sx={{
        typography: "h1",
        overflow: "hidden",
        display: "inline-flex",
        ...sx,
      }}
      {...other}
    >
      {text.split("").map((letter, index) => (
        <m.span key={index} variants={variants || varFade().inUp}>
          {letter}
        </m.span>
      ))}
    </Box>
  );
}
