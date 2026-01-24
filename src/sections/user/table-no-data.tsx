import type { TableRowProps } from "@mui/material/TableRow";

import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";


// ----------------------------------------------------------------------

type TableNoDataProps = TableRowProps & {
  searchQuery: string;
};

export function TableNoData({ searchQuery, ...other }: TableNoDataProps) {
  const { t } = useTranslation();
  return (
    <TableRow {...other}>
      <TableCell align="center" colSpan={7}>
        <Box sx={{ py: 15, textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {t('user.table.no_data')}
          </Typography>

          <Typography variant="body2">
            {t('user.table.no_results')} &nbsp;
            <strong>&quot;{searchQuery}&quot;</strong>.
            <br /> {t('user.table.typo_suggestion')}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
}
