import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    Box,
    Button,
    TextField,
    MenuItem,
    Typography,
    Stack,
    InputAdornment
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import TransitionsModal from "src/sections/shared/transitionsModal";
import { Envelopes } from "src/types/Envelopes";
import { useTransferBalance } from "src/hooks/mutations/envelopes/useTransferBalance";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { fCurrency } from "src/utils/format-number";

interface TransferBalanceModalProps {
    open: boolean;
    onClose: () => void;
    sourceEnvelope?: Envelopes;
    allEnvelopes: Envelopes[];
}

export function TransferBalanceModal({
    open,
    onClose,
    sourceEnvelope,
    allEnvelopes,
}: TransferBalanceModalProps) {
    const { month, year } = SelectedMonthYearStore();
    const { mutate, isPending } = useTransferBalance();
    const { t } = useTranslation();

    const [toEnvelopeId, setToEnvelopeId] = useState("");
    const [amount, setAmount] = useState<number | string>("");
    const [error, setError] = useState<string | null>(null);

    // Filter envelopes to exclude the source envelope
    const destinationEnvelopes = allEnvelopes.filter(
        (env) => env.id !== sourceEnvelope?.id
    );

    useEffect(() => {
        if (open) {
            setToEnvelopeId("");
            setAmount("");
            setError(null);
        }
    }, [open]);

    const handleSubmit = () => {
        if (!sourceEnvelope) return;
        if (!toEnvelopeId) {
            setError(t('envelope.validation.select_target'));
            return;
        }

        const numAmount = Number(amount);
        if (!amount || numAmount <= 0) {
            setError(t('envelope.validation.amount_positive'));
            return;
        }

        if (numAmount > (sourceEnvelope.amount || 0)) {
            setError(t('envelope.validation.insufficient_funds'));
            return;
        }

        mutate(
            {
                fromEnvelopeId: sourceEnvelope.id,
                toEnvelopeId,
                amount: numAmount,
                year,
                month,
            },
            {
                onSuccess: () => {
                    onClose();
                },
            }
        );
    };

    const handleClose = () => {
        onClose();
        setError(null);
    }


    const isValid = toEnvelopeId && Number(amount) > 0 && Number(amount) <= (sourceEnvelope?.amount || 0);

    return (
        <TransitionsModal
            open={open}
            handleOpen={() => { }} // Managed by parent
            handleClose={handleClose}
            okButton={
                <LoadingButton
                    variant="contained"
                    onClick={handleSubmit}
                    loading={isPending}
                    disabled={!isValid}
                >
                    {t('common.transfer')}
                </LoadingButton>
            }
            openButton={<></>}
        >
            <Box
                gap={3}
                display="flex"
                flexDirection="column"
                alignItems="center"
                sx={{ width: "100%", pt: 2 }}
            >
                <Typography variant="h4">{t('envelope.transfer.title')}</Typography>

                <Stack spacing={3} sx={{ width: '100%' }}>
                    {sourceEnvelope && (
                        <Box sx={{ bgcolor: 'background.neutral', p: 2, borderRadius: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                {t('envelope.transfer.from')}:
                            </Typography>
                            <Typography variant="h6">
                                {sourceEnvelope.name}
                            </Typography>
                            <Typography variant="body2" color={(sourceEnvelope.amount ?? 0) < 0 ? 'error.main' : 'success.main'}>
                                {t('overview.envelopes.available', { amount: fCurrency(sourceEnvelope.amount || 0) })}
                            </Typography>
                        </Box>
                    )}

                    <TextField
                        select
                        label={t('envelope.transfer.target')}
                        fullWidth
                        value={toEnvelopeId}
                        onChange={(e) => setToEnvelopeId(e.target.value)}
                    >
                        {destinationEnvelopes.map((env) => (
                            <MenuItem key={env.id} value={env.id}>
                                {env.name} ({fCurrency(env.amount || 0)})
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label={t('envelope.transfer.amount_label')}
                        type="number"
                        fullWidth
                        value={amount}
                        onChange={(e) => {
                            setAmount(e.target.value);
                            setError(null);
                        }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                        }}
                        error={!!error}
                        helperText={error}
                    />
                </Stack>
            </Box>
        </TransitionsModal>
    );
}
