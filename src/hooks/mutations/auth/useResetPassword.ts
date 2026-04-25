import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "src/api/services/auth/AuthService";

export function useResetPassword(onSuccess?: () => void) {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
  });
}
