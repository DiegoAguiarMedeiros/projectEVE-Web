import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import { startTransition, useActionState, useCallback, useEffect, useImperativeHandle, useRef, useState, useTransition } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import TransitionsModal from 'src/sections/shared/transitionsModal';
import { useSnackbar, VariantType } from 'notistack';
import InvestmentsService,{ Investments, InvestmentsPost, InvestmentsType } from 'src/services/implementation/InvestmentsService';

type InvestmentsFormProps = {
    buttonIcon?: React.ReactNode;
    buttonLabel: string;
    data?: Investments
}

export function InvestmentsForm({ buttonLabel, buttonIcon, data }: InvestmentsFormProps) {
    const { enqueueSnackbar } = useSnackbar();

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [description, setDescription] = useState(data ? data.description : '');
    const [amount, setAmount] = useState(data ? data.amount : '');
    const [profitability, setProfitability] = useState(data ? data.profitability : '');
    const [applicationDate, setApplicationDate] = useState(data ? data.applicationDate : '');
    const [maturityDate, setMaturityDate] = useState(data ? data.maturityDate : '');
    const [type, setType] = useState<InvestmentsType | null>(data ? data.type : null);

    const [errorDescription, setErrorDescription] = useState<string | null>(null);
    const [errorAmount, setErrorAmount] = useState<string | null>(null);
    const [errorProfitability, setErrorProfitability] = useState<string | null>(null);
    const [errorApplicationDate, setErrorApplicationDate] = useState<string | null>(null);
    const [errorMaturityDate, setErrorMaturityDate] = useState<string | null>(null);
    const [errorType, setErrorType] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ['investments'] });
    };
    const clearForm = () => {
        setDescription('')
        setAmount('')
        setProfitability('')
        setApplicationDate('')
        setMaturityDate('')
        setType(null)
    };




    const [error, submitAction, isPending] = useActionState(
        async (previousState: any, investments: InvestmentsPost) => {
            if (data) {

                const errorPostIncomes = await InvestmentsService.update({
                    id: data.id,
                    description: investments.description,
                    amount: investments.amount,
                    profitability: investments.profitability,
                    type: investments.type,
                    applicationDate: investments.applicationDate,
                    maturityDate: investments.maturityDate,
                    status: 'active'
                });

                if (!errorPostIncomes) {
                    return errorPostIncomes;
                }
                enqueueSnackbar('Investimento editado com sucesso!', { autoHideDuration: 3000, variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'bottom' } });

            } else {

                const errorPostIncomes = await InvestmentsService.create({
                    description: investments.description,
                    amount: investments.amount,
                    type: investments.type,
                    profitability: investments.profitability,
                    applicationDate: investments.applicationDate,
                    maturityDate: investments.maturityDate,
                    status: 'active'
                });

                if (!errorPostIncomes) {
                    return errorPostIncomes;
                }
                enqueueSnackbar('Investimento cadastrado com sucesso!', { autoHideDuration: 3000, variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'bottom' } });


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
                    type: type,
                    profitability: profitability,
                    applicationDate: applicationDate,
                    maturityDate: maturityDate,
                    status: 'active'
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
                    Cartão de Crédito
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
            </Box >
        </TransitionsModal>
    );
}
