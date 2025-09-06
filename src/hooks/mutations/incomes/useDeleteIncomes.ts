import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { deleteIncomes } from "src/api/services/incomes/IncomesService";

export function useDeleteIncomes() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteIncomes,
    onSuccess: () => {
      enqueueSnackbar("Salário deletado com sucesso!", { autoHideDuration: 3000, variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
            queryClient.invalidateQueries({ queryKey: ["incomes"]});
      queryClient.invalidateQueries({ queryKey: ["incomes-total"]});
      queryClient.invalidateQueries({ queryKey: ["envelopes"] });
    },
  });
}