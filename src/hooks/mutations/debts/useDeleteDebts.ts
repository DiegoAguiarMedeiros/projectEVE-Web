import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { deleteDebts } from "src/api/services/debts/DebtsService";

export function useDeleteDebts() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDebts,
    onSuccess: () => {
      enqueueSnackbar(t("notifications.debts.deleted"), { autoHideDuration: 3000, variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      queryClient.invalidateQueries({ queryKey: ["envelopes"] });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["envelopes"] });
      }, 1000);
    },
  });
}
