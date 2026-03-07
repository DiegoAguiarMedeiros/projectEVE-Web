import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { completeRegistration } from "src/api/services/user/UserService";

export function useCompleteRegistration(onSuccess?: () => void) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: () => (completeRegistration().then((res) => (res.data))),
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
            enqueueSnackbar(t("notifications.registration.error_complete"), {
                variant: "error",
            });
        },
    });
}
