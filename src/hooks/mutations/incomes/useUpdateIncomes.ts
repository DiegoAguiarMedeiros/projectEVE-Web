import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { updateIncomes } from "src/api/services/incomes/IncomesService";

export function useUpdateIncomes() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateIncomes,
    onSuccess: () => {
      enqueueSnackbar(t("notifications.incomes.updated"), {
        autoHideDuration: 3000,
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      queryClient.invalidateQueries({ queryKey: ["incomes-total"] });
      queryClient.invalidateQueries({ queryKey: ["envelopes"] });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["envelopes"] });
      }, 1000);
    },
  });
}
