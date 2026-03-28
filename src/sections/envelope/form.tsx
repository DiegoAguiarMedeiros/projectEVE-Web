import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Stack, InputAdornment, Typography } from "@mui/material";
import { CurrencyInput } from "src/components/CurrencyInput";
import { Iconify } from "src/components/iconify";
import { useCallback, useEffect, useState } from "react";
import TransitionsModal from "src/sections/shared/transitionsModal";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useCreateTransactions } from "src/hooks/mutations/transactions/useCreateTransactions";
import { useUpdateTransactions } from "src/hooks/mutations/transactions/useUpdateTransactions";
import { Transactions, PaymentMethod, TransactionsPost, allPaymentMethod } from "src/types/Transactions";
import { Envelopes } from "src/types/Envelopes";

import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { fCurrency } from "src/utils/format-number";
import { useTranslation } from "react-i18next";
import { useCurrency } from "src/hooks/useCurrency";
import { iconsMap } from "src/components/icon/iconsMap";
import { useAllCreditCards } from "src/hooks/queries/credit-cards/useAllCreditCards";

type TransactionFormProps = {
    buttonIcon?: React.ReactNode;
    buttonLabel: string;
    data?: Transactions;
    envelopeId: string;
    allEnvelopes?: Envelopes[];
    externalOpen?: boolean;
    onExternalClose?: () => void;
}

export function TransactionForm({ buttonLabel, buttonIcon, data, envelopeId, allEnvelopes = [], externalOpen, onExternalClose }: TransactionFormProps) {
    const { month, year } = SelectedMonthYearStore();

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        clearTransactionForm();
        setOpen(false);
        onExternalClose?.();
    };

    useEffect(() => {
        if (externalOpen) setOpen(true);
    }, [externalOpen]);

    // Transaction form state
    const [description, setDescription] = useState(data ? data.description : "");
    const [amount, setAmount] = useState(data ? data.amount : "");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(data ? data.paymentMethod : "envelope.transaction.payment_method.DebitCard");
    const [creditCardId, setCreditCardId] = useState<string>(data?.creditCardId ?? "");
    const [date, setDate] = useState<Dayjs | null>(data ? dayjs(data.date) : null);

    const { data: creditCardsData } = useAllCreditCards();
    const creditCards = creditCardsData?.data ?? [];

    const [errorDescription, setErrorDescription] = useState<string | null>(null);
    const [errorAmount, setErrorAmount] = useState<string | null>(null);

    const clearTransactionForm = () => {
        setDescription("");
        setAmount("");
        setCreditCardId("");
        setDate(null);
        setPaymentMethod("envelope.transaction.payment_method.DebitCard");
        setError(null);
        setErrorDescription(null);
        setErrorAmount(null);
    };

    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createMutation = useCreateTransactions();
    const updateMutation = useUpdateTransactions();

    // Find source envelope for transfers
    const sourceEnvelope = allEnvelopes.find(env => env.id === envelopeId);
    const destinationEnvelopes = allEnvelopes.filter(env => env.id !== envelopeId);

    const submitTransactionAction = async (transactions: TransactionsPost) => {
        setIsPending(true);
        setError(null);

        const isCreditCard = transactions.paymentMethod === "envelope.transaction.payment_method.CreditCard";
        try {
            if (data) {
                await updateMutation.mutateAsync({
                    id: data.id,
                    description: transactions.description,
                    amount: transactions.amount,
                    status: data.status,
                    envelopeId,
                    paymentMethod: transactions.paymentMethod,
                    creditCardId: isCreditCard ? transactions.creditCardId : undefined,
                    date: transactions.date,
                    type: "Debit"
                });
            } else {
                await createMutation.mutateAsync({
                    description: transactions.description,
                    amount: transactions.amount,
                    status: transactions.status,
                    envelopeId,
                    paymentMethod: transactions.paymentMethod,
                    creditCardId: isCreditCard ? transactions.creditCardId : undefined,
                    date: transactions.date,
                    type: "Debit"
                });
            }

            clearTransactionForm();
            handleClose();
        } catch (err: any) {
            setError(err);
        } finally {
            setIsPending(false);
        }
    };

    const handleTransactionSubmit = async () => {
        if (validateDescription() && validateAmount()) {
            await submitTransactionAction({
                description,
                amount,
                paymentMethod,
                creditCardId: creditCardId || undefined,
                status: "transaction.status.pending",
                envelopeId,
                date,
                type: "Debit",
            });
        }
    };



    const { t } = useTranslation();
    const { symbol } = useCurrency();

    const validateDescription = useCallback(() => {
        if (!description.trim()) {
            setErrorDescription(t('envelope.validation.description_required'));
            return false;
        }
        setErrorDescription(null);
        return true;
    }, [description, t]);

    const validateAmount = useCallback(() => {
        if (!amount.trim()) {
            setErrorAmount(t('envelope.validation.amount_required'));
            return false;
        }

        if (Number.isNaN(Number(amount))) {
            setErrorAmount(t('envelope.validation.amount_numeric'));
            return false;
        }
        setErrorAmount(null);
        return true;
    }, [amount, t]);

    const handleSelectChange = (event: SelectChangeEvent<PaymentMethod>) => {
        const value = event.target.value as PaymentMethod;
        setPaymentMethod(value);
        if (value !== "envelope.transaction.payment_method.CreditCard") {
            setCreditCardId("");
        }
    };



    return (

        <TransitionsModal
            open={open}
            handleClose={handleClose}
            handleOpen={handleOpen}
            openButton={externalOpen !== undefined
                ? <></>
                : !buttonIcon
                    ? <Button variant="contained" color="primary" onClick={handleOpen}>{buttonLabel}</Button>
                    : <Button
                        style={{ display: "flex", gap: "16px", background: "none", border: "none", cursor: "pointer", margin: 0, padding: 0 }}
                        onClick={handleOpen}
                    >
                        {buttonIcon}{buttonLabel === 'Adicionar' ? t('common.add') : buttonLabel}
                    </Button>
            }

            okButton={
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleTransactionSubmit}
                    disabled={isPending}
                    loading={isPending}
                >
                    {data ? t('common.save') : t('common.add')}
                </Button>
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
                    {t('envelope.transaction.tabs.transaction')}
                </Typography>
                {error && <p>{error.message}</p>}
                <TextField
                    fullWidth
                    name="description"
                    label={t('envelope.transaction.description')}
                    placeholder={t('envelope.transaction.placeholder.description')}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={validateDescription}
                    error={!!errorDescription}
                    helperText={errorDescription ?? ""}
                />
                <CurrencyInput
                    fullWidth
                    name="amount"
                    label={t('envelope.transaction.amount')}
                    placeholder={t('envelope.transaction.placeholder.amount')}
                    value={amount}
                    onChange={setAmount}
                    onBlur={validateAmount}
                    error={!!errorAmount}
                    helperText={errorAmount ?? ""}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        sx={{ width: "100%" }}
                        name="date"
                        label={t('envelope.transaction.date')}
                        value={date}
                        onChange={(newValue) => setDate(newValue)}
                        format="DD/MM/YYYY"
                    />
                </LocalizationProvider>
                <FormControl fullWidth>
                    <InputLabel id="payment-method-select-label">{t('envelope.transaction.payment_method_label')}</InputLabel>
                    <Select
                        labelId="payment-method-select-label"
                        id="payment-method-select"
                        label={t('envelope.transaction.payment_method_label')}
                        sx={{ width: "100%" }}
                        name="paymentMethod"
                        value={paymentMethod}
                        onChange={handleSelectChange}
                    >
                        {allPaymentMethod.map((f, index) => {
                            if (f === "envelope.transaction.payment_method.Reallocation") {
                                return null;
                            }
                            if (f === "envelope.transaction.payment_method.CreditCard" && creditCards.length === 0) {
                                return null;
                            }
                            return (<MenuItem key={index} value={f}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <span>{t(f)}</span>
                                </Stack>
                            </MenuItem>)
                        })}
                    </Select>
                </FormControl>
                {paymentMethod === "envelope.transaction.payment_method.CreditCard" && creditCards.length > 0 && (
                    <FormControl fullWidth>
                        <InputLabel id="credit-card-select-label">{t('envelope.transaction.payment_method.CreditCard')}</InputLabel>
                        <Select
                            labelId="credit-card-select-label"
                            id="credit-card-select"
                            label={t('envelope.transaction.payment_method.CreditCard')}
                            sx={{ width: "100%" }}
                            value={creditCardId}
                            onChange={(e) => setCreditCardId(e.target.value)}
                        >
                            {creditCards.map((card) => (
                                <MenuItem key={card.id} value={card.id}>
                                    {card.name} ({card.flag})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </Box >
        </TransitionsModal>
    );
}
