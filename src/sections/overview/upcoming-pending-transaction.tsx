import type { CardProps } from "@mui/material/Card";
import { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";

import dayjs from "dayjs";

import { fNumberToCurrency } from "src/utils/format-number";
import { useDateFormat } from "src/hooks/useDateFormat";

import { Transactions, PaymentMethod, allPaymentMethod } from "src/types/Transactions";
import { CreditCards } from "src/types/CreditCards";
import { useTranslation } from "react-i18next";
import { Scrollbar } from "src/components/scrollbar";
import { Envelopes } from "src/types/Envelopes";
import { Pagination } from "src/types/Pagination";
import { ITable } from "src/sections/shared/useTable";
import { Iconify } from "src/components/iconify";
import { labelDisplayedRows } from "src/components/labelDisplayedRows/LabelDisplayedRows";

// ----------------------------------------------------------------------

const PAYMENT_METHOD_ICONS: Record<PaymentMethod, string> = {
  "envelope.transaction.payment_method.CreditCard": "solar:card-bold",
  "envelope.transaction.payment_method.DebitCard": "solar:card-bold",
  "envelope.transaction.payment_method.Cash": "solar:wallet-money-bold",
  "envelope.transaction.payment_method.BankTransfer": "solar:transfer-horizontal-bold",
  "envelope.transaction.payment_method.Pix": "ic:baseline-pix",
  "envelope.transaction.payment_method.Ticket": "solar:document-bold",
  "envelope.transaction.payment_method.Reallocation": "solar:transfer-vertical-bold-duotone",
};

type Props = CardProps & {
  title?: string;
  subheader?: string;
  envelopes: Envelopes[];
  transactions: Pagination<Transactions> | undefined;
  table: ITable;
  onMarkAsPaid: (transaction: Transactions, paymentMethod: PaymentMethod, creditCardId?: string) => void;
  creditCards: CreditCards[];
};

export function UpcomingPendingTransactionsTable({ title, subheader, envelopes, transactions, table, onMarkAsPaid, creditCards, ...other }: Props) {
  const { t, i18n } = useTranslation();
  const { formatDate } = useDateFormat();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transactions | null>(null);
  const [creditCardAnchorEl, setCreditCardAnchorEl] = useState<HTMLElement | null>(null);

  const selectablePaymentMethods = allPaymentMethod.filter((m) => {
    if (m === "envelope.transaction.payment_method.Reallocation") return false;
    if (m === "envelope.transaction.payment_method.CreditCard" && creditCards.length === 0) return false;
    return true;
  });

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>, transaction: Transactions) => {
    setAnchorEl(event.currentTarget);
    setSelectedTransaction(transaction);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedTransaction(null);
    setCreditCardAnchorEl(null);
  };

  const handleSelectPaymentMethod = (paymentMethod: PaymentMethod) => {
    if (selectedTransaction) {
      onMarkAsPaid(selectedTransaction, paymentMethod);
    }
    handleClosePopover();
  };

  const handleCreditCardHover = (event: React.MouseEvent<HTMLElement>) => {
    setCreditCardAnchorEl(event.currentTarget);
  };

  const handleCreditCardClose = () => {
    setCreditCardAnchorEl(null);
  };

  const handleSelectCreditCard = (creditCard: CreditCards) => {
    if (selectedTransaction) {
      onMarkAsPaid(selectedTransaction, "envelope.transaction.payment_method.CreditCard", creditCard.id);
    }
    handleClosePopover();
  };

  if (!transactions || transactions.data.length === 0) {
    return (
      <Card sx={{ mt: 1, border: `1px solid var(--layout-nav-border-color)` }} {...other}>
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
    <Card sx={{ mt: 1, border: `1px solid var(--layout-nav-border-color)` }} {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 1 }} />

      <Scrollbar sx={{ minHeight: 200 }}>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ "& th": { backgroundColor: "var(--layout-nav-item-active-bg)" } }}>
                <TableCell>{t("transaction.headers.description")}</TableCell>
                <TableCell>{t("transaction.headers.amount")}</TableCell>
                <TableCell>{t("overview.upcoming_payments.envelope")}</TableCell>
                <TableCell>{t("transaction.headers.status")}</TableCell>
                <TableCell>{t("transaction.headers.date")}</TableCell>
                <TableCell align="right">{t("common.actions")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.data.map((row) => {
                const isOverdue = row.status === "transaction.status.pending" && !!row.date && dayjs(row.date).isBefore(dayjs(), 'day');
                const displayStatus = isOverdue ? "transaction.status.overdue" : row.status;

                return (
                  <TableRow key={row.id}>
                    <TableCell>{row.isTranslatable ? t(row.description) : row.description}</TableCell>
                    <TableCell>{fNumberToCurrency(row.amount)}</TableCell>
                    <TableCell>{t(envelopes.find(e => e.id === row.envelopeId)?.name || "overview.upcoming_payments.unknown_envelope")}</TableCell>
                    <TableCell>
                      <Chip
                        label={t(displayStatus)}
                        size="small"
                        color={
                          row.status === "transaction.status.completed" ? "success"
                            : isOverdue ? "error"
                              : "warning"
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{formatDate(row.date)}</TableCell>
                    <TableCell align="right">
                      {row.status !== "transaction.status.completed" && (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={(e) => handleOpenPopover(e, row)}
                        >
                          {t("common.pay")}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        labelRowsPerPage={t("pagination.rows_per_page")}
                        labelDisplayedRows={labelDisplayedRows}
        component="div"
        page={table.page}
        count={transactions.totalItems}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}` }}
      />

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { bgcolor: "background.neutral" } } }}
      >
        <MenuList sx={{ p: 0.5 }}>
          {selectablePaymentMethods.map((method) => {
            if (method === "envelope.transaction.payment_method.CreditCard") {
              return (
                <MenuItem
                  key={method}
                  onMouseEnter={handleCreditCardHover}
                  onMouseLeave={handleCreditCardClose}
                  sx={{ position: "relative" }}
                >
                  <ListItemIcon>
                    <Iconify icon={PAYMENT_METHOD_ICONS[method]} />
                  </ListItemIcon>
                  <ListItemText>{t(method)}</ListItemText>
                  <Iconify icon="eva:chevron-right-fill" width={16} sx={{ ml: 1 }} />

                  <Popover
                    open={Boolean(creditCardAnchorEl)}
                    anchorEl={creditCardAnchorEl}
                    onClose={handleCreditCardClose}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    sx={{ pointerEvents: "none" }}
                    slotProps={{ paper: { sx: { pointerEvents: "auto", bgcolor: "background.neutral" }, onMouseLeave: handleCreditCardClose } }}
                  >
                    <MenuList sx={{ p: 0.5 }}>
                      {creditCards.map((card) => (
                        <MenuItem key={card.id} onClick={() => handleSelectCreditCard(card)}>
                          <ListItemText>{card.name}</ListItemText>
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Popover>
                </MenuItem>
              );
            }

            return (
              <MenuItem key={method} onClick={() => handleSelectPaymentMethod(method)}>
                <ListItemIcon>
                  <Iconify icon={PAYMENT_METHOD_ICONS[method]} />
                </ListItemIcon>
                <ListItemText>{t(method)}</ListItemText>
              </MenuItem>
            );
          })}
        </MenuList>
      </Popover>
    </Card>
  );
}
