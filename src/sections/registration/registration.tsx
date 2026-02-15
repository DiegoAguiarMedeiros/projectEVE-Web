import * as React from "react";

import Box from "@mui/material/Box";
import { useCallback, useState } from "react";
import { Button, IconButton, InputAdornment, Link, TextField, Typography } from "@mui/material";
import { Iconify } from "src/components/iconify";
import { useRouter } from "src/routes/hooks";
import { Logo } from "src/components/logo";
import { useRegister } from "src/hooks/mutations/auth/useRegister";
import { useTranslation } from "react-i18next";

export function RegistrationView() {
  const router = useRouter();
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorName, setErrorName] = useState<string | null>(null);
  const [errorEmail, setErrorEmail] = useState<string | null>(null);
  const [errorPassword, setErrorPassword] = useState<string | null>(null);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { mutate: register, isPending, error } = useRegister(() => {
    router.push("/entrar");
  });

  const handleSubmit = useCallback(() => {
    register({
      name,
      email,
      password
    });
  }, [register, name, email, password]);

  const validateName = useCallback(() => {
    if (!name.trim()) {
      setErrorName(t('auth.validation.name_required'));
      return false;
    }
    setErrorName(null);
    return true;
  }, [name, t]);

  const validateEmail = useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setErrorEmail(t('auth.validation.email_required'));
      return false;
    }
    if (!emailRegex.test(email)) {
      setErrorEmail(t('auth.validation.email_invalid'));
      return false;
    }
    setErrorEmail(null);
    return true;
  }, [email, t]);

  const validatePassword = useCallback(() => {
    if (!password.trim()) {
      setErrorPassword(t('auth.validation.password_required'));
      return false;
    }
    if (password.length < 8) {
      setErrorPassword(t('auth.validation.password_min_length'));
      return false;
    }
    setErrorPassword(null);
    return true;
  }, [password, t]);

  const validateConfirmPassword = useCallback(() => {
    if (confirmPassword !== password) {
      setErrorConfirmPassword(t('auth.validation.passwords_mismatch'));
      return false;
    }
    setErrorConfirmPassword(null);
    return true;
  }, [password, confirmPassword, t]);

  const handleRegistration = useCallback(async () => {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    try {
      handleSubmit();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [handleSubmit, validateName, validateEmail, validatePassword, validateConfirmPassword]);

  return (
    <Box
      gap={1.5}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifySelf="center"
      sx={{ mb: 5 }}
    >
      <Logo isSingle={false} disableLink sx={{ margin: "20px" }} />

      <Typography variant="h5" sx={{ mb: 2 }}>{t('auth.sign_up_title')}</Typography>

      <TextField
        fullWidth
        name="name"
        label={t('auth.name')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={validateName}
        sx={{ mb: 3 }}
        error={!!errorName}
        helperText={errorName ?? ""}
      />

      <TextField
        fullWidth
        type="email"
        name="email"
        label={t('auth.email')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={validateEmail}
        sx={{ mb: 3 }}
        error={!!errorEmail}
        helperText={errorEmail ?? ""}
      />

      <TextField
        fullWidth
        name="password"
        label={t('auth.password')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={validatePassword}
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
        error={!!errorPassword}
        helperText={errorPassword ?? ""}
      />

      <TextField
        fullWidth
        name="confirmPassword"
        label={t('auth.confirm_password')}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        onBlur={validateConfirmPassword}
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
        error={!!errorConfirmPassword}
        helperText={errorConfirmPassword ?? ""}
      />

      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleRegistration}
        loading={loading}
      >
        {t('auth.sign_up')}
      </Button>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        {t('auth.has_account')}
        <Link variant="subtitle2" href="/entrar" sx={{ ml: 0.5 }}>
          {t('auth.sign_in')}
        </Link>
      </Typography>
    </Box>
  );
}
