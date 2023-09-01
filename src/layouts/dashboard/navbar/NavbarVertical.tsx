import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import { Box, Drawer } from "@mui/material";
import useResponsive from "../../../hooks/useResponsive";
import useCollapseDrawer from "../../../hooks/useCollapseDrawer";
import cssStyles from "../../../utils/cssStyles";
import { HEADER, NAVBAR } from "../../../config";
import Scrollbar from "../../../components/Scrollbar";
import { NavSectionVertical } from "../../../components/nav-section";
import navConfig from "./NavConfig";
import CollapseButton from "./CollapseButton";
import { useAuth0 } from "@auth0/auth0-react";

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    transition: theme.transitions.create("width", {
      duration: theme.transitions.duration.shorter
    })
  }
}));

interface NavbarVerticalProps {
  isOpenSidebar: boolean;
  onCloseSidebar: () => void;
}

export default function NavbarVertical({ isOpenSidebar, onCloseSidebar }: NavbarVerticalProps) {
  const {
    logout
  } = useAuth0();

  const theme = useTheme();

  const { pathname } = useLocation();

  const isDesktop = useResponsive("up", "lg");

  const { isCollapse, collapseClick, collapseHover, onToggleCollapse, onHoverEnter, onHoverLeave } =
    useCollapseDrawer();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const changeHandler = (payload: {action: string, params?: any}) => {
    if (payload.action === 'signOut') {
      logout()
    }
  }

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column"
        }
      }}>
      {isDesktop && (
        <Box
          sx={{
            position: "absolute",
            top: HEADER.DASHBOARD_DESKTOP_HEIGHT,
            right: 0,
            zIndex: 2
          }}>
          <CollapseButton onToggleCollapse={onToggleCollapse} collapseClick={collapseClick} />
        </Box>
      )}

      <Box
        sx={{
          paddingTop: isDesktop ? HEADER.DASHBOARD_DESKTOP_HEIGHT + "px" : 0
        }}>
        <NavSectionVertical navConfig={navConfig} isCollapse={isCollapse} onChange={changeHandler}/>
      </Box>
    </Scrollbar>
  );

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? NAVBAR.DASHBOARD_COLLAPSE_WIDTH : NAVBAR.DASHBOARD_WIDTH
        },
        ...(collapseClick && {
          position: "absolute"
        })
      }}>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{ sx: { width: NAVBAR.DASHBOARD_WIDTH } }}>
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          PaperProps={{
            sx: {
              width: NAVBAR.DASHBOARD_WIDTH,
              borderRightStyle: "dashed",
              bgcolor: "background.default",
              transition: (theme) =>
                theme.transitions.create("width", {
                  duration: theme.transitions.duration.standard
                }),
              ...(isCollapse && {
                width: NAVBAR.DASHBOARD_COLLAPSE_WIDTH
              }),
              ...(collapseHover && {
                ...cssStyles(theme).bgBlur(),
                boxShadow: (theme) => theme.customShadows.z24
              })
            }
          }}>
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
