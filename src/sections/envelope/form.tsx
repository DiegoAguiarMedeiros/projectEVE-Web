import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography, Tabs, Tab, Stack, InputAdornment } from "@mui/material";
import { startTransition, useActionState, useCallback, useEffect, useImperativeHandle, useRef, useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import TransitionsModal from "src/sections/shared/transitionsModal";
import { useSnackbar, VariantType } from "notistack";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useCreateTransactions } from "src/hooks/mutations/transactions/useCreateTransactions";
import { useUpdateTransactions } from "src/hooks/mutations/transactions/useUpdateTransactions";
import { Transactions, PaymentMethod, TransactionsPost, allPaymentMethod } from "src/types/Transactions";
import { Envelopes } from "src/types/Envelopes";
import { useTransferBalance } from "src/hooks/mutations/envelopes/useTransferBalance";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { fCurrency } from "src/utils/format-number";
import { LoadingButton } from "@mui/lab";

type TransactionFormProps = {
    buttonIcon?: React.ReactNode;
    buttonLabel: string;
    data?: Transactions;
    envelopeId: string;
    allEnvelopes?: Envelopes[];
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`transaction-tabpanel-${index}`}
            aria-labelledby={`transaction-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}

export function TransactionForm({ buttonLabel, buttonIcon, data, envelopeId, allEnvelopes = [] }: TransactionFormProps) {
    const { month, year } = SelectedMonthYearStore();

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setTabValue(0); // Reset to first tab when closing
    };

    // Tab state
    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Transaction form state
    const [description, setDescription] = useState(data ? data.description : "");
    const [amount, setAmount] = useState(data ? data.amount : "");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(data ? data.paymentMethod : "DebitCard");
    const [date, setDate] = useState<Dayjs | null>(data ? dayjs(data.date) : null);

    const [errorDescription, setErrorDescription] = useState<string | null>(null);
    const [errorAmount, setErrorAmount] = useState<string | null>(null);

    // Transfer form state
    const [toEnvelopeId, setToEnvelopeId] = useState("");
    const [transferAmount, setTransferAmount] = useState<number | string>("");
    const [transferError, setTransferError] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const clearTransactionForm = () => {
        setDescription("")
        setAmount("")
    };

    const clearTransferForm = () => {
        setToEnvelopeId("");
        setTransferAmount("");
        setTransferError(null);
    };

    // Reset transfer form when tab changes or modal opens
    useEffect(() => {
        if (open && tabValue === 1) {
            clearTransferForm();
        }
    }, [open, tabValue]);

    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createMutation = useCreateTransactions();
    const updateMutation = useUpdateTransactions();
    const transferMutation = useTransferBalance();

    // Find source envelope for transfers
    const sourceEnvelope = allEnvelopes.find(env => env.id === envelopeId);
    const destinationEnvelopes = allEnvelopes.filter(env => env.id !== envelopeId);

    const submitTransactionAction = async (transactions: TransactionsPost) => {
        setIsPending(true);
        setError(null);

        try {
            if (data) {
                await updateMutation.mutateAsync({
                    id: data.id,
                    description: transactions.description,
                    amount: transactions.amount,
                    status: data.status,
                    envelopeId,
                    paymentMethod: transactions.paymentMethod,
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
            startTransition(async () => {
                submitTransactionAction({
                    description,
                    amount,
                    paymentMethod,
                    status: "Pending",
                    envelopeId,
                    date,
                    type: "Debit",
                });
            });
        }
    };

    const handleTransferSubmit = () => {
        if (!sourceEnvelope) return;
        if (!toEnvelopeId) {
            setTransferError("Selecione um envelope de destino");
            return;
        }

        const numAmount = Number(transferAmount);
        if (!transferAmount || numAmount <= 0) {
            setTransferError("O valor deve ser maior que zero");
            return;
        }

        if (numAmount > (sourceEnvelope.amount || 0)) {
            setTransferError("Saldo insuficiente");
            return;
        }

        transferMutation.mutate(
            {
                fromEnvelopeId: sourceEnvelope.id,
                toEnvelopeId,
                amount: numAmount,
                year,
                month,
            },
            {
                onSuccess: () => {
                    clearTransferForm();
                    handleClose();
                },
            }
        );
    };

    const validateDescription = useCallback(() => {
        if (!description.trim()) {
            setErrorDescription("Descrição é obrigatória.");
            return false;
        }
        setErrorDescription(null);
        return true;
    }, [description]);

    const validateAmount = useCallback(() => {
        if (!amount.trim()) {
            setErrorAmount("Valor é obrigatório.");
            return false;
        }

        if (Number.isNaN(Number(amount))) {
            setErrorAmount("Valor deve ser numérico.");
            return false;
        }
        setErrorAmount(null);
        return true;
    }, [amount]);

    const handleSelectChange = (event: SelectChangeEvent<PaymentMethod>) => {
        setPaymentMethod(event.target.value as PaymentMethod);
    };

    const isTransferValid = toEnvelopeId && Number(transferAmount) > 0 && Number(transferAmount) <= (sourceEnvelope?.amount || 0);

    return (

        <TransitionsModal
            open={open}
            handleClose={handleClose}
            handleOpen={handleOpen}
            openButton={!buttonIcon
                ?
                <Button variant="contained" color="primary" onClick={handleOpen}  >{buttonLabel}</Button>
                :
                <Button
                    style={{ display: "flex", gap: "16px", background: "none", border: "none", cursor: "pointer", margin: 0, padding: 0 }}
                    onClick={handleOpen}
                >
                    {buttonIcon}{buttonLabel}
                </Button>
            }

            okButton={
                tabValue === 0 ? (
                    <Button type="submit" variant="outlined" color="primary" onClick={handleTransactionSubmit} disabled={isPending}>
                        Adicionar
                    </Button>
                ) : (
                    <LoadingButton
                        variant="contained"
                        onClick={handleTransferSubmit}
                        loading={transferMutation.isPending}
                        disabled={!isTransferValid || !allEnvelopes || allEnvelopes.length === 0}
                    >
                        Transferir
                    </LoadingButton>
                )
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
                    {tabValue === 0 ? "Transação" : "Transferência"}
                </Typography>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="transaction tabs">
                        <Tab label="Transação" />
                        <Tab label="Transferência" disabled={!allEnvelopes || allEnvelopes.length <= 1} />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
                        {error && <p>{error.message}</p>}
                        <TextField
                            fullWidth
                            name="description"
                            label="Descrição"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onBlur={validateDescription}
                            error={!!errorDescription}
                            helperText={errorDescription ?? ""}
                        />
                        <TextField
                            fullWidth
                            type="number"
                            name="amount"
                            label="Valor"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            onBlur={validateAmount}
                            error={!!errorAmount}
                            helperText={errorAmount ?? ""}
                            slotProps={{
                                input: {
                                    inputMode: "numeric",
                                }
                            }}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                sx={{ width: "100%" }}
                                name="date"
                                label="Data do Pagamento"
                                value={date}
                                onChange={(newValue) => setDate(newValue)}
                                format="DD/MM/YYYY"
                            />
                        </LocalizationProvider>
                        <FormControl fullWidth>
                            <InputLabel id="payment-method-select-label">Método de Pagamento</InputLabel>
                            <Select
                                labelId="payment-method-select-label"
                                id="payment-method-select"
                                label="Método de Pagamento"
                                sx={{ width: "100%" }}
                                name="paymentMethod"
                                value={paymentMethod}
                                onChange={handleSelectChange}
                            >
                                {allPaymentMethod.map((f, index) => (
                                    <MenuItem key={index} value={f}>{f}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Stack spacing={3} sx={{ width: '100%' }}>
                        {sourceEnvelope && (
                            <Box sx={{ bgcolor: 'background.neutral', p: 2, borderRadius: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    De:
                                </Typography>
                                <Typography variant="h6">
                                    {sourceEnvelope.name}
                                </Typography>
                                <Typography variant="body2" color={(sourceEnvelope.amount ?? 0) < 0 ? 'error.main' : 'success.main'}>
                                    Saldo atual: {fCurrency(sourceEnvelope.amount || 0)}
                                </Typography>
                            </Box>
                        )}

                        <TextField
                            select
                            label="Para Envelope"
                            fullWidth
                            value={toEnvelopeId}
                            onChange={(e) => setToEnvelopeId(e.target.value)}
                            disabled={!allEnvelopes || destinationEnvelopes.length === 0}
                        >
                            {destinationEnvelopes.map((env) => (
                                <MenuItem key={env.id} value={env.id}>
                                    {env.name} ({fCurrency(env.amount || 0)})
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Valor"
                            type="number"
                            fullWidth
                            value={transferAmount}
                            onChange={(e) => {
                                setTransferAmount(e.target.value);
                                setTransferError(null);
                            }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                            }}
                            error={!!transferError}
                            helperText={transferError}
                        />
                    </Stack>
                </TabPanel>

            </Box >
        </TransitionsModal>
    );
}
