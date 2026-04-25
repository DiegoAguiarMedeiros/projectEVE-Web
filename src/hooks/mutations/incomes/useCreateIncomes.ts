import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { createIncomes } from "src/api/services/incomes/IncomesService";

export function useCreateIncomes() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createIncomes,
    onSuccess: () => {
      enqueueSnackbar(t("notifications.incomes.created"), {
        autoHideDuration: 3000,
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      queryClient.invalidateQueries({ queryKey: ["incomes-total"] });
      queryClient.invalidateQueries({ queryKey: ["envelopes"] });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["envelopes"] });
      }, 1000);
    },
    onError: (error: any) => {
      const key = error?.response?.data?.message ?? "errors.unexpected";
      enqueueSnackbar(t(key), {
        autoHideDuration: 4000,
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    },
  });
}
