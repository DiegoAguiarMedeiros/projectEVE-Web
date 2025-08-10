import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { createCreditCards } from "src/api/services/credit-cards/CreditCardsService";

export function useCreateCreditCards() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCreditCards,
    onSuccess: () => {
      enqueueSnackbar("Cartão de crédito cadastrado com sucesso!", { autoHideDuration: 3000, variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
      queryClient.invalidateQueries({ queryKey: ["credit-cards"] });
    },
  });
}