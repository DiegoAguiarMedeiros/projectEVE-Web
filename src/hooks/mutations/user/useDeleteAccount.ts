
import { useMutation } from "@tanstack/react-query";
import { deleteAccount } from "src/api/services/user/UserService";

export function useDeleteAccount(onSuccess?: () => void) {
    return useMutation({
        mutationFn: deleteAccount,
        onSuccess: () => {
            if (onSuccess) onSuccess();
        },
    });
}
