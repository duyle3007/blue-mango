/* eslint-disable @typescript-eslint/no-use-before-define */
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { List, Collapse, Link } from "@mui/material";
import NavItem from "./NavItem";
import { getActive, isExternalLink } from "..";

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
  isCollapse?: boolean;
  actionName?: string;
  onClick?: (payload: { action: string, params?: any}) => void;
}

export default function NavList({
  data,
  depth,
  hasChildren,
  isCollapse = false,
  actionName = '',
  onClick,
}: NavListProps) {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const active = getActive(data.path, pathname);

  const [open, setOpen] = useState(active);

  const handleClickItem = () => {
    if (actionName) {
      onClick?.({ action: actionName})
      return
    }
    if (!hasChildren) {
      navigate(data.path);
    }
    setOpen(!open);
  };

  return (
    <>
      {isExternalLink(data.path) ? (
        <Link href={data.path} target="_blank" rel="noopener" underline="none">
          <NavItem
            item={data}
            depth={depth}
            open={open}
            active={active}
            isCollapse={isCollapse}
          />
        </Link>
      ) : (
        <NavItem
          item={data}
          depth={depth}
          open={open}
          active={active}
          isCollapse={isCollapse}
          onClick={handleClickItem}
        />
      )}

      {!isCollapse && hasChildren && (
        <Collapse in={open} unmountOnExit>
          <List component="div" disablePadding>
            <NavSubList data={data.children ?? []} depth={depth} />
          </List>
        </Collapse>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

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
