import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { deleteProcessedIncome } from "src/api/services/processed-incomes/ProcessedIncomesService";

export function useDeleteProcessedIncomes() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProcessedIncome,
    onSuccess: () => {
      enqueueSnackbar(t("notifications.processed_incomes.deleted"), {
        autoHideDuration: 3000,
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
      queryClient.invalidateQueries({ queryKey: ["processed-incomes"] });
      queryClient.invalidateQueries({ queryKey: ["processed-incomes-month"] });
      queryClient.invalidateQueries({ queryKey: ["envelopes"] });
    },
  });
}
