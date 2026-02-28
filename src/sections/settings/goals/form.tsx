import { Box, Button, Divider, Grid2, Paper, Stack, TextField, Typography, useTheme } from "@mui/material";
import { CurrencyInput } from "src/components/CurrencyInput";
import { useCallback, useEffect, useState } from "react";
import TransitionsModal from "src/sections/shared/transitionsModal";
import { AntSwitch } from "src/sections/settings/goals/AntSwitch";
import { useCreateGoals } from "src/hooks/mutations/goals/useCreateGoals";
import { useUpdateGoals } from "src/hooks/mutations/goals/useUpdateGoals";
import { Goals, GoalsPost } from "src/types/Goals";
import { IncomeStore } from "src/store/useIncomeStore";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";


type GoalsFormProps = {
    buttonIcon?: React.ReactNode;
    buttonLabel: string;
    data?: Goals;
    envelope: Envelopes;
    externalOpen?: boolean;
    onExternalClose?: () => void;
}

export function GoalsForm({ buttonLabel, buttonIcon, data, envelope, externalOpen, onExternalClose }: GoalsFormProps) {
    const { t } = useTranslation();
    const theme = useTheme();

    const { income } = IncomeStore()

    const [monthYear, setMonthYear] = useState(false);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        clearForm();
        setOpen(false);
        onExternalClose?.();
    };

    useEffect(() => {
        if (externalOpen) setOpen(true);
    }, [externalOpen]);

    const [description, setDescription] = useState(data ? data.description : "");
    const [amount, setAmount] = useState(data ? data.amount : "");
    const [amountTotal, setAmountTotal] = useState(data ? data.amountTotal : "");
    const [percentage, setPercentage] = useState(data ? data.percentage : "");
    const [deadline, setDeadline] = useState(data ? data.deadline : "");

    const [save, setSave] = useState(0);
    const [savePercentagem, setSavePercentagem] = useState(0);
    const [salaryIdeal, setSalaryIdeal] = useState(0);

    const [errorDescription, setErrorDescription] = useState<string | null>(null);
    const [errorAmount, setErrorAmount] = useState<string | null>(null);
    const [errorAmountTotal, setErrorAmountTotal] = useState<string | null>(null);
    const [errorDeadline, setErrorDeadline] = useState<string | null>(null);
    const [errorPercentage, setErrorPercentage] = useState<string | null>(null);

    const clearForm = () => {
        setDescription("")
        setAmount("")
        setAmountTotal("")
        setPercentage("")
        setErrorDescription(null)
        setErrorAmount(null)
        setErrorAmountTotal(null)
        setErrorDeadline(null)
        setErrorPercentage(null)
        setError(null)
    };


    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createMutation = useCreateGoals();

    const updateMutation = useUpdateGoals();

    const submitAction = async (goals: GoalsPost) => {
        setIsPending(true);
        setError(null);

        try {
            if (data) {
                await updateMutation.mutateAsync({
                    id: data.id,
                    description: goals.description,
                    amount: goals.amount,
                    amountTotal: goals.amountTotal,
                    percentage: goals.percentage,
                    deadline: goals.deadline,
                    monthYear: goals.monthYear,
                });
            } else {
                await createMutation.mutateAsync({
                    description: goals.description,
                    amount: goals.amount,
                    amountTotal: goals.amountTotal,
                    percentage: goals.percentage,
                    deadline: goals.deadline,
                    monthYear: goals.monthYear,
                });
            }
            clearForm();
            handleClose();
        } catch (err: any) {
            setError(err);
        } finally {
            setIsPending(false);
        }
    };

    const handleSubmit = async () => {
        if (validateDescription() && validateAmount()) {
            await submitAction({
                description,
                amount,
                amountTotal,
                percentage: savePercentagem.toFixed(),
                deadline,
                monthYear
            });
        }
    };


    const calculatePercentage = useCallback((deadlineDate: string, monthOrYear: boolean, total: string, inicial: string): void => {
        const months = monthOrYear ? Number(deadlineDate) : Number(deadlineDate) * 12;
        const realTotal = Number(total) - Number(inicial);
        const envelopeBudget = (income * envelope.percentage) / 100;

        if (months > 0) {
            setSave(realTotal / months)
            setSavePercentagem((((realTotal / months) / envelopeBudget) * 100))

            const salary = (realTotal / months * 100) / envelope.percentage
            setSalaryIdeal((realTotal / months * 100) / envelope.percentage)
        }
    }, [envelope, income]);

    const validateDescription = useCallback(() => {
        if (!description.trim()) {
            setErrorDescription(t('settings.goals.validation.description_required'));
            return false;
        }
        setErrorDescription(null);
        return true;
    }, [description, t]);

    const validateAmount = useCallback(() => {
        if (!amount.trim()) {
            setErrorAmount(t('settings.goals.validation.amount_required'));
            return false;
        }

        if (Number.isNaN(Number(amount))) {
            setErrorAmount(t('settings.goals.validation.amount_numeric'));
            return false;
        }
        setErrorAmount(null);
        calculatePercentage(deadline, monthYear, amountTotal, amount);
        return true;
    }, [deadline, amountTotal, monthYear, amount, calculatePercentage, t]);


    const validateAmountTotal = useCallback(() => {
        if (!amountTotal.trim()) {
            setErrorAmountTotal(t('settings.goals.validation.amount_required'));
            return false;
        }

        if (Number.isNaN(Number(amountTotal))) {
            setErrorAmountTotal(t('settings.goals.validation.amount_total_numeric'));
            return false;
        }
        setErrorAmountTotal(null);
        calculatePercentage(deadline, monthYear, amountTotal, amount);
        return true;
    }, [deadline, amountTotal, monthYear, amount, calculatePercentage, t]);

    const validateDeadline = useCallback(() => {
        if (!deadline.trim()) {
            setErrorDeadline(t('settings.goals.validation.deadline_required'));
            return false;
        }

        if (Number.isNaN(Number(deadline))) {
            setErrorDeadline(t('settings.goals.validation.deadline_numeric'));
            return false;
        }
        setErrorDeadline(null);
        calculatePercentage(deadline, monthYear, amountTotal, amount);
        return true;
    }, [deadline, amountTotal, monthYear, amount, calculatePercentage, t]);

    const getMonthYearLabel = useCallback((): string | null => {

        if (monthYear && Number(deadline) === 1) { return t('settings.goals.time.month') }
        if (monthYear && Number(deadline) > 1) { return t('settings.goals.time.months') }
        if (!monthYear && Number(deadline) === 1) { return t('settings.goals.time.year') }
        if (!monthYear && Number(deadline) > 1) { return t('settings.goals.time.years') }
        return null
    }, [monthYear, deadline, t]);







    return (

        <TransitionsModal
            open={open}
            handleClose={handleClose}
            handleOpen={handleOpen}
            openButton={externalOpen !== undefined
                ? <></>
                : !buttonIcon
                ?
                <Button variant="contained" color="primary" onClick={handleOpen}  >{buttonLabel}</Button>
                :
                <Button
                    style={{ display: "flex", gap: "16px", background: "none", border: "none", cursor: "pointer", margin: 0, padding: 0 }}
                    onClick={handleOpen}
                >
                    {buttonIcon}{buttonLabel === 'common.add' ? t('common.add') : buttonLabel === 'common.edit' ? t('common.edit') : buttonLabel}
                </Button>
            }

            okButton={<Button type="submit" variant="outlined" color="primary" onClick={handleSubmit} disabled={isPending} >{t('settings.goals.save')}</Button>
            }>
            <Box
                gap={1.5}
                display="flex"
                flexDirection="column"
                alignItems="center"
                sx={{ width: "100%", my: 2 }}
            >
                {error && <Typography color="error">{error.message}</Typography>}

                <Typography variant="h5" noWrap>
                    {t('settings.goals.title')}
                </Typography>

                <Grid2 container spacing={2} sx={{ width: "100%" }}>
                    <Grid2 size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            name="description"
                            label={t('settings.goals.description')}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onBlur={validateDescription}
                            error={!!errorDescription}
                            helperText={errorDescription ?? ""}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                        <CurrencyInput
                            fullWidth
                            name="amountTotal"
                            label={t('settings.goals.amount_total')}
                            value={amountTotal}
                            onChange={setAmountTotal}
                            onBlur={validateAmountTotal}
                            error={!!errorAmountTotal}
                            helperText={errorAmountTotal ?? ""}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                        <CurrencyInput
                            fullWidth
                            name="amount"
                            label={t('settings.goals.amount_current')}
                            value={amount}
                            onChange={setAmount}
                            onBlur={validateAmount}
                            error={!!errorAmount}
                            helperText={errorAmount ?? ""}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            type="number"
                            name="deadline"
                            label={t('settings.goals.deadline')}
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            onBlur={validateDeadline}
                            error={!!errorDeadline}
                            helperText={errorDeadline ?? ""}
                            slotProps={{
                                input: {
                                    inputMode: "numeric",
                                    endAdornment: deadline ? (
                                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                            <AntSwitch
                                                checked={!monthYear}
                                                inputProps={{ "aria-label": "ant design" }}
                                                onChange={() => { setMonthYear(!monthYear); calculatePercentage(deadline, !monthYear, amountTotal, amount); }}
                                            />
                                            <Typography noWrap>{getMonthYearLabel()}</Typography>
                                        </Stack>
                                    ) : null,
                                },
                            }}
                        />
                    </Grid2>
                </Grid2>

                <Divider sx={{ width: "100%", my: 1 }} />

                <Typography variant="subtitle1">
                    {t('settings.goals.recommendation.title')}
                </Typography>

                {salaryIdeal > income && (
                    <Typography variant="body2" color="error" sx={{ textAlign: "center" }}>
                        {t('settings.goals.recommendation.unfeasible', { income })}
                    </Typography>
                )}

                <Grid2 container spacing={1.5} sx={{ width: "100%" }}>
                    <Grid2 size={{ xs: 12, sm: 4 }}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 2,
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                color: theme.palette.getContrastText(theme.palette.primary.main),
                                bgcolor: 'primary.main',
                                borderRadius: 2,
                            }}
                        >
                            <Typography variant="body2">{t('settings.goals.recommendation.monthly_save', { amount: save.toFixed(2) })}</Typography>
                        </Paper>
                    </Grid2>
                    <Grid2 size={{ xs: 6, sm: 4 }}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 2,
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                bgcolor: 'background.paper',
                                borderRadius: 2,
                            }}
                        >
                            <Typography variant="body2">{t('settings.goals.recommendation.envelope_percentage', { percentage: savePercentagem.toFixed(2) })}</Typography>
                        </Paper>
                    </Grid2>
                    <Grid2 size={{ xs: 6, sm: 4 }}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 2,
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                bgcolor: 'background.paper',
                                borderRadius: 2,
                            }}
                        >
                            <Typography variant="body2">{t('settings.goals.recommendation.ideal_income', { amount: salaryIdeal.toFixed(2) })}</Typography>
                        </Paper>
                    </Grid2>
                </Grid2>
            </Box>
        </TransitionsModal >
    );
}