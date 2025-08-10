import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { updateCreditCards } from "src/api/services/credit-cards/CreditCardsService";

export function useUpdateCreditCards() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCreditCards,
    onSuccess: () => {
      enqueueSnackbar("Cartão de crédito editado com sucesso!", { autoHideDuration: 3000, variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
      queryClient.invalidateQueries({ queryKey: ["credit-cards"] });
    },
  });
}