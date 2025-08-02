import { useMutation } from "@tanstack/react-query";
import { login } from "src/api/services/auth/AuthService";

export function useLogin(onSuccess?: () => void) {
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
  });
}