import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "@mui/material";
import { PaperStyle } from "./style";
import NavItem from "./NavItem";
import { getActive, isExternalLink } from "..";

interface NavSubListProps {
  data: Array<{
    children?: any[];
    icon?: any;
    info?: any;
    path: string;
    title: string;
    disabled?: boolean;
    caption?: string;
    roles?: Array<string>;
  }>;
  depth: number;
  children?: any[];
}

function NavSubList({ data, depth }: NavSubListProps) {
  return (
    <>
      {data.map((list) => (
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        <NavList
          key={list.title + list.path}
          data={list}
          depth={depth + 1}
          hasChildren={!!list.children}
        />
      ))}
    </>
  );
}
interface NavListProps {
  data: {
    children?: any[];
    icon?: any;
    info?: any;
    path: string;
    title: string;
    disabled?: boolean;
    caption?: string;
    roles?: Array<string>;
  };
  depth: number;
  hasChildren: boolean;
}

export default function NavList({ data, depth, hasChildren }: NavListProps) {
  const menuRef = useRef(null);

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const active = getActive(data.path, pathname);

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickItem = () => {
    if (!hasChildren) {
      navigate(data.path);
    }
  };

  useEffect(() => {
    if (open) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {isExternalLink(data.path) ? (
        <Link href={data.path} target="_blank" rel="noopener" underline="none">
          <NavItem item={data} depth={depth} open={open} active={active} />
        </Link>
      ) : (
        <NavItem
          item={data}
          depth={depth}
          open={open}
          active={active}
          ref={menuRef}
          onClick={handleClickItem}
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
        />
      )}

      {hasChildren && (
        <PaperStyle
          open={open}
          anchorEl={menuRef.current}
          anchorOrigin={
            depth === 1
              ? { vertical: "bottom", horizontal: "left" }
              : { vertical: "center", horizontal: "right" }
          }
          transformOrigin={
            depth === 1
              ? { vertical: "top", horizontal: "left" }
              : { vertical: "center", horizontal: "left" }
          }
          PaperProps={{
            onMouseEnter: handleOpen,
            onMouseLeave: handleClose,
          }}
        >
          <NavSubList data={data.children ?? []} depth={depth} />
        </PaperStyle>
      )}
    </>
  );
}
