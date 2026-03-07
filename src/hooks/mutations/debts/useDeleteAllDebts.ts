import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { deleteAllDebts } from "src/api/services/debts/DebtsService";

export function useDeleteAllDebts() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAllDebts,
    onSuccess: () => {
      enqueueSnackbar(t("notifications.debts.deleted_all"), { autoHideDuration: 3000, variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      queryClient.invalidateQueries({ queryKey: ["envelopes"] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message ?? t("notifications.debts.error_delete_all");
      enqueueSnackbar(message, { autoHideDuration: 4000, variant: "error", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
    },
  });
}
