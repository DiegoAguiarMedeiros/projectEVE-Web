import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { deleteAllGoals } from "src/api/services/goals/GoalsService";

export function useDeleteAllGoals() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAllGoals,
    onSuccess: () => {
      enqueueSnackbar(t("notifications.goals.deleted_all"), { autoHideDuration: 3000, variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message ?? t("notifications.goals.error_delete_all");
      enqueueSnackbar(message, { autoHideDuration: 4000, variant: "error", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
    },
  });
}
