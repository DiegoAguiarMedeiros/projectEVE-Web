import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { deleteAllFixedExpenses } from "src/api/services/fixed-expenses/FixedExpensesService";

export function useDeleteAllFixedExpenses() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAllFixedExpenses,
    onSuccess: () => {
      enqueueSnackbar(t("notifications.fixed_expenses.deleted_all"), { autoHideDuration: 3000, variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
      queryClient.invalidateQueries({ queryKey: ["fixed-expenses"] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message ?? t("notifications.fixed_expenses.error_delete_all");
      enqueueSnackbar(message, { autoHideDuration: 4000, variant: "error", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
    },
  });
}
