import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { updateFixedExpenses } from "src/api/services/fixed-expenses/FixedExpensesService";

export function useUpdateFixedExpenses() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFixedExpenses,
    onSuccess: () => {
      enqueueSnackbar("Contas Fixas editada com sucesso!", {
        autoHideDuration: 3000,
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
      queryClient.invalidateQueries({ queryKey: ["fixed-expenses"] });
    },
  });
}