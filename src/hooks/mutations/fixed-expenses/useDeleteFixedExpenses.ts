import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { deleteFixedExpenses } from "src/api/services/fixed-expenses/FixedExpensesService";

export function useDeleteFixedExpenses() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFixedExpenses,
    onSuccess: () => {
      enqueueSnackbar(t("notifications.fixed_expenses.deleted"), { autoHideDuration: 3000, variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
      queryClient.invalidateQueries({ queryKey: ["fixed-expenses"] });
    },
  });
}
