import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme
} from "@mui/material";
import { useMemo, useState } from "react";
import Iconify from "../../components/Iconify";
import Scrollbar from "../../components/Scrollbar";
import { NAVBAR } from "../../config";
import useResponsive from "../../hooks/useResponsive";

interface ActivitySidebarProps {
  isOpenSidebar?: boolean;
  onCloseSidebar?: () => void;
  onChange?: (label: { text: string, id: string, icon: string}) => void;
}

const LABELS = [
  {
    text: "Adverse Reactions",
    icon: "system-uicons:heart-rate",
    id: "adverse_reaction",
  },
  {
    text: "Health",
    icon: "ph:heart-straight-fill",
    id: "health"
  },
  {
    text: "Comments",
    icon: "mdi:comment-text",
    id: "comments"
  },
  {
    text: "Listening time",
    icon: "bi:music-note-list",
    id: "listening_time"
  },
  {
    text: "Time limits",
    icon: "wi:time-3",
    id: "time_limits"
  },
  {
    text: "Account Settings",
    icon: "heroicons:users-solid",
    id: "account_settings"
  }
];

export default function ActivitySidebar(props: ActivitySidebarProps) {
  const theme = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { isOpenSidebar, onCloseSidebar, onChange } = props;
  const isDesktop = useResponsive("up", "md");
  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    onChange?.(LABELS[index])
  };

  const renderContent = useMemo(() => {
    return (
      <Scrollbar
        sx={{
          height: 1,
          "& .simplebar-content": {
            height: 1,
            display: "flex",
            flexDirection: "column"
          }
        }}>
        <Box
          sx={{
            fontWeight: 700,
            fontSize: 11,
            lineHeight: "18px",
            textTransform: "uppercase",
            color: "grey.600",
            padding: "0 0 8px 16px"
          }}>
          Client details
        </Box>

        <List disablePadding>
          {LABELS.map((label, index) => (
            <ListItemButton
              key={index}
              selected={selectedIndex === index}
              onClick={(event) => handleListItemClick(event, index)}
              sx={{ minHeight: 48 }}
              >
              <ListItemIcon>
                <Iconify icon={label.icon} width={24} height={24} />
              </ListItemIcon>

              <ListItemText primary={label.text} />

              {/* <ListItemSecondaryAction>1</ListItemSecondaryAction> */}
            </ListItemButton>
          ))}
        </List>
      </Scrollbar>
    );
  }, [selectedIndex]);

  return (
    <>
      {isDesktop ? (
        <Drawer
          variant="permanent"
          PaperProps={{
            sx: { width: NAVBAR.BASE_WIDTH, position: "relative", zIndex: theme.zIndex.drawer - 1 }
          }}>
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          ModalProps={{ keepMounted: true }}
          PaperProps={{ sx: { width: NAVBAR.BASE_WIDTH } }}>
          {renderContent}
        </Drawer>
      )}
    </>
  );
}
