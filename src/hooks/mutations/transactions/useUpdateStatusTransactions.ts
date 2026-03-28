import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { updateStatusTransactions } from "src/api/services/transactions/TransactionsService";

export function useUpdateStatusTransactions() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateStatusTransactions,
    onSuccess: () => {
      enqueueSnackbar(t("notifications.transactions.updated"), { autoHideDuration: 3000, variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["envelopes"] });
      queryClient.invalidateQueries({ queryKey: ["envelopes", "with-amount"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-pending"] });
      queryClient.invalidateQueries({ queryKey: ["debts"] });
    },
  });
}
