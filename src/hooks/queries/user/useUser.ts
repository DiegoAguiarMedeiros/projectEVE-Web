import { useQuery } from "@tanstack/react-query";
import { getUser } from "src/api/services/user/UserService";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => getUser().then(res => res.data),
    retry: false,
  });
}
