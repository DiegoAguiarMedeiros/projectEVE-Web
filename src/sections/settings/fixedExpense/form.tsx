import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { startTransition, useActionState, useCallback, useEffect, useImperativeHandle, useRef, useState, useTransition } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import TransitionsModal from 'src/sections/shared/transitionsModal';
import { useSnackbar, VariantType } from 'notistack';
import FixedExpensesService, { FixedExpenses, FixedExpensesPost } from 'src/services/implementation/FixedExpensesService';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { type } from 'os';
import { Envelope } from 'src/services/implementation/EnvelopesService';

type FixedExpenseFormProps = {
    buttonIcon?: React.ReactNode;
    buttonLabel: string;
    data?: FixedExpenses;
    envelopes: Envelope[]
}

export function FixedExpenseForm({ buttonLabel, buttonIcon, data ,envelopes}: FixedExpenseFormProps) {
    const { enqueueSnackbar } = useSnackbar();

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [description, setDescription] = useState(data ? data.description : '');
    const [amount, setAmount] = useState(data ? data.amount : '');
    const [paymentDay, setPaymentDay] = useState(data ? data.paymentDay : '');
    const [envelope, setEnvelope] = useState(data ? data.envelopeId : '');

    const [errorDescription, setErrorDescription] = useState<string | null>(null);
    const [errorAmount, setErrorAmount] = useState<string | null>(null);
    const [errorPaymentDay, setErrorPaymentDay] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ['fixed-expense'] });
    };
    const clearForm = () => {
        setDescription('')
        setAmount('')
        setPaymentDay('')
        setEnvelope('')
    };




    const [error, submitAction, isPending] = useActionState(
        async (previousState: any, fixedExpense: FixedExpensesPost) => {
            if (data) {

                const errorPostIncomes = await FixedExpensesService.update({
                    id: data.id,
                    envelopeId: fixedExpense.envelopeId,
                    description: fixedExpense.description,
                    amount: fixedExpense.amount,
                    paymentDay: fixedExpense.paymentDay,
                });

                if (!errorPostIncomes) {
                    return errorPostIncomes;
                }
                enqueueSnackbar('Contas Fixas editada com sucesso!', { autoHideDuration: 3000, variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'bottom' } });

            } else {

                const errorPostIncomes = await FixedExpensesService.create({
                    description: fixedExpense.description,
                    amount: fixedExpense.amount,
                    paymentDay: fixedExpense.paymentDay,
                    envelopeId: fixedExpense.envelopeId,
                });

                if (!errorPostIncomes) {
                    return errorPostIncomes;
                }
                enqueueSnackbar('Contas Fixas cadastrada com sucesso!', { autoHideDuration: 3000, variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'bottom' } });


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
                await submitAction({
                    description, amount,
                    paymentDay,
                    envelopeId: envelope,
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

    const validatePaymentDay = useCallback(() => {
        const day = Number(paymentDay);
        if (!paymentDay.trim()) {
            setErrorPaymentDay('Dia do pagamento é obrigatório.');
            return false;
        }
        if (Number.isNaN(day) || day < 1 || day > 31) {
            setErrorPaymentDay('O dia do pagamento deve estar entre 1 e 31.');
            return false;
        }
        setErrorPaymentDay(null);
        return true;
    }, [paymentDay]);


    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        setEnvelope(event.target.value);
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
                    Contas Fixas
                </Typography>
                {error && <p>{error}</p>}

                <FormControl fullWidth>
                    <InputLabel id="evenlope-id-select-label">Envelope</InputLabel>
                    <Select
                        labelId="evenlope-id-select-label"
                        id="evenlope-id-select"
                        label="Envelope"
                        sx={{ width: '100%', mb: 3 }}
                        name="envelope"
                        value={envelope}
                        onChange={handleSelectChange}
                    >
                        {envelopes.map((t,index) => (
                            <MenuItem key={index} value={t.id}>{t.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>


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

                <TextField
                    fullWidth
                    type="number"
                    name="paymentDay"
                    label="Dia do pagamento"
                    value={paymentDay}
                    onChange={(e) => setPaymentDay(e.target.value)}
                    onBlur={validatePaymentDay}
                    sx={{ mb: 3 }}
                    error={!!errorPaymentDay}
                    helperText={errorPaymentDay ?? ''}
                    slotProps={{
                        input: {
                            inputMode: 'numeric',
                            "aria-valuemin": 1,
                            "aria-valuemax": 31,
                        }
                    }}
                />

            </Box >
        </TransitionsModal>
    );
}
