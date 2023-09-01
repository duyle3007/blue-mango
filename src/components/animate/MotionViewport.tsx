import { m } from "framer-motion";
import { Box, BoxProps } from "@mui/material";
import { varContainer } from ".";
import useResponsive from "../../hooks/useResponsive";

interface MotionViewportProps extends BoxProps {
  disableAnimatedMobile: boolean;
}

export default function MotionViewport({
  children,
  disableAnimatedMobile = false,
  ...other
}: MotionViewportProps) {
  const isMobile = useResponsive("down", "sm");

  if (isMobile && disableAnimatedMobile) {
    return <Box {...other}>{children}</Box>;
  }

  return (
    <Box
      component={m.div}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      variants={varContainer()}
      {...other}
    >
      {children}
    </Box>
  );
}
