import { Box, Button, Divider, FormControl, Grid2, IconButton, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Stack, styled, Switch, TextField, Typography, useTheme } from '@mui/material';
import { startTransition, useActionState, useCallback, useEffect, useImperativeHandle, useRef, useState, useTransition } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import TransitionsModal from 'src/sections/shared/transitionsModal';
import { useSnackbar, VariantType } from 'notistack';
import GoalsService, { Goals, GoalsPost } from 'src/services/implementation/GoalsService';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { type } from 'os';
import { Envelope } from 'src/services/implementation/EnvelopesService';
import { AntSwitch } from './AntSwitch';

type GoalsFormProps = {
    buttonIcon?: React.ReactNode;
    buttonLabel: string;
    data?: Goals;
}


const salary = 10000;
const envelopePercentagem = 10;

export function GoalsForm({ buttonLabel, buttonIcon, data }: GoalsFormProps) {
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();

    const [monthYear, setMonthYear] = useState(false);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [description, setDescription] = useState(data ? data.description : '');
    const [amount, setAmount] = useState(data ? data.amount : '');
    const [amountTotal, setAmountTotal] = useState(data ? data.amountTotal : '');
    const [percentage, setPercentage] = useState(data ? data.percentage : '');
    const [deadline, setDeadline] = useState(data ? data.deadline : '');

    const [save, setSave] = useState(0);
    const [savePercentagem, setSavePercentagem] = useState(0);
    const [salaryIdeal, setSalaryIdeal] = useState(0);

    const [errorDescription, setErrorDescription] = useState<string | null>(null);
    const [errorAmount, setErrorAmount] = useState<string | null>(null);
    const [errorAmountTotal, setErrorAmountTotal] = useState<string | null>(null);
    const [errorDeadline, setErrorDeadline] = useState<string | null>(null);
    const [errorPercentage, setErrorPercentage] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ['goals'] });
    };
    const clearForm = () => {
        setDescription('')
        setAmount('')
        setAmountTotal('')
        setPercentage('')
    };




    const [error, submitAction, isPending] = useActionState(
        async (previousState: any, goals: GoalsPost) => {
            if (data) {

                const errorPostIncomes = await GoalsService.update({
                    id: data.id,
                    description: goals.description,
                    amount: goals.amount,
                    amountTotal: goals.amountTotal,
                    percentage: goals.percentage,
                    deadline: goals.deadline,
                    monthYear: goals.monthYear,
                });

                if (!errorPostIncomes) {
                    return errorPostIncomes;
                }
                enqueueSnackbar('Meta editada com sucesso!', { autoHideDuration: 3000, variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'bottom' } });

            } else {

                const errorPostIncomes = await GoalsService.create({
                    description: goals.description,
                    amount: goals.amount,
                    amountTotal: goals.amountTotal,
                    percentage: goals.percentage,
                    deadline: goals.deadline,
                    monthYear: goals.monthYear,
                });

                if (!errorPostIncomes) {
                    return errorPostIncomes;
                }
                enqueueSnackbar('Meta cadastrada com sucesso!', { autoHideDuration: 3000, variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'bottom' } });


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
                    description,
                    amount,
                    amountTotal,
                    percentage: savePercentagem.toFixed(),
                    deadline,
                    monthYear
                });
            });
        }
    };


    const calculatePercentage = useCallback((deadlineDate: string, monthOrYear: boolean, total: string, inicial: string): void => {
        const months = monthOrYear ? Number(deadlineDate) : Number(deadlineDate) * 12;
        const realTotal = Number(total) - Number(inicial);
        const envelopeBudget = (salary * envelopePercentagem) / 100;

        if (months > 0) {
            setSave(realTotal / months)
            setSavePercentagem((((realTotal / months) / envelopeBudget) * 100))
            setSalaryIdeal((realTotal / months * 100) / envelopePercentagem)
        }
    }, []);

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
        calculatePercentage(deadline, monthYear, amountTotal, amount);
        return true;
    }, [deadline, amountTotal, monthYear, amount, calculatePercentage]);


    const validateAmountTotal = useCallback(() => {
        if (!amountTotal.trim()) {
            setErrorAmountTotal('Valor é obrigatório.');
            return false;
        }

        if (Number.isNaN(Number(amountTotal))) {
            setErrorAmountTotal('Valor total deve ser numérico.');
            return false;
        }
        setErrorAmountTotal(null);
        calculatePercentage(deadline, monthYear, amountTotal, amount);
        return true;
    }, [deadline, amountTotal, monthYear, amount, calculatePercentage]);

    const validateDeadline = useCallback(() => {
        if (!deadline.trim()) {
            setErrorDeadline('Para quando é obrigatório.');
            return false;
        }

        if (Number.isNaN(Number(deadline))) {
            setErrorDeadline('Para quando deve ser numérico.');
            return false;
        }
        setErrorDeadline(null);
        calculatePercentage(deadline, monthYear, amountTotal, amount);
        return true;
    }, [deadline, amountTotal, monthYear, amount, calculatePercentage]);

    const getMonthYearLabel = useCallback((): string | null => {

        if (monthYear && Number(deadline) === 1) { return 'Mês' }
        if (monthYear && Number(deadline) > 1) { return 'Meses' }
        if (!monthYear && Number(deadline) === 1) { return 'Ano' }
        if (!monthYear && Number(deadline) > 1) { return 'Anos' }
        return null
    }, [monthYear, deadline]);







    return (

        <TransitionsModal
            width={60}
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

            okButton={<Button type='submit' variant='outlined' color='primary' onClick={handleSubmit} disabled={isPending} >Salvar</Button>
            }>
            <Box
                gap={1.5}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifySelf="center"
                sx={{ width: '100%', my: 2, mx: 0 }}
            >




                {error && <p>{error}</p>}

                <Typography variant="h3" noWrap >
                    Nova Meta
                </Typography>
                <Box
                    gap={1.5}
                    display="flex"
                    flexDirection="column"
                    alignItems="stretch"
                    justifyContent="space-between"
                    justifySelf="center"
                    sx={{ width: '100%' }}
                >
                    <Box
                        gap={1.5}
                        display="flex"
                        flexDirection="row"
                        sx={{ m: 2 }}
                    >
                        <TextField
                            fullWidth
                            name="description"
                            label="Qual sua meta"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onBlur={validateDescription}
                            sx={{ mb: 3 }}
                            error={!!errorDescription}
                            helperText={errorDescription ?? ''} /><TextField
                            fullWidth
                            type="number"
                            name="amountTotal"
                            label="De quanto precisa"
                            value={amountTotal}
                            onChange={(e) => setAmountTotal(e.target.value)}
                            onBlur={validateAmountTotal}
                            sx={{ mb: 3 }}
                            error={!!errorAmountTotal}
                            helperText={errorAmountTotal ?? ''}
                            slotProps={{
                                input: {
                                    inputMode: 'numeric',
                                }
                            }} />

                        <TextField
                            fullWidth
                            type="number"
                            name="amount"
                            label="Quanto você já tem"
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
                            }} />
                        <TextField
                            fullWidth
                            type="number"
                            name="deadline"
                            label="Em quanto tempo"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            onBlur={validateDeadline}
                            sx={{ mb: 3 }}
                            error={!!errorDeadline}
                            helperText={errorDeadline ?? ''}
                            slotProps={{
                                input: {
                                    inputMode: 'numeric',
                                    endAdornment: (
                                        deadline ?
                                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                                                <AntSwitch checked={monthYear} inputProps={{ 'aria-label': 'ant design' }} onChange={() => { setMonthYear(!monthYear); calculatePercentage(deadline, monthYear, amountTotal, amount) }} />
                                                <Typography>{getMonthYearLabel()}</Typography>
                                            </Stack>
                                            :
                                            <></>
                                    )
                                }
                            }}
                        />

                    </Box>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        sx={{
                            width: '100%',
                            height: "100%"

                        }}
                    >

                        <Typography variant="body1" noWrap >
                            Recomendação
                        </Typography>
                        {salaryIdeal > salary ? <Typography variant="body1" color={theme.palette.error.main}>Essa meta não é viável com sua renda atual.</Typography> : <></>}
                        <Box sx={{ width: '100%', p: 2 }}
                            display="flex"
                            flexDirection="row">
                            <Box sx={{ flex: 1, m: 1 }} >
                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 2,
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: theme.palette.getContrastText(theme.palette.primary.main),
                                        background: theme.palette.primary.main
                                    }}
                                >
                                    <Typography>Você deve guardar R$ {save.toFixed(2)} por mês</Typography>
                                </Paper>
                            </Box>
                            <Box sx={{ flex: 1, m: 1 }} >

                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 2,
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: theme.palette.background.paper
                                    }}
                                >
                                    <Typography>Isso representa {savePercentagem.toFixed(2)}% do seu envelope</Typography>
                                </Paper>

                            </Box>
                            <Box sx={{ flex: 1, m: 1 }} >
                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 2,
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: theme.palette.background.paper
                                    }}
                                >
                                    <Typography>Sua renda deve ser de R$ {salaryIdeal.toFixed(2)}</Typography>
                                </Paper>
                            </Box>
                        </Box>



                    </Box >
                </Box >
            </Box >
        </TransitionsModal >
    );
}
