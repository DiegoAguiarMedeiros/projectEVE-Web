import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { updateEnvelopes } from "src/api/services/envelopes/EnvelopesService";

export function useUpdateEnvelopes() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEnvelopes,
    onSuccess: () => {
      enqueueSnackbar(t("notifications.envelopes.updated"), { autoHideDuration: 3000, variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
      queryClient.invalidateQueries({ queryKey: ["envelopes"] });
    },
    onError: (error: any) => {
      const rawMessage = error?.response?.data?.message ?? "notifications.envelopes.error_update";
      enqueueSnackbar(t(rawMessage), { autoHideDuration: 4000, variant: "error", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
    },
  });
}
