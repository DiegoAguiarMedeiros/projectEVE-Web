import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography, Tabs, Tab, Stack, InputAdornment, Tooltip } from "@mui/material";
import { Iconify } from "src/components/iconify";
import { RealEnvelopesCard } from "src/sections/envelope/RealEnvelopeCard";
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
import { useTranslation } from "react-i18next";

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
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`transaction-tabpanel-${index}`}
            aria-labelledby={`transaction-tab-${index}`}
            sx={{ width: '100%' }}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </Box>
    );
}

const paymentMethodIcons: Record<PaymentMethod, React.ReactNode> = {
    'envelope.transaction.payment_method.CreditCard': <Iconify icon="solar:card-outline" />,
    'envelope.transaction.payment_method.DebitCard': <Iconify icon="solar:card-2-outline" />,
    'envelope.transaction.payment_method.Cash': <Iconify icon="solar:wad-of-money-outline" />,
    'envelope.transaction.payment_method.BankTransfer': <Iconify icon="solar:bank-note-outline" />,
    'envelope.transaction.payment_method.Pix': <Iconify icon="solar:qr-code-outline" />,
    'envelope.transaction.payment_method.Reallocation': <Iconify icon="solar:transfer-outline" />,
    "envelope.transaction.payment_method.Ticket": <Iconify icon="solar:ticket-outline" />,
};

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
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(data ? data.paymentMethod : "envelope.transaction.payment_method.DebitCard");
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
                    status: "transaction.status.pending",
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

    const { t } = useTranslation();

    const paymentMethodLabels: Record<PaymentMethod, string> = {
        "envelope.transaction.payment_method.CreditCard": t('common.payment_method.credit_card'),
        "envelope.transaction.payment_method.DebitCard": t('common.payment_method.debit_card'),
        "envelope.transaction.payment_method.Cash": t('common.payment_method.cash'),
        "envelope.transaction.payment_method.BankTransfer": t('common.payment_method.bank_transfer'),
        "envelope.transaction.payment_method.Pix": t('common.payment_method.pix'),
        "envelope.transaction.payment_method.Reallocation": t('common.payment_method.reallocation'),
        "envelope.transaction.payment_method.Ticket": t('common.payment_method.ticket')
    };

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
                <Button variant="contained" color="primary" onClick={handleOpen}>{buttonLabel}</Button>
                :
                <Button
                    style={{ display: "flex", gap: "16px", background: "none", border: "none", cursor: "pointer", margin: 0, padding: 0 }}
                    onClick={handleOpen}
                >
                    {buttonIcon}{buttonLabel === 'Adicionar' ? t('common.add') : buttonLabel}
                </Button>
            }

            okButton={
                tabValue === 0 ? (
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={handleTransactionSubmit}
                        disabled={isPending}
                        loading={isPending}
                    >
                        {t('common.add')}
                    </LoadingButton>
                ) : (
                    <Tooltip title={!isTransferValid ?
                        (!toEnvelopeId ? t('envelope.validation.select_target') :
                            !transferAmount ? t('envelope.validation.enter_amount') :
                                Number(transferAmount) > (sourceEnvelope?.amount || 0) ? t('envelope.validation.insufficient_funds') : '')
                        : ''
                    }>
                        <span>
                            <LoadingButton
                                variant="contained"
                                onClick={handleTransferSubmit}
                                loading={transferMutation.isPending}
                                disabled={!isTransferValid || !allEnvelopes || allEnvelopes.length === 0}
                            >
                                {t('common.transfer')}
                            </LoadingButton>
                        </span>
                    </Tooltip>
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
                <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%', mb: 3 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="transaction tabs"
                        variant="fullWidth"
                        sx={{
                            '& .MuiTab-root': {
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                color: 'text.secondary',
                                textTransform: 'none',
                                py: 2,
                            },
                            '& .Mui-selected': {
                                color: 'primary.main',
                            },
                            '& .MuiTabs-indicator': {
                                height: 3,
                                borderRadius: '3px 3px 0 0',
                            },
                        }}
                    >
                        <Tab label={t('envelope.transaction.tabs.transaction')} />
                        <Tab label={t('envelope.transaction.tabs.transfer')} disabled={!allEnvelopes || allEnvelopes.length <= 1} />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
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
                        <TextField
                            fullWidth
                            type="number"
                            name="amount"
                            label={t('envelope.transaction.amount')}
                            placeholder={t('envelope.transaction.placeholder.amount')}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            onBlur={validateAmount}
                            error={!!errorAmount}
                            helperText={errorAmount ?? ""}
                            slotProps={{
                                input: {
                                    inputMode: "numeric",
                                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                    sx: { textAlign: 'right' },
                                }
                            }}
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
                                {allPaymentMethod.map((f, index) => (
                                    <MenuItem key={index} value={f}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            {paymentMethodIcons[f]}
                                            <span>{paymentMethodLabels[f]}</span>
                                        </Stack>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Stack spacing={4} sx={{ width: '100%', alignItems: 'center' }}>

                        {/* Transfer Cards Layout */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                            width: '100%',
                            flexDirection: { xs: 'column', sm: 'row' }
                        }}>
                            {/* Source Envelope */}
                            <Box sx={{ flex: 1, width: '100%', maxWidth: 240 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', textAlign: 'center' }}>De</Typography>
                                {sourceEnvelope && <RealEnvelopesCard envelope={sourceEnvelope} activeCard={false} />}
                            </Box>

                            {/* Arrow Icon */}
                            <Iconify icon="solar:arrow-right-username-bold-duotone" width={32} sx={{ color: 'text.disabled', transform: { xs: 'rotate(90deg)', sm: 'none' } }} />

                            {/* Destination Envelope Selector */}
                            <Box sx={{ flex: 1, width: '100%', maxWidth: 286 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', textAlign: 'center' }}>Para</Typography>
                                <FormControl fullWidth>
                                    <Select
                                        value={toEnvelopeId}
                                        onChange={(e) => setToEnvelopeId(e.target.value)}
                                        displayEmpty
                                        renderValue={(selected) => {
                                            if (!selected) {
                                                return <Typography color="text.disabled" align="center">Selecione o envelope</Typography>;
                                            }
                                            const env = destinationEnvelopes.find(e => e.id === selected);
                                            return env ? (
                                                <Box sx={{ width: '100%', pointerEvents: 'none', minHeight: 110 }}>
                                                    <RealEnvelopesCard envelope={env} activeCard={false} />
                                                </Box>
                                            ) : selected;
                                        }}
                                        sx={{
                                            width: '100%',
                                            '& .MuiSelect-select': {
                                                padding: '0 !important',
                                                minHeight: 'auto',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            },
                                            '& fieldset': { border: 'none' },
                                            // Styles for when no value is selected (Placeholder state)
                                            ...(!toEnvelopeId && {
                                                border: '1px dashed',
                                                borderColor: 'text.disabled',
                                                borderRadius: 2,
                                                minHeight: 130,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }),
                                            // Styles for when a value IS selected
                                            ...(toEnvelopeId && {
                                                '& .MuiSelect-select': {
                                                    overflow: 'visible', // Ensure card isn't clipped
                                                }
                                            })
                                        }}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    maxHeight: 400,
                                                    bgcolor: 'transparent',
                                                    boxShadow: 'none',
                                                    '& .MuiList-root': {
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 1,
                                                        p: 1
                                                    }
                                                }
                                            }
                                        }}
                                    >
                                        {destinationEnvelopes.map((env) => (
                                            <MenuItem
                                                key={env.id}
                                                value={env.id}
                                                sx={{
                                                    p: 0,
                                                    bgcolor: 'transparent !important',
                                                    '&:hover': { transform: 'scale(1.02)' },
                                                    transition: 'transform 0.2s',
                                                    mb: 1
                                                }}
                                            >
                                                <RealEnvelopesCard envelope={env} activeCard={false} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>

                        <TextField
                            fullWidth
                            type="number"
                            label="Valor da transferência"
                            placeholder="0,00"
                            value={transferAmount}
                            onChange={(e) => {
                                setTransferAmount(e.target.value);
                                setTransferError(null);
                            }}
                            error={!!transferError || (Number(transferAmount) > (sourceEnvelope?.amount || 0))}
                            helperText={transferError || (Number(transferAmount) > (sourceEnvelope?.amount || 0) ? "Saldo insuficiente" : "")}
                            slotProps={{
                                input: {
                                    inputMode: "numeric",
                                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                    sx: { textAlign: 'right', color: (Number(transferAmount) > (sourceEnvelope?.amount || 0)) ? 'error.main' : 'inherit' },
                                }
                            }}
                        />
                    </Stack>
                </TabPanel>

            </Box >
        </TransitionsModal>
    );
}
