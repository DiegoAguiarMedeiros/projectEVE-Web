import * as React from "react";

import Box from "@mui/material/Box";
import { useCallback, useState } from "react";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { Iconify } from "src/components/iconify";
import { useRouter } from "src/routes/hooks";
import { Logo } from "src/components/logo";
import { useRegister } from "src/hooks/mutations/auth/useRegister";

export function RegistrationView() {

  const router = useRouter();
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
  }, [register,name, email,password]);


  const validateName = useCallback(() => {
    if (!name.trim()) {
      setErrorName("O nome é obrigatório.");
      return false;
    }
    setErrorName(null);
    return true;
  }, [name]);

  const validateEmail = useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setErrorEmail("O e-mail é obrigatório.");
      return false;
    }
    if (!emailRegex.test(email)) {
      setErrorEmail("Digite um e-mail válido.");
      return false;
    }
    setErrorEmail(null);
    return true;
  }, [email]);

  const validatePassword = useCallback(() => {
    if (!password.trim()) {
      setErrorPassword("A senha é obrigatória.");
      return false;
    }
    if (password.length < 8) {
      setErrorPassword("A senha deve ter pelo menos 8 caracteres.");
      return false;
    }
    setErrorPassword(null);
    return true;
  }, [password]);

  const validateConfirmPassword = useCallback(() => {
    if (confirmPassword !== password) {
      setErrorConfirmPassword("As senhas não coincidem.");
      return false;
    }
    setErrorConfirmPassword(null);
    return true;
  }, [password, confirmPassword]);

  const handleRegistration = useCallback(async () => {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    if (confirmPassword !== password) {
      setErrorConfirmPassword("As senhas não coincidem.");
      return;
    }
    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    try {
      handleSubmit()
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [handleSubmit, password, confirmPassword, validateName, validateEmail, validatePassword, validateConfirmPassword]);

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

      <TextField
        fullWidth
        name="name"
        label="Nome"
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
        label="E-mail"
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
        label="Senha"
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
        label="Confirmar Senha"
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
        Cadastrar
      </Button>
    </Box>
  );
}
