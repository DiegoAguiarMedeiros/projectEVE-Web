import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { deleteFixedExpenses } from "src/api/services/fixed-expenses/FixedExpensesService";

export function useDeleteFixedExpenses() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFixedExpenses,
    onSuccess: () => {
      enqueueSnackbar("Contas Fixas deletada com sucesso!", { autoHideDuration: 3000, variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
      queryClient.invalidateQueries({ queryKey: ["fixed-expenses"]});
    },
  });
}