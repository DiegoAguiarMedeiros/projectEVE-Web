import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { AxiosError } from "axios";
import { Logo } from "src/components/logo";
import { useVerifyEmail } from "src/hooks/queries/auth/useVerifyEmail";

export function VerifyEmailView() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const isPending = searchParams.get("pending") === "true";

  const { isLoading, isSuccess, error } = useVerifyEmail(token);

  const axiosError = error as AxiosError<{ message: string }> | null;
  const errorKey =
    axiosError?.response?.data?.message ?? "errors.unexpected";

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap={3}
      sx={{ px: 3 }}
    >
      <Logo isSingle={false} disableLink sx={{ mb: 2 }} />

      {isLoading && (
        <>
          <CircularProgress size={48} />
          <Typography variant="h6" color="text.secondary">
            {t("auth.verify_email.verifying")}
          </Typography>
        </>
      )}

      {isSuccess && (
        <>
          <Box sx={{ fontSize: "4rem", lineHeight: 1 }}>✅</Box>
          <Typography variant="h5" fontWeight={700}>
            {t("auth.verify_email.success_title")}
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            {t("auth.verify_email.success_message")}
          </Typography>
          <Button variant="contained" size="large" href="/entrar">
            {t("auth.verify_email.go_to_login")}
          </Button>
        </>
      )}

      {!isLoading && error && (
        <>
          <Box sx={{ fontSize: "4rem", lineHeight: 1 }}>❌</Box>
          <Typography variant="h5" fontWeight={700}>
            {t("auth.verify_email.error_title")}
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            {t(errorKey)}
          </Typography>
          <Button variant="outlined" size="large" href="/entrar">
            {t("auth.verify_email.go_to_login")}
          </Button>
        </>
      )}

      {isPending && !token && (
        <>
          <Box sx={{ fontSize: "4rem", lineHeight: 1 }}>📧</Box>
          <Typography variant="h5" fontWeight={700}>
            {t("auth.verify_email.pending_title")}
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            {t("auth.verify_email.pending_message")}
          </Typography>
          <Button variant="outlined" size="large" href="/entrar">
            {t("auth.verify_email.go_to_login")}
          </Button>
        </>
      )}

      {!isLoading && !error && !isSuccess && !token && !isPending && (
        <>
          <Box sx={{ fontSize: "4rem", lineHeight: 1 }}>⚠️</Box>
          <Typography variant="h5" fontWeight={700}>
            {t("auth.verify_email.error_title")}
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            {t("auth.errors.invalid_or_expired_token")}
          </Typography>
          <Button variant="outlined" size="large" href="/entrar">
            {t("auth.verify_email.go_to_login")}
          </Button>
        </>
      )}
    </Box>
  );
}
