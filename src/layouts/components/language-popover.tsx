import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MenuItem,
  Popover,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
} from "@mui/material";

export type LanguagePopoverProps = {
  data?: {
    value: string;
    label: string;
    icon: string;
  }[];
};

export function LanguagePopover({ data = [] }: LanguagePopoverProps) {
  const { i18n } = useTranslation();
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
    i18n.changeLanguage(nextLang);
    handleClose();
  };

  return (
    <>
      {/* Botão no menu principal */}
      <MenuItem onClick={handleOpen} sx={{ p: 1 }}>
        {renderFlag(currentLang?.label, currentLang?.icon)}
        <span style={{ marginLeft: 8, fontWeight: 600 }}>{currentLang?.label}</span>
      </MenuItem>

      {/* Popover com lista de idiomas */}
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
    </>
  );
}
