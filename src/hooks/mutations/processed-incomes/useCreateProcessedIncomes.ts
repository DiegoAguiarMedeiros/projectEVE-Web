import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { process } from "src/api/services/processed-incomes/ProcessedIncomesService";

export function useCreateProcessedIncomes() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: process,
    onSuccess: () => {
      enqueueSnackbar(t("notifications.processed_incomes.created"), {
        autoHideDuration: 3000,
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
      queryClient.invalidateQueries({ queryKey: ["processed-incomes"] });
      queryClient.invalidateQueries({ queryKey: ["processed-incomes-month"] });
    },
    onError: (error: any) => {
      const key = error?.response?.data?.message ?? "errors.unexpected";
      enqueueSnackbar(t(key), {
        autoHideDuration: 4000,
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    },
  });
}
