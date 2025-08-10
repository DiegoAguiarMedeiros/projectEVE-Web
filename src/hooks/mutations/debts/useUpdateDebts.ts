import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { updateDebts } from "src/api/services/debts/DebtsService";

export function useUpdateDebts() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDebts,
    onSuccess: () => {
      enqueueSnackbar("Dívida editada com sucesso!", { autoHideDuration: 3000, variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      queryClient.invalidateQueries({ queryKey: ["envelopes"] });
    },
  });
}