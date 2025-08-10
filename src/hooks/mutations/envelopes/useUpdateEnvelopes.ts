import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { updateEnvelopes } from "src/api/services/envelopes/EnvelopesService";

export function useUpdateEnvelopes() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEnvelopes,
    onSuccess: () => {
      enqueueSnackbar("Envelope editado com sucesso!", { autoHideDuration: 3000, variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
      queryClient.invalidateQueries({ queryKey: ["envelopes"] });
    },
  });
}