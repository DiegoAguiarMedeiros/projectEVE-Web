import { useState, useCallback, useMemo } from "react";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import type { AxiosError } from "axios";

import { useRouter } from "src/routes/hooks";

import { Iconify } from "src/components/iconify";
import { useLogin } from "src/hooks/mutations/auth/useLogin";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: login, isPending, error } = useLogin(() => {
    router.push("/");
  });

  const handleSubmit = useCallback(() => {
    login({
      email,
      password,
      locale: i18n.language,
    });
  }, [login, email, password, i18n]);

  const errorKey = useMemo(() => {
    if (!error) return null;
    const axiosError = error as AxiosError<{ message: string }>;
    return axiosError?.response?.data?.message ?? 'auth.login_error';
  }, [error]);

  const isEmailNotVerified = errorKey === 'auth.errors.email_not_verified';

  const renderForm = (
    <Box
      component="form"
      onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleSubmit(); }}
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
    >
      {isEmailNotVerified && (
        <Alert severity="warning" sx={{ width: '100%', mb: 2 }}>
          {t('auth.errors.email_not_verified')}
        </Alert>
      )}

      <TextField
        fullWidth
        name="email"
        label={t('auth.email')}
        defaultValue={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 3 }}
        error={!!error && !isEmailNotVerified}
        helperText={error && !isEmailNotVerified ? t(errorKey ?? 'auth.login_error') : ""}
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        {t('auth.forgot_password')}
      </Link>

      <TextField
        fullWidth
        name="password"
        label={t('auth.password')}
        defaultValue={password}
        onChange={(e) => setPassword(e.target.value)}
        type={showPassword ? "text" : "password"}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? "solar:eye-bold" : "solar:eye-closed-bold"} />
                </IconButton>
              </InputAdornment>
            ),
          }
        }}
        sx={{ mb: 3 }}
      />

      <Button
        fullWidth
        size="large"
        type="submit"
        color="primary"
        variant="contained"
        loading={isPending}
      >
        {t('auth.sign_in')}
      </Button>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">{t('auth.sign_in_title')}</Typography>
        <Typography variant="body2" color="text.secondary">
          {t('auth.no_account')}
          <Link variant="subtitle2" href="/cadastro" sx={{ ml: 0.5 }}>
            {t('auth.get_started')}
          </Link>
        </Typography>
      </Box>

      {renderForm}

    </>
  );
}
