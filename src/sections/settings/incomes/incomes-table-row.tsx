import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { useMutation, useQueryClient } from '@tanstack/react-query';


import IncomeService from 'src/services/incomeService';
// ----------------------------------------------------------------------

export type IncomeProps = {
  id: string;
  description: string;
  amount: string;
  paymentDay: string;
};

type IncomesTableRowProps = {
  row: IncomeProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function IncomesTableRow({ row, selected, onSelectRow }: IncomesTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const deleteIncomeMutation = useMutation({
    mutationFn: (id:string) => IncomeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] }); // Atualiza a lista após deletar
    },
  });
  const handleDeleteIncome = useCallback(() => {
    deleteIncomeMutation.mutate(row.id)
    handleClosePopover()
  }, [deleteIncomeMutation,handleClosePopover,row]);
  
  const queryClient = useQueryClient();


  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {row.description}
          </Box>
        </TableCell>

        <TableCell>R$ {row.amount}</TableCell>

        <TableCell>{row.paymentDay}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleClosePopover}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleDeleteIncome} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
