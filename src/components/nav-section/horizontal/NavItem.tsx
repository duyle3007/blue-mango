import { forwardRef } from "react";
import { Box, Tooltip, ListItemText, ListItemIcon } from "@mui/material";
import { ICON } from "../../../config";
import Iconify from "../../Iconify";
import { ListItemStyle } from "./style";

interface NavItemProps {
  active: boolean;
  open: boolean;
  depth: number;
  item: {
    children?: any[];
    icon?: any;
    info?: any;
    path: string;
    title: string;
    disabled?: boolean;
    caption?: string;
    roles?: Array<string>;
  };
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}

const NavItem = forwardRef(
  ({ item, depth, active, open, ...other }: NavItemProps, ref: any) => {
    const { title, icon, info, children, disabled, caption } = item;

    const renderContent = (
      <ListItemStyle
        ref={ref}
        open={open}
        depth={depth}
        active={active}
        disabled={disabled}
        {...other}
      >
        {icon && (
          <ListItemIcon
            sx={{
              mr: 1,
              flexShrink: 0,
              width: ICON.NAVBAR_ITEM_HORIZONTAL,
              height: ICON.NAVBAR_ITEM_HORIZONTAL,
            }}
          >
            {icon}
          </ListItemIcon>
        )}

        <ListItemText
          primary={title}
          primaryTypographyProps={{
            noWrap: true,
            variant: active ? "subtitle2" : "body2",
          }}
        />

        {caption && (
          <Tooltip title={caption} arrow>
            <Box component="span" sx={{ ml: 0.5, lineHeight: 0 }}>
              <Iconify
                icon="eva:info-outline"
                sx={{
                  width: ICON.NAVBAR_ITEM_HORIZONTAL / -4,
                  height: ICON.NAVBAR_ITEM_HORIZONTAL / -4,
                }}
              />
            </Box>
          </Tooltip>
        )}

        {info && (
          <Box component="span" sx={{ ml: 1, lineHeight: 0 }}>
            {info}
          </Box>
        )}

        {!!children && (
          <Iconify
            icon={
              depth > 1 ? "eva:chevron-right-fill" : "eva:chevron-down-fill"
            }
            sx={{
              ml: 0.5,
              flexShrink: 0,
              width: ICON.NAVBAR_ITEM_HORIZONTAL,
              height: ICON.NAVBAR_ITEM_HORIZONTAL,
            }}
          />
        )}
      </ListItemStyle>
    );

    return renderContent;
  }
);

export default NavItem;
