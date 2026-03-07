import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { createTransactions } from "src/api/services/transactions/TransactionsService";

export function useCreateTransactions() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTransactions,
    onSuccess: () => {
      enqueueSnackbar(t("notifications.transactions.created"), { autoHideDuration: 3000, variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["envelopes"] });
    },
    onError: (error: any) => {
      const key = error?.response?.data?.message ?? "notifications.transactions.error_exceeds_budget";
      enqueueSnackbar(t(key), { autoHideDuration: 4000, variant: "error", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
    },
  });
}
