import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';
import { FormIncome } from './form';

// ----------------------------------------------------------------------

type IncomesTableToolbarProps = {
  numSelected: number;
};



export function IncomesTableToolbar({ numSelected }: IncomesTableToolbarProps) {


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
          {numSelected} selected
        </Typography>
      ) : (
        <></>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>
      ) : (
        <FormIncome buttonLabel='Adicionar' />
      )}
    </Toolbar>
  );
}
