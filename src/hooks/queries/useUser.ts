import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../api/services/userService";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => getUser().then(res => res.data),
  });
}
