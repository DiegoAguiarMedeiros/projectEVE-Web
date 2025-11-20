import React, { useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";

interface IconPickerProps {
  iconsMap: Record<string, React.ElementType | undefined>;
  label?: string;
  value?: string; // chave selecionada
  onSelect: (iconKey: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  iconsMap,
  label = "Selecionar Ícone",
  value,
  onSelect,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleSelect = (iconKey: string) => {
    onSelect(iconKey);
    handleClose();
  };

  const SelectedIcon = value ? iconsMap[value] : undefined;

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        startIcon={SelectedIcon ? <SelectedIcon /> : undefined}
      >
        {value || label}
      </Button>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <Box
          display="grid"
          gridTemplateColumns="repeat(4, 1fr)"
          gap={1}
          p={2}
          sx={{
            backgroundColor: theme.palette.background.neutral,
            borderRadius: "8px",
            minWidth: 300,
          }}
        >
          {Object.entries(iconsMap).map(([key, Icon]) => (
            <MenuItem
              key={key}
              onClick={() => handleSelect(key)}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 0.75,
              }}
            >
              {Icon && <Icon />}
              <Typography
                variant="caption"
                sx={{ mt: 0.5, textAlign: "center" }}
              >
                {key}
              </Typography>
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </Box>
  );
};
