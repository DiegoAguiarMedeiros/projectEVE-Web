import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { updateProcessedIncomes } from "src/api/services/processed-incomes/ProcessedIncomesService";

export function useUpdateProcessedIncomes() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProcessedIncomes,
    onSuccess: () => {
      enqueueSnackbar("Renda editada com sucesso!", { autoHideDuration: 3000, variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
      queryClient.invalidateQueries({ queryKey: ["processed-incomes"] });
    },
  });
}