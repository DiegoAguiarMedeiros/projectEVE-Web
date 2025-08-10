import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { createFixedExpenses } from "src/api/services/fixed-expenses/FixedExpensesService";

export function useCreateFixedExpenses() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFixedExpenses,
    onSuccess: () => {
      enqueueSnackbar("Contas Fixas cadastrada com sucesso!", {
        autoHideDuration: 3000,
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
      queryClient.invalidateQueries({ queryKey: ["fixed-expenses"] });
    },
  });
}