import { memo, ReactElement } from "react";
import { Stack } from "@mui/material";
import NavList from "./NavList";

const hideScrollbar = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
  overflowY: "scroll",
  "&::-webkit-scrollbar": {
    display: "none",
  },
};

interface NavSectionHorizontalProps {
  navConfig: Array<{
    subheader: string;
    items: Array<{
      title: string;
      path: string;
      icon: ReactElement;
      info?: ReactElement;
      roles?: Array<string>;
      disabled?: boolean;
      children?: Array<{
        title: string;
        path: string;
        children?: Array<{
          title: string;
          path: string;
          children?: Array<{
            title: string;
            path: string;
          }>;
        }>;
      }>;
      caption?: string;
    }>;
  }>;
}

function NavSectionHorizontal({ navConfig }: NavSectionHorizontalProps) {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      sx={{ bgcolor: "background.neutral", borderRadius: 1, px: 0.5 }}
    >
      <Stack direction="row" sx={{ ...hideScrollbar, py: 1 }}>
        {navConfig.map((group) => (
          <Stack key={group.subheader} direction="row" flexShrink={0}>
            {group.items.map((list) => (
              <NavList
                key={list.title + list.path}
                data={list}
                depth={1}
                hasChildren={!!list.children}
              />
            ))}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

export default memo(NavSectionHorizontal);
