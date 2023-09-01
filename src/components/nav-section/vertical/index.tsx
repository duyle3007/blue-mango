import { List, Box } from "@mui/material";
import { ListSubheaderStyle } from "./style";
import NavList from "./NavList";
import { ReactElement } from "react";

// REFACTOR ME
interface NavSectionVerticalProps {
  isCollapse: boolean;
  onChange?: (payload: { action: string; params?: any}) => void;
  navConfig: Array<{
    subheader: string;
    items: Array<{
      title: string;
      path: string;
      icon: ReactElement;
      info?: ReactElement;
      roles?: Array<string>;
      disabled?: boolean;
      actionName?: string;
      children?: Array<{
        title: string;
        path: string;
        actionName?: string
        children?: Array<{
          title: string;
          path: string;
          actionName?: string;
          children?: Array<{
            title: string;
            path: string;
            actionName?: string
          }>;
        }>;
      }>;
      caption?: string;
    }>;
  }>;
}

export default function NavSectionVertical({
  navConfig,
  isCollapse,
  onChange,
  ...other
}: NavSectionVerticalProps) {
  return (
    <Box {...other}>
      {navConfig.map((group) => (
        <List key={group.subheader} disablePadding sx={{ px: 2 }}>
          <ListSubheaderStyle
            sx={{
              ...(isCollapse && {
                opacity: 0,
              }),
            }}
          >
            {group.subheader}
          </ListSubheaderStyle>

          {group.items.map((list) => (
            <NavList
              key={list.title + list.path}
              data={list}
              depth={1}
              hasChildren={!!list.children}
              isCollapse={isCollapse}
              actionName={list.actionName}
              onClick={(payload) => onChange?.(payload)}
            />
          ))}
        </List>
      ))}
    </Box>
  );
}
