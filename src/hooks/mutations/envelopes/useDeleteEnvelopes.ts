import { useMutation } from "@tanstack/react-query";
import { deleteEnvelopes } from "src/api/services/envelopes/EnvelopesService";

export function useDeleteEnvelope(onSuccess?: () => void) {
  return useMutation({
    mutationFn: deleteEnvelopes,
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
  });
}