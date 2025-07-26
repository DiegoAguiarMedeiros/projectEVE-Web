import { useMutation } from "@tanstack/react-query";
import { logout } from "../../api/services/authService";

export function useLogout(onSuccess?: () => void) {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
  });
}