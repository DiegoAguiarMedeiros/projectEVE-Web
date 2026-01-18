
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "src/api/services/user/UserService";

export function useChangePassword(onSuccess?: () => void) {
    return useMutation({
        mutationFn: changePassword,
        onSuccess: () => {
            if (onSuccess) onSuccess();
        },
    });
}
