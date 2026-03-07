import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { createFixedExpenses } from "src/api/services/fixed-expenses/FixedExpensesService";

export function useCreateFixedExpenses() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFixedExpenses,
    onSuccess: () => {
      enqueueSnackbar(t("notifications.fixed_expenses.created"), {
        autoHideDuration: 3000,
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
      queryClient.invalidateQueries({ queryKey: ["fixed-expenses"] });
    },
  });
}
