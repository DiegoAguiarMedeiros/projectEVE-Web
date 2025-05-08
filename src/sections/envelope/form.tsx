import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { startTransition, useActionState, useCallback, useEffect, useImperativeHandle, useRef, useState, useTransition } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import TransitionsModal from 'src/sections/shared/transitionsModal';
import { useSnackbar, VariantType } from 'notistack';
import TransactionService, { allPaymentMethod, PaymentMethod, Transaction, TransactionPost, TransactionStatus } from 'src/services/implementation/TransactionService';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Envelope } from 'src/services/implementation/EnvelopeService';

type TransactionFormProps = {
    buttonIcon?: React.ReactNode;
    buttonLabel: string;
    data?: Transaction;
    envelopeId: string;
}

export function TransactionForm({ buttonLabel, buttonIcon, data, envelopeId }: TransactionFormProps) {
    const { enqueueSnackbar } = useSnackbar();

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [description, setDescription] = useState(data ? data.description : '');
    const [amount, setAmount] = useState(data ? data.amount : '');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(data ? data.paymentMethod : 'DebitCard');
    const [date, setDate] = useState<Dayjs | null>(data ? dayjs(data.date) : null);

    const [errorDescription, setErrorDescription] = useState<string | null>(null);
    const [errorAmount, setErrorAmount] = useState<string | null>(null);
    const [errorInstallmentsTotal, setErrorInstallmentsTotal] = useState<string | null>(null);
    const [errorInstallmentsPaid, setErrorInstallmentsPaid] = useState<string | null>(null);
    const [errorPaymentDay, setErrorPaymentDay] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ['transaction-by-envelope'] });
    };
    const clearForm = () => {
        setDescription('')
        setAmount('')
    };




    const [error, submitAction, isPending] = useActionState(
        async (previousState: any, transaction: TransactionPost) => {
            if (data) {

                const errorPostIncomes = await TransactionService.update({
                    id: data.id,
                    description: transaction.description,
                    amount: transaction.amount,
                    status: data.status,
                    envelope: { id: envelopeId } as Envelope,
                    paymentMethod: transaction.paymentMethod,
                    date: transaction.date,
                    type: 'Debit'
                });

                if (!errorPostIncomes) {
                    return errorPostIncomes;
                }
                enqueueSnackbar('Transação editada com sucesso!', { autoHideDuration: 3000, variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'bottom' } });

            } else {

                const errorPostIncomes = await TransactionService.create({
                    description: transaction.description,
                    amount: transaction.amount,
                    status: transaction.status,
                    envelope: { id: envelopeId } as Envelope,
                    paymentMethod:transaction.paymentMethod,
                    date: transaction.date,
                    type: 'Debit'
                });

                if (!errorPostIncomes) {
                    return errorPostIncomes;
                }
                enqueueSnackbar('Transação cadastrada com sucesso!', { autoHideDuration: 3000, variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'bottom' } });


            }

            clearForm();
            refresh();
            handleClose();
            return null;
        },
        null,
    );

    const handleSubmit = async () => {
        if (validateDescription() && validateAmount()) {
            startTransition(async () => {
                submitAction({
                    description,
                    amount,
                    paymentMethod,
                    status: 'Pending',
                    envelope: { id: envelopeId } as Envelope,
                    date,
                    type: 'Debit',
                });
            });
        }
    };

    const validateDescription = useCallback(() => {
        if (!description.trim()) {
            setErrorDescription('Descrição é obrigatória.');
            return false;
        }
        setErrorDescription(null);
        return true;
    }, [description]);

    const validateAmount = useCallback(() => {
        if (!amount.trim()) {
            setErrorAmount('Valor é obrigatório.');
            return false;
        }

        if (Number.isNaN(Number(amount))) {
            setErrorAmount('Valor deve ser numérico.');
            return false;
        }
        setErrorAmount(null);
        return true;
    }, [amount]);

    const handleSelectChange = (event: SelectChangeEvent<PaymentMethod>) => {
        setPaymentMethod(event.target.value as PaymentMethod);
    };


    return (

        <TransitionsModal
            open={open}
            handleClose={handleClose}
            handleOpen={handleOpen}
            openButton={!buttonIcon
                ?
                <Button variant='contained' color='primary' onClick={handleOpen}  >{buttonLabel}</Button>
                :
                <Button
                    style={{ display: 'flex', gap: '16px', background: 'none', border: 'none', cursor: 'pointer', margin: 0, padding: 0 }}
                    onClick={handleOpen}
                >
                    {buttonIcon}{buttonLabel}
                </Button>
            }

            okButton={<Button type='submit' variant='outlined' color='primary' onClick={handleSubmit} disabled={isPending} >Adicionar</Button>
            }>
            <Box
                gap={1.5}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifySelf="center"
                sx={{ width: '100%' }}
            >


                <Typography variant="h3" noWrap>
                    Transação
                </Typography>
                {error && <p>{error}</p>}
                <TextField
                    fullWidth
                    name="description"
                    label="Descrição"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={validateDescription}
                    sx={{ mb: 3 }}
                    error={!!errorDescription}
                    helperText={errorDescription ?? ''}
                />
                <TextField
                    fullWidth
                    type="number"
                    name="amount"
                    label="Valor"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onBlur={validateAmount}
                    sx={{ mb: 3 }}
                    error={!!errorAmount}
                    helperText={errorAmount ?? ''}
                    slotProps={{
                        input: {
                            inputMode: 'numeric',
                        }
                    }}
                />
                <FormControl fullWidth>
                    <InputLabel id="payment-method-select-label">Método de Pagamento</InputLabel>
                    <Select
                        labelId="payment-method-select-label"
                        id="payment-method-select"
                        label="Método de Pagamento"
                        sx={{ width: '100%', mb: 3 }}
                        name="paymentMethod"
                        value={paymentMethod}
                        onChange={handleSelectChange}
                    >
                        {allPaymentMethod.map((f) => (
                            <MenuItem value={f}>{f}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        sx={{ width: '100%', mb: 3 }}
                        name="date"
                        label="Data do Pagamento"
                        value={date}
                        onChange={(newValue) => setDate(newValue)}
                        format="DD/MM/YYYY"
                    />
                </LocalizationProvider>
            </Box >
        </TransitionsModal>
    );
}
