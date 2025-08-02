import { useMutation } from "@tanstack/react-query";
import { createIncome } from "src/api/services/incomes/IncomesService";

export function useCreateIncomes(onSuccess?: () => void) {
  return useMutation({
    mutationFn: createIncome,
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
  });
}