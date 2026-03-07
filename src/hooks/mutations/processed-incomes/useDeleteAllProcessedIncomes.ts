import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { deleteAllProcessedIncomes } from "src/api/services/processed-incomes/ProcessedIncomesService";

export function useDeleteAllProcessedIncomes() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAllProcessedIncomes,
    onSuccess: () => {
      enqueueSnackbar(t("notifications.processed_incomes.deleted_all"), {
        autoHideDuration: 3000,
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
      queryClient.invalidateQueries({ queryKey: ["processed-incomes"] });
      queryClient.invalidateQueries({ queryKey: ["processed-incomes-month"] });
      queryClient.invalidateQueries({ queryKey: ["envelopes"] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message ?? t("notifications.processed_incomes.error_delete_all");
      enqueueSnackbar(message, { autoHideDuration: 4000, variant: "error", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
    },
  });
}
