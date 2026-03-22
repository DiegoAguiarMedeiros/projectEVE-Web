
import * as React from "react";
import { useCallback, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { TextField, Card, CardHeader, CardContent, Divider, Stack, Button } from "@mui/material";
import type { CardProps } from "@mui/material/Card";
import { useSnackbar } from "notistack";
import { useUpdateUser } from "src/hooks/mutations/user/useUpdateUser";
import { User } from "src/types/User";
import { useUser } from "src/hooks/queries/user/useUser";

export function ProfileInfoForm({ sx }: Pick<CardProps, 'sx'>) {
    const { enqueueSnackbar } = useSnackbar();
    const { data: user } = useUser();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [errorName, setErrorName] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
        }
    }, [user]);

    const { mutate: updateUser, isPending } = useUpdateUser(() => {
        enqueueSnackbar('Perfil atualizado com sucesso!', { variant: 'success' });
    });

    const validateName = useCallback(() => {
        if (!name.trim()) {
            setErrorName("O nome é obrigatório.");
            return false;
        }
        setErrorName(null);
        return true;
    }, [name]);


    const handleSubmit = useCallback(async () => {
        if (!validateName()) return;

        updateUser({ name });
    }, [updateUser, name, validateName]);

    return (
        <Card sx={{ border: `1px solid var(--layout-nav-border-color)`, display: 'flex', flexDirection: 'column', ...sx }}>
            <CardHeader title="Informações Pessoais" />
            <Divider />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Stack spacing={3} sx={{ mt: 3 }}>
                    <TextField
                        fullWidth
                        name="name"
                        label="Nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={validateName}
                        error={!!errorName}
                        helperText={errorName ?? ""}
                    />

                    <TextField
                        fullWidth
                        disabled
                        name="email"
                        label="E-mail"
                        value={email}
                        helperText="O e-mail não pode ser alterado."
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
                        Salvar Alterações
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}
