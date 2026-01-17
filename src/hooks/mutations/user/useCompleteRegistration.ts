import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeRegistration } from "src/api/services/user/UserService";
import { useSnackbar } from "notistack";

export function useCompleteRegistration(onSuccess?: () => void) {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: () => {
            console.log("useCompleteRegistration mutationFn called");
            return completeRegistration().then((res) => {
                console.log("completeRegistration response", res);
                return res.data;
            });
        },
        onSuccess: () => {
            queryClient.setQueryData(["user"], (oldData: any) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    isRegistrationComplete: true
                };
            });
            queryClient.invalidateQueries({ queryKey: ["user"] });
            if (onSuccess) {
                onSuccess();
            }
        },
        onError: (error) => {
            console.error("Erro ao completar cadastro:", error);
            enqueueSnackbar("Erro ao completar cadastro. Tente novamente.", {
                variant: "error",
            });
        },
    });
}
