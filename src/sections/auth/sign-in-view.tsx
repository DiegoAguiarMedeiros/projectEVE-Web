import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { useLogin } from 'src/hooks/mutations/auth/useLogin';
// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('teste@teste.com');
  const [password, setPassword] = useState('r1234567');
  const [loading, setLoading] = useState(false);

  const { mutate: login, isPending, error } = useLogin(() => {
    router.push('/');
  });

  const handleSubmit = useCallback(() => {
    login({
      email,
      password
    });
  }, [login, email, password]);

  // const handleSignIn = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     await AuthService.login(email, password);
  //     const isAuthenticated = await AuthService.checkAuth();
  //     if (isAuthenticated) {
  //       router.push('/');
  //     } else {
  //       setError('Credenciais inválidas');
  //     }
  //   } catch (err) {
  //     setError(err?.response?.data?.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [email, password, router]);

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="email"
        label="Email address"
        defaultValue={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 3 }}
        error={!!error} // Adiciona borda vermelha se houver erro
        helperText={error ? 'Login ou senha incorreto' : ''} // Exibe mensagem de erro específica

      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link>

      <TextField
        fullWidth
        name="password"
        label="Password"
        defaultValue={password}
        onChange={(e) => setPassword(e.target.value)}
        type={showPassword ? 'text' : 'password'}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }
        }}
        sx={{ mb: 3 }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSubmit}
      >
        Sign in
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Don’t have an account?
          <Link variant="subtitle2" href='/cadastro' sx={{ ml: 0.5 }}>
            Get started
          </Link>
        </Typography>
      </Box>

      {renderForm}

    </>
  );
}
