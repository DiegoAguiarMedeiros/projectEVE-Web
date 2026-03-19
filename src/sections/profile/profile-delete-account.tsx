
import * as React from "react";
import { useState } from "react";
import {
    Card,
    CardHeader,
    CardContent,
    Divider,
    Stack,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Warning } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDeleteAccount } from "src/hooks/mutations/user/useDeleteAccount";
import { usePaths } from "src/hooks/usePaths";

export function ProfileDeleteAccount() {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const paths = usePaths();
    const [open, setOpen] = useState(false);

    const { mutate: deleteAccount, isPending } = useDeleteAccount(() => {
        navigate(paths.signIn);
    });

    const handleConfirm = () => {
        deleteAccount(undefined, {
            onError: (err: any) => {
                enqueueSnackbar(
                    err.response?.data?.message || t("profile.delete_account.error"),
                    { variant: "error" }
                );
                setOpen(false);
            },
        });
    };

    return (
        <>
            <Card sx={{ border: (theme) => `1px solid ${alpha(theme.palette.error.main, 0.4)}` }}>
                <CardHeader
                    title={t("profile.delete_account.title")}
                    slotProps={{ title: { color: "error" } }}
                />
                <Divider />
                <CardContent>
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={1} alignItems="flex-start">
                            <Warning color="error" fontSize="small" sx={{ mt: 0.3 }} />
                            <Typography variant="body2" color="text.secondary">
                                {t("profile.delete_account.warning")}
                            </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="flex-end">
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => setOpen(true)}
                            >
                                {t("profile.delete_account.button")}
                            </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>{t("profile.delete_account.dialog.title")}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t("profile.delete_account.dialog.description")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} disabled={isPending}>
                        {t("common.cancel")}
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        loading={isPending}
                        onClick={handleConfirm}
                    >
                        {t("profile.delete_account.dialog.confirm")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
