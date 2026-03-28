import { Box, Button, TextField, Typography } from "@mui/material";
import { CurrencyInput } from "src/components/CurrencyInput";
import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import TransitionsModal from "src/sections/shared/transitionsModal";
import { useSnackbar, VariantType } from "notistack";
import { useUpdateIncomes } from "src/hooks/mutations/incomes/useUpdateIncomes";
import { useCreateIncomes } from "src/hooks/mutations/incomes/useCreateIncomes";
import { Incomes, IncomesPost } from "src/types/Incomes";
import { useTranslation } from "react-i18next";


type FormIncomesProps = {
    buttonIcon?: React.ReactNode;
    buttonLabel: string;
    data?: Incomes;
    externalOpen?: boolean;
    onExternalClose?: () => void;
}

export function FormIncomes({ buttonLabel, buttonIcon, data, externalOpen, onExternalClose }: FormIncomesProps) {
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
    const [errorDescription, setErrorDescription] = useState<string | null>(null);
    const [errorAmount, setErrorAmount] = useState<string | null>(null);
    const [errorPaymentDay, setErrorPaymentDay] = useState<string | null>(null);

    const clearForm = () => {
        setDescription("")
        setAmount("")
        setPaymentDay("")
        setErrorDescription(null)
        setErrorAmount(null)
        setErrorPaymentDay(null)
        setError(null)
    };

    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createMutation = useCreateIncomes();

    const updateMutation = useUpdateIncomes();

    const submitAction = async (incomes: IncomesPost) => {
        setIsPending(true);
        setError(null);

        try {
            if (data) {
                await updateMutation.mutateAsync({
                    id: data.id,
                    description: incomes.description,
                    amount: incomes.amount,
                    paymentDay: incomes.paymentDay,
                });
            } else {
                await createMutation.mutateAsync({
                    description: incomes.description,
                    amount: incomes.amount,
                    paymentDay: incomes.paymentDay,
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
        if (validateDescription() && validateAmount() && validatePaymentDay()) {
            await submitAction({ description, amount, paymentDay });
        }
    };

    const validateDescription = useCallback(() => {
        if (!description.trim()) {
            setErrorDescription(t('settings.income.validation.description_required'));
            return false;
        }
        setErrorDescription(null);
        return true;
    }, [description, t]);

    const validateAmount = useCallback(() => {
        if (!amount.trim()) {
            setErrorAmount(t('settings.income.validation.amount_required'));
            return false;
        }

        if (Number.isNaN(Number(amount))) {
            setErrorAmount(t('settings.income.validation.amount_numeric'));
            return false;
        }
        setErrorAmount(null);
        return true;
    }, [amount, t]);

    const validatePaymentDay = useCallback(() => {
        const day = Number(paymentDay);
        if (!day && !paymentDay.trim()) {
            setErrorPaymentDay(t('settings.income.validation.payment_day_required'));
            return false;
        }
        if (Number.isNaN(day) || day < 1 || day > 31) {
            setErrorPaymentDay(t('settings.income.validation.payment_day_range'));
            return false;
        }
        setErrorPaymentDay(null);
        return true;
    }, [paymentDay, t]);


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

            okButton={<Button type="submit" variant="contained" color="primary" onClick={handleSubmit} disabled={isPending} loading={isPending}>{data ? t('common.save') : t('common.add')}</Button>
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
                    {t('settings.income.title')}
                </Typography>
                {error && <p>{error.message}</p>}
                <TextField
                    fullWidth
                    name="description"
                    label={t('settings.income.description')}
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
                    label={t('settings.income.amount')}
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
                    label={t('settings.income.payment_day')}
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
