import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { deleteAllIncomes } from "src/api/services/incomes/IncomesService";

export function useDeleteAllIncomes() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAllIncomes,
    onSuccess: () => {
      enqueueSnackbar(t("notifications.incomes.deleted_all"), { autoHideDuration: 3000, variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      queryClient.invalidateQueries({ queryKey: ["incomes-total"] });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["envelopes"] });
      }, 1000);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message ?? t("notifications.incomes.error_delete_all");
      enqueueSnackbar(message, { autoHideDuration: 4000, variant: "error", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
    },
  });
}
