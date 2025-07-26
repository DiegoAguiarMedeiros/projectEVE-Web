import { useMutation } from "@tanstack/react-query";
import { register } from "../../api/services/authService";

export function useRegister(onSuccess?: () => void) {
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
  });
}