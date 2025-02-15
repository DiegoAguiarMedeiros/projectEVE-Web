import { Box, Button, TextField, Typography } from '@mui/material';
import { startTransition, useActionState, useCallback, useEffect, useImperativeHandle, useRef, useState, useTransition } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import TransitionsModal from 'src/sections/shared/transitionsModal';
import IncomeService, { IncomesPost } from '../../../services/incomeService'

export function FormIncome() {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentDay, setpaymentDay] = useState('');
    const [errorDescription, setErrorDescription] = useState<string | null>(null);
    const [errorAmount, setErrorAmount] = useState<string | null>(null);
    const [errorpaymentDay, setErrorpaymentDay] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const refreshIncomes = () => {
        queryClient.invalidateQueries({ queryKey: ['incomes'] });
    };
    const clearForm = () => {
        setDescription('')
        setAmount('')
        setpaymentDay('')
    };




    const [error, submitAction, isPending] = useActionState(
        async (previousState: any, incomes: IncomesPost) => {
            console.log("submitAction")
            const errorPostIncomes = await IncomeService.postIncomes({
                description: incomes.description,
                amount: incomes.amount,
                paymentDay: incomes.paymentDay,
            });
            console.log("errorPostIncomes", errorPostIncomes)
            if (!errorPostIncomes) {
                return errorPostIncomes;
            }
            clearForm();
            refreshIncomes();
            handleClose();
            return null;
        },
        null,
    );

    const handleSubmit = async () => {
        if(validateDescription() && validateAmount() && validatepaymentDay()){
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

    const validatepaymentDay = useCallback(() => {
        const day = Number(paymentDay);
        if (!paymentDay.trim()) {
            setErrorpaymentDay('Dia do pagamento é obrigatório.');
            return false;
        }
        if (Number.isNaN(day) || day < 1 || day > 31) {
            setErrorpaymentDay('O dia do pagamento deve estar entre 1 e 31.');
            return false;
        }
        setErrorpaymentDay(null);
        return true;
    }, [paymentDay]);


    return (

        <TransitionsModal
            open={open}
            handleClose={handleClose}
            handleOpen={handleOpen}
            buttonLabel='Adicionar'
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
                    onChange={(e) => setpaymentDay(e.target.value)}
                    onBlur={validatepaymentDay}
                    sx={{ mb: 3 }}
                    error={!!errorpaymentDay}
                    helperText={errorpaymentDay ?? ''}
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
