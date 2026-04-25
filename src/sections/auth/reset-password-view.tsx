import { useState, useCallback, useMemo } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { AxiosError } from "axios";

import { Iconify } from "src/components/iconify";
import { useResetPassword } from "src/hooks/mutations/auth/useResetPassword";
import { usePaths } from "src/hooks/usePaths";
import { useRouter } from "src/routes/hooks";

// ----------------------------------------------------------------------

interface ResetPasswordViewProps {
  token: string | null;
}

export function ResetPasswordView({ token }: ResetPasswordViewProps) {
  const { t } = useTranslation();
  const paths = usePaths();
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);

  const { mutate: resetPwd, isPending, error } = useResetPassword(() => {
    setDone(true);
  });

  const validationError = useMemo(() => {
    if (newPassword && newPassword.length < 8) return t("auth.validation.password_min_length");
    if (confirmPassword && newPassword !== confirmPassword) return t("auth.validation.passwords_mismatch");
    return null;
  }, [newPassword, confirmPassword, t]);

  const apiError = useMemo(() => {
    if (!error) return null;
    const axiosError = error as AxiosError<{ message: string }>;
    return axiosError?.response?.data?.message ?? null;
  }, [error]);

  const handleSubmit = useCallback(() => {
    if (!token || validationError) return;
    resetPwd({ token, newPassword });
  }, [resetPwd, token, newPassword, validationError]);

  if (!token) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2} sx={{ textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {t("auth.errors.reset_token_invalid_or_expired")}
        </Typography>
        <Button variant="text" onClick={() => router.push(paths.signIn)}>
          {t("auth.sign_in")}
        </Button>
      </Box>
    );
  }

  if (done) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2} sx={{ textAlign: "center" }}>
        <Typography variant="h6">{t("auth.reset_password_success_title")}</Typography>
        <Typography variant="body2" color="text.secondary">
          {t("auth.reset_password_success_message")}
        </Typography>
        <Button variant="contained" onClick={() => router.push(paths.signIn)}>
          {t("auth.sign_in")}
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">{t("auth.reset_password_title")}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
          {t("auth.reset_password_subtitle")}
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleSubmit(); }}
        display="flex"
        flexDirection="column"
        gap={3}
      >
        {apiError && (
          <Typography variant="body2" color="error" sx={{ textAlign: "center" }}>
            {t(apiError)}
          </Typography>
        )}

        <TextField
          fullWidth
          name="newPassword"
          label={t("auth.new_password")}
          type={showPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={!!newPassword && newPassword.length < 8}
          helperText={newPassword && newPassword.length < 8 ? t("auth.validation.password_min_length") : ""}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? "solar:eye-bold" : "solar:eye-closed-bold"} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          fullWidth
          name="confirmPassword"
          label={t("auth.confirm_new_password")}
          type={showConfirm ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!confirmPassword && newPassword !== confirmPassword}
          helperText={confirmPassword && newPassword !== confirmPassword ? t("auth.validation.passwords_mismatch") : ""}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                    <Iconify icon={showConfirm ? "solar:eye-bold" : "solar:eye-closed-bold"} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          fullWidth
          size="large"
          type="submit"
          color="primary"
          variant="contained"
          loading={isPending}
          disabled={!!validationError || !newPassword || !confirmPassword}
        >
          {t("auth.reset_password_button")}
        </Button>
      </Box>
    </>
  );
}
