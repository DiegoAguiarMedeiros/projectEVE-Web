import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { updateDebts } from "src/api/services/debts/DebtsService";

export function useUpdateDebts() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDebts,
    onSuccess: () => {
      enqueueSnackbar(t("notifications.debts.updated"), { autoHideDuration: 3000, variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      queryClient.invalidateQueries({ queryKey: ["envelopes"] });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["envelopes"] });
      }, 1000);
    },
  });
}
