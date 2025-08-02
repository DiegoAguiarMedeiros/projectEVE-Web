import { useMutation } from "@tanstack/react-query";
import { deleteIncome } from "src/api/services/incomes/IncomesService";

export function useDeleteIncome(onSuccess?: () => void) {
  return useMutation({
    mutationFn: deleteIncome,
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
  });
}