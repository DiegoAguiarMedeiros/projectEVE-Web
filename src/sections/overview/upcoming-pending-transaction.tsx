import type { CardProps } from "@mui/material/Card";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

import { fDate } from "src/utils/format-time";
import { fNumberToCurrency } from "src/utils/format-number";

import { Transactions } from "src/types/Transactions";
import { useTranslation } from "react-i18next";
import { Scrollbar } from "src/components/scrollbar";
import { Envelopes } from "src/types/Envelopes";
import { Pagination } from "src/types/Pagination";
import { ITable } from "src/sections/shared/useTable";

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  envelopes: Envelopes[]
  transactions: Pagination<Transactions> | undefined
  table: ITable
};

export function UpcomingPendingTransactionsTable({ title, subheader, envelopes, transactions, table, ...other }: Props) {
  const { t } = useTranslation();

  if (!transactions || transactions.data.length === 0) {
    return (
      <Card {...other}>
        <CardHeader title={title} subheader={subheader} />
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            {t("overview.upcoming_payments.empty")}
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card sx={{ mt: 1 }} {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 1 }} />

      <Scrollbar sx={{ minHeight: 200 }}>
        <TableContainer sx={{ minWidth: 720, px: 2, pb: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t("transaction.headers.description")}</TableCell>
                <TableCell>{t("transaction.headers.amount")}</TableCell>
                <TableCell>{t("transaction.headers.date")}</TableCell>
                <TableCell>{t("overview.upcoming_payments.envelope")}</TableCell>
                <TableCell>{t("transaction.headers.status")}</TableCell>
                <TableCell>{t("transaction.headers.payment_method")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.isTranslatable ? t(row.description) : row.description}</TableCell>
                  <TableCell>{fNumberToCurrency(row.amount)}</TableCell>
                  <TableCell>{fDate(row.date)}</TableCell>
                  <TableCell>{t(envelopes.find(e => e.id === row.envelopeId)?.name || "overview.upcoming_payments.unknown_envelope")}</TableCell>
                  <TableCell>
                    <Chip
                      label={t(row.status)}
                      size="small"
                      color={row.status === "transaction.status.overdue" ? "error" : "warning"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{t(row.paymentMethod)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        component="div"
        page={table.page}
        count={transactions.totalItems}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Card>
  );
}
