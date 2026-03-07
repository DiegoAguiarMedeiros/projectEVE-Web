import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { updateProcessedIncomes } from "src/api/services/processed-incomes/ProcessedIncomesService";

export function useUpdateProcessedIncomes() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProcessedIncomes,
    onSuccess: () => {
      enqueueSnackbar(t("notifications.processed_incomes.updated"), { autoHideDuration: 3000, variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
      queryClient.invalidateQueries({ queryKey: ["processed-incomes"] });
    },
  });
}
