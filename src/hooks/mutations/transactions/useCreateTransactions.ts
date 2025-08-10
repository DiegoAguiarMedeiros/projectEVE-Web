import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { createTransactions } from "src/api/services/transactions/TransactionsService";

export function useCreateTransactions() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTransactions,
    onSuccess: () => {
      enqueueSnackbar("Transação cadastrada com sucesso!", { autoHideDuration: 3000, variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["envelopes"] });
    },
  });
}