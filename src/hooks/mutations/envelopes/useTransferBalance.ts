import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { api } from "src/api/client";

interface TransferBalanceDTO {
    fromEnvelopeId: string;
    toEnvelopeId: string;
    amount: number;
    year: number;
    month: number;
}

export function useTransferBalance() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const transferBalance = async (data: TransferBalanceDTO) => {
        const response = await api.post("/envelopes/transfer", data);
        return response.data;
    };

    return useMutation({
        mutationFn: transferBalance,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["envelopes"] });
            queryClient.invalidateQueries({ queryKey: ["processed-incomes"] });
            enqueueSnackbar(t("notifications.envelopes.transfer_success"), { variant: "success" });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || t("notifications.envelopes.error_transfer");
            enqueueSnackbar(message, { variant: "error" });
        },
    });
}
