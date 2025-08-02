import { useMutation } from "@tanstack/react-query";
import { register } from "src/api/services/auth/AuthService";

export function useRegister(onSuccess?: () => void) {
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
  });
}