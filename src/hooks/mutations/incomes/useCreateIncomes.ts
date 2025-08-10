import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { createIncomes } from "src/api/services/incomes/IncomesService";

export function useCreateIncomes() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createIncomes,
    onSuccess: () => {
      enqueueSnackbar("Salário cadastrado com sucesso!", {
        autoHideDuration: 3000,
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
      queryClient.invalidateQueries({ queryKey: ["incomes"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["envelopes"] });
    },
  });
}