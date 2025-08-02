import { useMutation } from "@tanstack/react-query";
import { process } from "src/api/services/processed-incomes/ProcessedIncomesService";

export function useProcessIncomes(onSuccess?: () => void) {
  return useMutation({
    mutationFn: process,
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
  });
}