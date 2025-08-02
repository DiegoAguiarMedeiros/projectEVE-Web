import { useMutation } from "@tanstack/react-query";
import { updateIncome } from "src/api/services/incomes/IncomesService";

export function useUpdateIncomes(onSuccess?: () => void) {
  return useMutation({
    mutationFn: updateIncome,
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
  });
}