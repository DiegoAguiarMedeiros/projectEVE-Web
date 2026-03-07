import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { updateGoals } from "src/api/services/goals/GoalsService";

export function useUpdateGoals() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGoals,
    onSuccess: () => {
      enqueueSnackbar(t("notifications.goals.updated"), { autoHideDuration: 3000, variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}
