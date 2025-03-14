import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type TableToolbarProps = {
  numSelected: number;
  form: React.ReactElement;
};



export function TableToolbar({ numSelected,form }: TableToolbarProps) {


  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: numSelected > 0 ? 'space-between' : 'flex-end',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} Selecionados
        </Typography>
      ) : (
        <></>
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
