import React, { useState, useCallback } from "react";

import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import MenuList from "@mui/material/MenuList";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import MenuItem, { menuItemClasses } from "@mui/material/MenuItem";
import { Iconify } from "src/components/iconify";
import { useTranslation } from "react-i18next";
// ----------------------------------------------------------------------

interface FormExternalControlProps {
  externalOpen?: boolean;
  onExternalClose?: () => void;
}

type IncomesTableRowProps = {
  selected: boolean;
  onSelectRow: () => void;
  form: React.ReactElement<FormExternalControlProps>;
  handleDelete: VoidFunction;
  rowKeys: string[] | React.ReactNode[];
  extraMenuItems?: (closePopover: () => void) => React.ReactNode;
  extraActions?: React.ReactNode;
};

export function CustomTableRow({ selected, onSelectRow, form, handleDelete, rowKeys, extraMenuItems, extraActions }: IncomesTableRowProps) {
  const { t } = useTranslation();

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleOpenForm = useCallback(() => {
    handleClosePopover();
    setFormOpen(true);
  }, [handleClosePopover]);

  const handleCloseForm = useCallback(() => {
    setFormOpen(false);
  }, []);

  const controlledForm = React.cloneElement(form, {
    externalOpen: formOpen,
    onExternalClose: handleCloseForm,
  });

  return (
    <>
      {controlledForm}

      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        {rowKeys.map((key,index) => (<TableCell key={index}>{key}</TableCell>))}


        <TableCell align="right">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            {extraActions}
            <IconButton onClick={handleOpenPopover}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { bgcolor: "background.neutral" } } }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: "flex",
            flexDirection: "column",
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: "action.selected" },
            },
          }}
        >
          {extraMenuItems?.(handleClosePopover)}

          <MenuItem onClick={handleOpenForm}>
            <Iconify icon="solar:pen-bold" />
            {t('common.edit')}
          </MenuItem>

          <MenuItem onClick={() => { handleClosePopover(); handleDelete(); }} sx={{ color: "error.main" }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            {t('common.delete')}
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
