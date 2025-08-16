import { useState } from "react";
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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [locale, setLocale] = useState<string>(data[0]?.value || "");

  const currentLang = data.find((lang) => lang.value === locale);

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
    setLocale(nextLang);
    handleClose();
    // Aqui entraria sua lógica para trocar idioma no app
  };

  return (
    <>
      {/* Botão no menu principal */}
      <MenuItem onClick={handleOpen}>
        {renderFlag(currentLang?.label, currentLang?.icon)}
        {currentLang?.label}
      </MenuItem>

      {/* Popover com lista de idiomas */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <List>
          {data.map((option) => (
            <ListItemButton
              key={option.value}
              selected={option.value === locale}
              onClick={() => handleChangeLang(option.value)}
            >
              <ListItemIcon>{renderFlag(option.label, option.icon)}</ListItemIcon>
              <ListItemText primary={option.label} />
            </ListItemButton>
          ))}
        </List>
      </Popover>
    </>
  );
}
