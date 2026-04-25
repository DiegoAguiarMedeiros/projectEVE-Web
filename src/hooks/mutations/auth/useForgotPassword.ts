import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "src/api/services/auth/AuthService";

export function useForgotPassword(onSuccess?: () => void) {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
  });
}
