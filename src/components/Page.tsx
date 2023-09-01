import { forwardRef, ReactNode } from "react";
import { Box, BoxProps } from "@mui/material";

interface PageProps extends BoxProps {
  title?: string;
  meta?: ReactNode;
}

const Page = forwardRef(
  ({ children, title = "", meta, ...other }: PageProps, ref: any) => (
    <>
      <Box ref={ref} {...other}>
        {children}
      </Box>
    </>
  )
);

export default Page;
