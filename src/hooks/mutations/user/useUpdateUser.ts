import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "src/api/services/user/UserService";


export function useUpdateUser(onSuccess?: () => void) {
  const queryClient = useQueryClient();


  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      // Ideally checking if we can refresh auth context user
      if (onSuccess) onSuccess();
    },
  });
}