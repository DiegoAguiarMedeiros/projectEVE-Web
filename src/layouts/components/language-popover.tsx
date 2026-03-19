import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Popover,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
  IconButton,
} from "@mui/material";
import {
  SUPPORTED_LANGS,
  SupportedLang,
  getLang,
  getPath,
  getRouteKeyFromSegment,
} from "src/routes/paths";

export type LanguagePopoverProps = {
  showComponent?: boolean;
  data?: {
    value: string;
    label: string;
    icon: string;
  }[];
};

export function LanguagePopover({ showComponent = true, data = [] }: LanguagePopoverProps) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const currentLang = data.find((lang) => lang.value === i18n.language) || data[0];

  const renderFlag = (label?: string, icon?: string) => (
    <Box
      component="img"
      alt={label}
      src={icon}
      sx={{ width: 22, height: 20, borderRadius: 0.5, objectFit: "cover" }}
    />
  );

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeLang = (nextLang: string) => {
    if (!SUPPORTED_LANGS.includes(nextLang as SupportedLang)) {
      i18n.changeLanguage(nextLang);
      handleClose();
      return;
    }

    const newLang = nextLang as SupportedLang;
    const currentLangCode = getLang(i18n.language);

    // Parse current path: /:lang/:segment
    const parts = location.pathname.replace(/^\//, "").split("/");
    const segment = parts[1] ?? "";
    const routeKey = getRouteKeyFromSegment(currentLangCode, segment);

    const newPath = routeKey ? getPath(newLang, routeKey) : `/${newLang}`;

    // Preserve any query string / hash
    const search = location.search ?? "";
    const hash = location.hash ?? "";

    i18n.changeLanguage(newLang);
    navigate(`${newPath}${search}${hash}`, { replace: true });
    handleClose();
  };

  return (
    showComponent ? (
      <>
        <IconButton
          onClick={handleOpen}
          sx={{
            padding: 0,
            width: 44,
            height: 44,
            ...(anchorEl && {
              bgcolor: (theme) => theme.palette.action.selected,
            }),
          }}
        >
          {renderFlag(currentLang?.label, currentLang?.icon)}
        </IconButton>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <List sx={{ width: 160 }}>
            {data.map((option) => (
              <ListItemButton
                key={option.value}
                selected={option.value === i18n.language}
                onClick={() => handleChangeLang(option.value)}
              >
                <ListItemIcon sx={{ mr: 1, minWidth: 'unset' }}>{renderFlag(option.label, option.icon)}</ListItemIcon>
                <ListItemText primary={option.label} />
              </ListItemButton>
            ))}
          </List>
        </Popover>
      </>) : (<></>)
  );
}
