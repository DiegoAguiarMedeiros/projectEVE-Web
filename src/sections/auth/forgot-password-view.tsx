import { useState, useCallback } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useForgotPassword } from "src/hooks/mutations/auth/useForgotPassword";
import { usePaths } from "src/hooks/usePaths";
import { useRouter } from "src/routes/hooks";

// ----------------------------------------------------------------------

export function ForgotPasswordView() {
  const { t, i18n } = useTranslation();
  const paths = usePaths();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { mutate: requestReset, isPending } = useForgotPassword(() => {
    setSubmitted(true);
  });

  const handleSubmit = useCallback(() => {
    requestReset({ email, locale: i18n.language });
  }, [requestReset, email, i18n.language]);

  if (submitted) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2} sx={{ textAlign: "center" }}>
        <Typography variant="h6">{t("auth.forgot_password_success_title")}</Typography>
        <Typography variant="body2" color="text.secondary">
          {t("auth.forgot_password_success_message")}
        </Typography>
        <Button variant="text" onClick={() => router.push(paths.signIn)}>
          {t("auth.sign_in")}
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">{t("auth.forgot_password_title")}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
          {t("auth.forgot_password_subtitle")}
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleSubmit(); }}
        display="flex"
        flexDirection="column"
        gap={3}
      >
        <TextField
          fullWidth
          name="email"
          label={t("auth.email")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          fullWidth
          size="large"
          type="submit"
          color="primary"
          variant="contained"
          loading={isPending}
        >
          {t("auth.send_reset_link")}
        </Button>

        <Button variant="text" onClick={() => router.push(paths.signIn)} sx={{ alignSelf: "center" }}>
          {t("auth.sign_in")}
        </Button>
      </Box>
    </>
  );
}
