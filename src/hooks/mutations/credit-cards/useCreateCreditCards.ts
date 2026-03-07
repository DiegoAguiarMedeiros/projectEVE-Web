import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { createCreditCards } from "src/api/services/credit-cards/CreditCardsService";

export function useCreateCreditCards() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCreditCards,
    onSuccess: () => {
      enqueueSnackbar(t("notifications.credit_cards.created"), { autoHideDuration: 3000, variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
      queryClient.invalidateQueries({ queryKey: ["credit-cards"] });
    },
  });
}
