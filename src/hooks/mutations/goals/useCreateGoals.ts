import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { createGoals } from "src/api/services/goals/GoalsService";

export function useCreateGoals() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGoals,
    onSuccess: () => {
      enqueueSnackbar("Meta cadastrada com sucesso!", { autoHideDuration: 3000, variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}