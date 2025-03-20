import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { startTransition, useActionState, useCallback, useEffect, useImperativeHandle, useRef, useState, useTransition } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import TransitionsModal from 'src/sections/shared/transitionsModal';
import { useSnackbar, VariantType } from 'notistack';
import InvestmentsService, { allInvestmentsName, allInvestmentsType, Investments, InvestmentsPost, InvestmentsType } from 'src/services/implementation/InvestmentsService';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

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
    const [applicationDate, setApplicationDate] = useState<Dayjs | null>(data ? dayjs(data.applicationDate) : null);
    const [maturityDate, setMaturityDate] = useState<Dayjs | null>(data ? dayjs(data.maturityDate) : null);
    const [type, setType] = useState<InvestmentsType | undefined>(data ? data.type : undefined);

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
        setApplicationDate(null)
        setMaturityDate(null)
        setType(undefined)
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
                    type,
                    profitability,
                    applicationDate,
                    maturityDate,
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

    const validateProfitability = useCallback(() => {
        if (!profitability.trim()) {
            setErrorProfitability('Rentabilidade é obrigatório.');
            return false;
        }

        if (Number.isNaN(Number(profitability))) {
            setErrorProfitability('Rentabilidade deve ser numérico.');
            return false;
        }
        setErrorProfitability(null);
        return true;
    }, [profitability]);


    const handleSelectChange = (event: SelectChangeEvent<InvestmentsType>) => {
        setType(event.target.value as InvestmentsType);
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
                    Investimentos
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
                    name="profitability"
                    label="Rentabilidade"
                    value={profitability}
                    onChange={(e) => setProfitability(e.target.value)}
                    onBlur={validateProfitability}
                    sx={{ mb: 3 }}
                    error={!!errorProfitability}
                    helperText={errorProfitability ?? ''}
                    slotProps={{
                        input: {
                            inputMode: 'numeric',
                        }
                    }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        sx={{ width: '100%', mb: 3 }}
                        name="applicationDate"
                        label="Data da aplicação"
                        value={applicationDate}
                        onChange={(newValue) => setApplicationDate(newValue)}
                        format="DD/MM/YYYY"
                    />
                    <DatePicker
                        sx={{ width: '100%', mb: 3 }}
                        name="maturityDate"
                        label="Data de resgate"
                        value={maturityDate}
                        onChange={(newValue) => setMaturityDate(newValue)}
                        format="DD/MM/YYYY"
                    />
                </LocalizationProvider>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Tipo"
                        sx={{ width: '100%', mb: 3 }}
                        name="type"
                        value={type}
                        onChange={handleSelectChange}
                    >
                        {allInvestmentsType.map((t) => (
                            <MenuItem value={t}>{allInvestmentsName[t]}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box >
        </TransitionsModal>
    );
}
