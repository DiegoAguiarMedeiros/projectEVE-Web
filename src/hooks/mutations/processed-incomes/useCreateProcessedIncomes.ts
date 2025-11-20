import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { process } from "src/api/services/processed-incomes/ProcessedIncomesService";

export function useCreateProcessedIncomes() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: process,
    onSuccess: () => {
      enqueueSnackbar("Envelopes processados com sucesso!", {
        autoHideDuration: 3000,
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
      queryClient.invalidateQueries({ queryKey: ["processed-incomes"] });
      queryClient.invalidateQueries({ queryKey: ["processed-incomes-month"] });
    },
  });
}