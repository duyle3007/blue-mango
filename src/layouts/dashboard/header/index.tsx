import { styled } from "@mui/material/styles";
import { Box, AppBar, Toolbar } from "@mui/material";
import useOffSetTop from "../../../hooks/useOffSetTop";
import useResponsive from "../../../hooks/useResponsive";
import cssStyles from "../../../utils/cssStyles";
import { HEADER } from "../../../config";
import Logo from "../../../components/Logo";
import Iconify from "../../../components/Iconify";
import { IconButtonAnimate } from "../../../components/animate";

// ----------------------------------------------------------------------

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "isCollapse" && prop !== "isOffset"
})<{
  isOffset: boolean;
}>(({ isOffset, theme }) => ({
  ...cssStyles(theme).bgBlur(),
  postion: 'fixed',
  boxShadow: "none",
  height: HEADER.MOBILE_HEIGHT,
  backgroundColor: theme.palette.grey["800"],
  zIndex: theme.zIndex.drawer,
  transition: theme.transitions.create(["width", "height"], {
    duration: theme.transitions.duration.shorter
  }),
  width: "100%",
  [theme.breakpoints.up("lg")]: {
    zIndex: theme.zIndex.drawer + 1,
    height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
    ...(isOffset && {
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT
    })
  }
}));

interface DashboardHeaderProps {
  onOpenSidebar: () => void;
  isCollapse?: boolean;
}

export default function DashboardHeader({ onOpenSidebar }: DashboardHeaderProps) {
  const isOffset = useOffSetTop(HEADER.DASHBOARD_DESKTOP_HEIGHT);
  const isDesktop = useResponsive("up", "lg");

  return (
    <RootStyle isOffset={isOffset}>
      <Toolbar
        sx={{
          minHeight: "100% !important",
          px: { lg: 5 }
        }}>
        {isDesktop && <Logo sx={{ mr: 2.5 }} />}

        {!isDesktop && (
          <>
            <IconButtonAnimate onClick={onOpenSidebar} sx={{ mr: 1, color: "common.white" }}>
              <Iconify icon="eva:menu-2-fill" />
            </IconButtonAnimate>
            <Logo />
          </>
        )}
      </Toolbar>
    </RootStyle>
  );
}
