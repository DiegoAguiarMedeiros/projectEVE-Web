import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { deleteAllTransactionsByEnvelope } from "src/api/services/transactions/TransactionsService";

export function useDeleteAllTransactions() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAllTransactionsByEnvelope,
    onSuccess: () => {
      enqueueSnackbar(t("notifications.transactions.deleted"), { autoHideDuration: 3000, variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["envelopes"] });
    },
  });
}
