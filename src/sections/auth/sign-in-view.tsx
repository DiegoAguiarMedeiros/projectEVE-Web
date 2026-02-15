import { useState, useCallback } from "react";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";

import { useRouter } from "src/routes/hooks";

import { Iconify } from "src/components/iconify";
import { useLogin } from "src/hooks/mutations/auth/useLogin";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: login, isPending, error } = useLogin(() => {
    router.push("/");
  });

  const handleSubmit = useCallback(() => {
    login({
      email,
      password
    });
  }, [login, email, password]);

  const renderForm = (
    <Box
      component="form"
      onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleSubmit(); }}
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
    >
      <TextField
        fullWidth
        name="email"
        label={t('auth.email')}
        defaultValue={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 3 }}
        error={!!error}
        helperText={error ? t('auth.login_error') : ""}
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
        onClick={handleSubmit}
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
