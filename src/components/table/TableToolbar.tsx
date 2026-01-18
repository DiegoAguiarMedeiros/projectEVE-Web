import Tooltip from "@mui/material/Tooltip";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { ToggleButtonGroup, ToggleButton, Box } from "@mui/material";

import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------

type TableToolbarProps = {
  numSelected: number;
  form: React.ReactElement;
  typeFilter?: string;
  onTypeFilterChange?: (type: string) => void;
};


export function TableToolbar({ numSelected, form, typeFilter, onTypeFilterChange }: TableToolbarProps) {


  return (
    <Toolbar
      sx={{
        height: 96,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: "primary.main",
          bgcolor: "primary.lighter",
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} Selecionados
        </Typography>
      ) : (
        <Box>
          {typeFilter !== undefined && onTypeFilterChange && (
            <ToggleButtonGroup
              value={typeFilter}
              exclusive
              onChange={(e, newValue) => {
                if (newValue !== null) {
                  onTypeFilterChange(newValue);
                }
              }}
              size="small"
              aria-label="tipo de transação"
            >
              <ToggleButton value="both" aria-label="todos">
                Todos
              </ToggleButton>
              <ToggleButton value="Debit" aria-label="débito">
                Débito
              </ToggleButton>
              <ToggleButton value="Credit" aria-label="crédito">
                Crédito
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        </Box>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Deletar">
          <IconButton>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>
      ) : (
        form
      )}
    </Toolbar>
  );
}
