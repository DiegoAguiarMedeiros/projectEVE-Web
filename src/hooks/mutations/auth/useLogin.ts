import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "src/api/services/auth/AuthService";

export function useLogin(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ["user"] });
      if (onSuccess) onSuccess();
    },
  });
}