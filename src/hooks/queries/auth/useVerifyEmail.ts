import { useQuery } from "@tanstack/react-query";
import { verifyEmail } from "src/api/services/auth/AuthService";

export function useVerifyEmail(token: string | null) {
  return useQuery({
    queryKey: ["verify-email", token],
    queryFn: () => verifyEmail(token!),
    enabled: !!token,
    retry: false,
  });
}
