import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { deleteIncomes } from "src/api/services/incomes/IncomesService";

export function useDeleteIncomes() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteIncomes,
    onSuccess: () => {
      enqueueSnackbar(t("notifications.incomes.deleted"), { autoHideDuration: 3000, variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      queryClient.invalidateQueries({ queryKey: ["incomes-total"] });
      queryClient.invalidateQueries({ queryKey: ["envelopes"] });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["envelopes"] });
      }, 1000);
    },
  });
}
