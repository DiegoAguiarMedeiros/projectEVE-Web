
import * as React from "react";
import { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import { TextField, Card, CardHeader, CardContent, Divider, Stack, InputAdornment, IconButton, Button } from "@mui/material";
import type { CardProps } from "@mui/material/Card";
import { useSnackbar } from "notistack";
import { Iconify } from "src/components/iconify";
import { useChangePassword } from "src/hooks/mutations/user/useChangePassword";

export function ProfilePasswordForm({ sx }: Pick<CardProps, 'sx'>) {
    const { enqueueSnackbar } = useSnackbar();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const [errorNewPassword, setErrorNewPassword] = useState<string | null>(null);
    const [errorConfirmNewPassword, setErrorConfirmNewPassword] = useState<string | null>(null);

    const { mutate: changePassword, isPending } = useChangePassword(() => {
        enqueueSnackbar('Senha alterada com sucesso!', { variant: 'success' });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
    });

    const validateNewPassword = useCallback(() => {
        if (!newPassword) {
            setErrorNewPassword("A nova senha é obrigatória.");
            return false;
        }
        if (newPassword.length < 8) {
            setErrorNewPassword("A senha deve ter pelo menos 8 caracteres.");
            return false;
        }
        setErrorNewPassword(null);
        return true;
    }, [newPassword]);

    const validateConfirmNewPassword = useCallback(() => {
        if (confirmNewPassword !== newPassword) {
            setErrorConfirmNewPassword("As senhas não coincidem.");
            return false;
        }
        setErrorConfirmNewPassword(null);
        return true;
    }, [newPassword, confirmNewPassword]);


    const handleSubmit = useCallback(async () => {
        const isNewPasswordValid = validateNewPassword();
        const isConfirmValid = validateConfirmNewPassword();

        if (!currentPassword) {
            enqueueSnackbar('A senha atual é obrigatória', { variant: 'error' });
            return;
        }

        if (!isNewPasswordValid || !isConfirmValid) return;

        changePassword({
            currentPassword,
            newPassword
        }, {
            onError: (err: any) => {
                enqueueSnackbar(err.response?.data?.message || 'Erro ao alterar senha', { variant: 'error' });
            }
        });
    }, [changePassword, currentPassword, newPassword, validateNewPassword, validateConfirmNewPassword, enqueueSnackbar]);

    return (
        <Card sx={{ border: `1px solid var(--layout-nav-border-color)`, display: 'flex', flexDirection: 'column', ...sx }}>
            <CardHeader title="Alterar Senha" />
            <Divider />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Stack spacing={3} sx={{ mt: 3 }}>
                    <TextField
                        fullWidth
                        name="currentPassword"
                        label="Senha Atual"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        type={showCurrentPassword ? "text" : "password"}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)} edge="end">
                                            <Iconify icon={showCurrentPassword ? "solar:eye-bold" : "solar:eye-closed-bold"} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }
                        }}
                    />

                    <TextField
                        fullWidth
                        name="newPassword"
                        label="Nova Senha"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        onBlur={validateNewPassword}
                        error={!!errorNewPassword}
                        helperText={errorNewPassword ?? ""}
                        type={showNewPassword ? "text" : "password"}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                                            <Iconify icon={showNewPassword ? "solar:eye-bold" : "solar:eye-closed-bold"} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }
                        }}
                    />

                    <TextField
                        fullWidth
                        name="confirmNewPassword"
                        label="Confirmar Nova Senha"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        onBlur={validateConfirmNewPassword}
                        error={!!errorConfirmNewPassword}
                        helperText={errorConfirmNewPassword ?? ""}
                        type={showConfirmNewPassword ? "text" : "password"}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} edge="end">
                                            <Iconify icon={showConfirmNewPassword ? "solar:eye-bold" : "solar:eye-closed-bold"} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }
                        }}
                    />

                </Stack>

                <Box sx={{ flexGrow: 1 }} />

                <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                    <Button
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isPending}
                        onClick={handleSubmit}
                    >
                        Salvar Nova Senha
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}
