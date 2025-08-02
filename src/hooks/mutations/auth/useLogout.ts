import { useMutation } from "@tanstack/react-query";
import { logout }from "src/api/services/auth/AuthService";

export function useLogout(onSuccess?: () => void) {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
  });
}