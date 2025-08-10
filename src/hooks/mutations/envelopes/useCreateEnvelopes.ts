import { useMutation } from "@tanstack/react-query";
import { createEnvelopes } from "src/api/services/envelopes/EnvelopesService";

export function useCreateEnvelopes(onSuccess?: () => void) {
  return useMutation({
    mutationFn: createEnvelopes,
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
  });
}