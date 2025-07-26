import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/services/authService";

export function useLogin(onSuccess?: () => void) {
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
  });
}