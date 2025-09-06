import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { updateIncomes } from "src/api/services/incomes/IncomesService";

export function useUpdateIncomes() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateIncomes,
    onSuccess: () => {
      enqueueSnackbar("Salário editado com sucesso!", {
        autoHideDuration: 3000,
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
            queryClient.invalidateQueries({ queryKey: ["incomes"]});
      queryClient.invalidateQueries({ queryKey: ["incomes-total"]});
      queryClient.invalidateQueries({ queryKey: ["envelopes"] });
    },
  });
}