import { useMutation } from "@tanstack/react-query";
import { process } from "../../api/services/processedIncomesService";

export function useProcessIncomes(onSuccess?: () => void) {
  return useMutation({
    mutationFn: process,
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
  });
}