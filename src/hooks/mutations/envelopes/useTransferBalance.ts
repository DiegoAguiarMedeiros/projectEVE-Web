import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { api } from "src/api/client";

interface TransferBalanceDTO {
    fromEnvelopeId: string;
    toEnvelopeId: string;
    amount: number;
    year: number;
    month: number;
}

export function useTransferBalance() {
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
            enqueueSnackbar("Transferência realizada com sucesso!", { variant: "success" });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Erro ao realizar transferência";
            enqueueSnackbar(message, { variant: "error" });
        },
    });
}
