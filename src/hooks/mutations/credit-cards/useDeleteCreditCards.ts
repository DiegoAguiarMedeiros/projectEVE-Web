import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { deleteCreditCards } from "src/api/services/credit-cards/CreditCardsService";

export function useDeleteCreditCards() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCreditCards,
    onSuccess: () => {
      enqueueSnackbar("Cartão de crédito deletado com sucesso!", { autoHideDuration: 3000, variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
      queryClient.invalidateQueries({ queryKey: ["credit-cards"] });
    },
  });
}