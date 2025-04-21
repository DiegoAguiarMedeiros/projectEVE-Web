import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import { startTransition, useActionState, useCallback, useEffect, useImperativeHandle, useRef, useState, useTransition } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import TransitionsModal from 'src/sections/shared/transitionsModal';
import IncomeService, { Income, IncomePost } from 'src/services/implementation/incomeService'
import { useSnackbar, VariantType } from 'notistack';

type FormIncomeProps = {
    buttonIcon?: React.ReactNode;
    buttonLabel: string;
    data?: Income
}

export function FormIncome({ buttonLabel, buttonIcon, data }: FormIncomeProps) {
    const { enqueueSnackbar } = useSnackbar();

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [description, setDescription] = useState(data ? data.description : '');
    const [amount, setAmount] = useState(data ? data.amount : '');
    const [paymentDay, setPaymentDay] = useState(data ? data.paymentDay : '');
    const [errorDescription, setErrorDescription] = useState<string | null>(null);
    const [errorAmount, setErrorAmount] = useState<string | null>(null);
    const [errorPaymentDay, setErrorPaymentDay] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const refreshIncome = () => {
        queryClient.invalidateQueries({ queryKey: ['income'] });
    };
    const clearForm = () => {
        setDescription('')
        setAmount('')
        setPaymentDay('')
    };




    const [error, submitAction, isPending] = useActionState(
        async (previousState: any, incomes: IncomePost) => {

            if (data) {

                const errorPostIncome = await IncomeService.update({
                    id: data.id,
                    description: incomes.description,
                    amount: incomes.amount,
                    paymentDay: incomes.paymentDay,
                });

                if (!errorPostIncome) {
                    return errorPostIncome;
                }
                enqueueSnackbar('Salário editado com sucesso!', { autoHideDuration: 3000, variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'bottom' } });

            } else {

                const errorPostIncome = await IncomeService.create({
                    description: incomes.description,
                    amount: incomes.amount,
                    paymentDay: incomes.paymentDay,
                });

                if (!errorPostIncome) {
                    return errorPostIncome;
                }
                enqueueSnackbar('Salário cadastrado com sucesso!', { autoHideDuration: 3000, variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'bottom' } });


            }

            clearForm();
            refreshIncome();
            handleClose();
            return null;
        },
        null,
    );

    const handleSubmit = async () => {
        if (validateDescription() && validateAmount() && validatePaymentDay()) {
            startTransition(async () => {
                await submitAction({ description, amount, paymentDay });
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
                    Salário
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
