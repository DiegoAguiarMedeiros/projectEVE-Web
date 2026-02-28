import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import TransitionsModal from "src/sections/shared/transitionsModal";
import { Envelopes } from "src/types/Envelopes";
import { FixedExpenses, FixedExpensesPost } from "src/types/FixedExpenses";
import { useCreateFixedExpenses } from "src/hooks/mutations/fixed-expenses/useCreateFixedExpenses";
import { useUpdateFixedExpenses } from "src/hooks/mutations/fixed-expenses/useUpdateFixedExpenses";
import { useTranslation } from "react-i18next";
import { CurrencyInput } from "src/components/CurrencyInput";


type FixedExpenseFormProps = {
    buttonIcon?: React.ReactNode;
    buttonLabel: string;
    data?: FixedExpenses;
    envelopes: Envelopes[]
    externalOpen?: boolean;
    onExternalClose?: () => void;
}

export function FixedExpenseForm({ buttonLabel, buttonIcon, data, envelopes, externalOpen, onExternalClose }: FixedExpenseFormProps) {
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        clearForm();
        setOpen(false);
        onExternalClose?.();
    };

    useEffect(() => {
        if (externalOpen) setOpen(true);
    }, [externalOpen]);

    const [description, setDescription] = useState(data ? data.description : "");
    const [amount, setAmount] = useState(data ? data.amount : "");
    const [paymentDay, setPaymentDay] = useState(data ? data.paymentDay : "");
    const [envelope, setEnvelope] = useState(data ? data.envelopeId : "");

    const [errorDescription, setErrorDescription] = useState<string | null>(null);
    const [errorAmount, setErrorAmount] = useState<string | null>(null);
    const [errorPaymentDay, setErrorPaymentDay] = useState<string | null>(null);

    const clearForm = () => {
        setDescription("")
        setAmount("")
        setPaymentDay("")
        setEnvelope("")
        setErrorDescription(null)
        setErrorAmount(null)
        setErrorPaymentDay(null)
        setError(null)
    };

    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createMutation = useCreateFixedExpenses();

    const updateMutation = useUpdateFixedExpenses();

    const submitAction = async (fixedExpense: FixedExpensesPost) => {
        setIsPending(true);
        setError(null);

        try {
            if (data) {
                await updateMutation.mutateAsync({
                    id: data.id,
                    envelopeId: fixedExpense.envelopeId,
                    description: fixedExpense.description,
                    amount: fixedExpense.amount,
                    paymentDay: fixedExpense.paymentDay,
                });
            } else {
                await createMutation.mutateAsync({
                    description: fixedExpense.description,
                    amount: fixedExpense.amount,
                    paymentDay: fixedExpense.paymentDay,
                    envelopeId: fixedExpense.envelopeId,
                });
            }
            clearForm();
            handleClose();
        } catch (err: any) {
            setError(err);
        } finally {
            setIsPending(false);
        }
    };

    const handleSubmit = async () => {
        if (validateDescription() && validateAmount()) {
            await submitAction({
                description, amount,
                paymentDay,
                envelopeId: envelope,
            });
        }
    };

    const validateDescription = useCallback(() => {
        if (!description.trim()) {
            setErrorDescription(t('settings.fixed_expense.validation.description_required'));
            return false;
        }
        setErrorDescription(null);
        return true;
    }, [description, t]);

    const validateAmount = useCallback(() => {
        if (!amount.trim()) {
            setErrorAmount(t('settings.fixed_expense.validation.amount_required'));
            return false;
        }

        if (Number.isNaN(Number(amount))) {
            setErrorAmount(t('settings.fixed_expense.validation.amount_numeric'));
            return false;
        }
        setErrorAmount(null);
        return true;
    }, [amount, t]);

    const validatePaymentDay = useCallback(() => {
        const day = Number(paymentDay);
        if (!paymentDay.trim()) {
            setErrorPaymentDay(t('settings.fixed_expense.validation.payment_day_required'));
            return false;
        }
        if (Number.isNaN(day) || day < 1 || day > 31) {
            setErrorPaymentDay(t('settings.fixed_expense.validation.payment_day_range'));
            return false;
        }
        setErrorPaymentDay(null);
        return true;
    }, [paymentDay, t]);


    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        setEnvelope(event.target.value);
    };


    return (

        <TransitionsModal
            open={open}
            handleClose={handleClose}
            handleOpen={handleOpen}
            openButton={externalOpen !== undefined
                ? <></>
                : !buttonIcon
                ?
                <Button variant="contained" color="primary" onClick={handleOpen}  >{buttonLabel}</Button>
                :
                <Button
                    style={{ display: "flex", gap: "16px", background: "none", border: "none", cursor: "pointer", margin: 0, padding: 0 }}
                    onClick={handleOpen}
                >
                    {buttonIcon}{buttonLabel === 'common.add' ? t('common.add') : buttonLabel === 'common.edit' ? t('common.edit') : buttonLabel}
                </Button>
            }

            okButton={<Button type="submit" variant="outlined" color="primary" onClick={handleSubmit} disabled={isPending} >{t('common.add')}</Button>
            }>
            <Box
                gap={1.5}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifySelf="center"
                sx={{ width: "100%" }}
            >


                <Typography variant="h3" noWrap>
                    {t('settings.fixed_expense.title')}
                </Typography>
                {error && <p>{error.message}</p>}

                <FormControl fullWidth>
                    <InputLabel id="evenlope-id-select-label">{t('settings.fixed_expense.envelope')}</InputLabel>
                    <Select
                        labelId="evenlope-id-select-label"
                        id="evenlope-id-select"
                        label={t('settings.fixed_expense.envelope')}
                        sx={{ width: "100%", mb: 3 }}
                        name="envelope"
                        value={envelope}
                        onChange={handleSelectChange}
                    >
                        {envelopes.filter((e) => e.name !== 'debts' && e.name !== 'goals').map((env, index) => (
                            <MenuItem key={index} value={env.id}>{t(env.name)}</MenuItem>
                        ))}
                    </Select>
                </FormControl>


                <TextField
                    fullWidth
                    name="description"
                    label={t('settings.fixed_expense.description')}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={validateDescription}
                    sx={{ mb: 3 }}
                    error={!!errorDescription}
                    helperText={errorDescription ?? ""}
                />
                <CurrencyInput
                    fullWidth
                    name="amount"
                    label={t('settings.fixed_expense.amount')}
                    value={amount}
                    onChange={setAmount}
                    onBlur={validateAmount}
                    sx={{ mb: 3 }}
                    error={!!errorAmount}
                    helperText={errorAmount ?? ""}
                />

                <TextField
                    fullWidth
                    type="number"
                    name="paymentDay"
                    label={t('settings.fixed_expense.payment_day')}
                    value={paymentDay}
                    onChange={(e) => setPaymentDay(e.target.value)}
                    onBlur={validatePaymentDay}
                    sx={{ mb: 3 }}
                    error={!!errorPaymentDay}
                    helperText={errorPaymentDay ?? ""}
                    slotProps={{
                        input: {
                            inputMode: "numeric",
                            "aria-valuemin": 1,
                            "aria-valuemax": 31,
                        }
                    }}
                />

            </Box >
        </TransitionsModal>
    );
}
