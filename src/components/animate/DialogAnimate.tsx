import { m, AnimatePresence } from "framer-motion";
import { Dialog, Box, Paper, DialogProps } from "@mui/material";
import { varFade } from "./variants";

interface DialogAnimateProps extends DialogProps {
  variants: Record<string, any>;
}

export default function DialogAnimate({
  open = false,
  variants,
  onClose,
  children,
  sx,
  ...other
}: DialogAnimateProps) {
  return (
    <AnimatePresence>
      {open && (
        <Dialog
          fullWidth
          maxWidth="xs"
          open={open}
          onClose={onClose}
          PaperComponent={(props) => (
            <Box
              component={m.div}
              {...(variants ||
                varFade({
                  distance: 120,
                  durationIn: 0.32,
                  durationOut: 0.24,
                  easeIn: "easeInOut",
                }).inUp)}
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                onClick={(event) => onClose && onClose(event, "backdropClick")}
                sx={{ width: "100%", height: "100%", position: "fixed" }}
              />
              <Paper sx={sx} {...props}>
                {props.children}
              </Paper>
            </Box>
          )}
          {...other}
        >
          {children}
        </Dialog>
      )}
    </AnimatePresence>
  );
}
