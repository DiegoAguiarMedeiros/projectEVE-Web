import { Box, Button, FormControl, FormControlLabel, FormLabel, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { startTransition, useActionState, useCallback, useEffect, useImperativeHandle, useRef, useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import TransitionsModal from "src/sections/shared/transitionsModal";
import { useSnackbar, VariantType } from "notistack";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { ProcessedIncomes, ProcessedIncomesPlayload } from "src/types/ProcessedIncomes";
import { Envelopes } from "src/types/Envelopes";
import { useCreateProcessedIncomes } from "src/hooks/mutations/processed-incomes/useCreateProcessedIncomes";
import { useUpdateProcessedIncomes } from "src/hooks/mutations/processed-incomes/useUpdateProcessedIncomes";

type IncomeFormProps = {
    buttonIcon?: React.ReactNode;
    buttonLabel: string;
    data?: ProcessedIncomes;
    envelopes: Envelopes[]
}

export function IncomeForm({ buttonLabel, buttonIcon, data, envelopes }: IncomeFormProps) {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [envelope, setEnvelope] = useState(data ? data.envelope : "");
    const [description, setDescription] = useState(data ? data.description : "");
    const [isSplitted, setIsSplitted] = useState(data ? data.isSplitted : "");
    const [totalIncomeProcessed, setTotalIncomeProcessed] = useState(data ? data.totalIncomeProcessed : "");
    const [day, setDay] = useState(data ? data.day : "");
    const [month, setMonth] = useState(data ? data.month : "");
    const [year, setYear] = useState(data ? data.year : "");
    const dateValue = day && month && year ? dayjs(`${year}-${month}-${day}`) : null;
    const [errorDescription, setErrorDescription] = useState<string | null>(null);
    const [errorTotalIncomeProcessed, setErrorTotalIncomeProcessed] = useState<string | null>(null);
    const [errorInstallmentsTotal, setErrorInstallmentsTotal] = useState<string | null>(null);
    const [errorInstallmentsPaid, setErrorInstallmentsPaid] = useState<string | null>(null);
    const [errorPaymentDay, setErrorPaymentDay] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const clearForm = () => {
        setTotalIncomeProcessed("")
    };



    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createMutation = useCreateProcessedIncomes();

    const updateMutation = useUpdateProcessedIncomes();

    const submitAction = async (processedIncomes: ProcessedIncomesPlayload) => {
        setIsPending(true);
        setError(null);

        try {
            if (data) {
                await updateMutation.mutateAsync({
                    id: data.id,
                    description: processedIncomes.description,
                    totalIncomeProcessed: processedIncomes.totalIncomeProcessed,
                    envelope: isSplitted ? processedIncomes.envelope : undefined,
                    day: processedIncomes.day,
                    month: processedIncomes.month,
                    year: processedIncomes.year,
                    isSplitted: processedIncomes.isSplitted,
                });
            } else {
                await createMutation.mutateAsync({
                    description: processedIncomes.description,
                    totalIncomeProcessed: processedIncomes.totalIncomeProcessed,
                    envelope: isSplitted ? processedIncomes.envelope : undefined,
                    day: processedIncomes.day,
                    month: processedIncomes.month,
                    year: processedIncomes.year,
                    isSplitted: processedIncomes.isSplitted,
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
        if (validateTotalIncomeProcessed()) {
            startTransition(async () => {
                submitAction({
                    description,
                    totalIncomeProcessed,
                    day,
                    month,
                    year,
                    isSplitted: true
                });
            });
        }
    };


    const handleChangeDate = (newValue: any) => {
        if (newValue && dayjs(newValue).isValid()) {
            setDay(newValue.date());
            setMonth(newValue.month() + 1); // Mês começa do 0
            setYear(newValue.year());
        } else {
            setDay("");
            setMonth("");
            setYear("");
        }
    };

    const validateDescription = useCallback(() => {
        if (!description.trim()) {
            setErrorDescription("Descrição é obrigatória.");
            return false;
        }
        setErrorDescription(null);
        return true;
    }, [description]);

    const validateTotalIncomeProcessed = useCallback(() => {
        if (!totalIncomeProcessed.trim()) {
            setErrorTotalIncomeProcessed("Valor é obrigatório.");
            return false;
        }

        if (Number.isNaN(Number(totalIncomeProcessed))) {
            setErrorTotalIncomeProcessed("Valor deve ser numérico.");
            return false;
        }
        setErrorTotalIncomeProcessed(null);
        return true;
    }, [totalIncomeProcessed]);

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
                <Button variant="contained" color="primary" onClick={handleOpen}  >{buttonLabel}</Button>
                :
                <Button
                    style={{ display: "flex", gap: "16px", background: "none", border: "none", cursor: "pointer", margin: 0, padding: 0 }}
                    onClick={handleOpen}
                >
                    {buttonIcon}{buttonLabel}
                </Button>
            }

            okButton={<Button type="submit" variant="outlined" color="primary" onClick={handleSubmit} disabled={isPending} >Adicionar</Button>
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
                    Renda
                </Typography>
                {error && <p>{error.message}</p>}
                <TextField
                    fullWidth
                    name="description"
                    label="Descrição"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={validateDescription}
                    sx={{ mb: 3 }}
                    error={!!errorDescription}
                    helperText={errorDescription ?? ""}
                />
                <TextField
                    fullWidth
                    type="number"
                    name="amount"
                    label="Valor"
                    value={totalIncomeProcessed}
                    onChange={(e) => setTotalIncomeProcessed(e.target.value)}
                    onBlur={validateTotalIncomeProcessed}
                    sx={{ mb: 3 }}
                    error={!!errorTotalIncomeProcessed}
                    helperText={errorTotalIncomeProcessed ?? ""}
                    slotProps={{
                        input: {
                            inputMode: "numeric",
                        }
                    }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        sx={{ width: "100%", mb: 3 }}
                        name="date"
                        label="Data do Pagamento"
                        value={dateValue}
                        onChange={handleChangeDate}
                        format="DD/MM/YYYY"
                    />
                </LocalizationProvider>
                <FormControl fullWidth sx={{ border: '1px solid', borderColor: (theme) => theme.palette.divider, borderRadius: '8px', p: 2, mb: 3 }}>
                    <FormLabel>Dividir entre envelopes</FormLabel>
                    <Box sx={{ display: 'flex', width: '100%', gap: '8px', mt: 3 }}>
                        <Button fullWidth variant={!isSplitted ? "outlined" : "contained"} color="primary" onClick={() => setIsSplitted(true)} >Sim</Button>
                        <Button fullWidth variant={isSplitted ? "outlined" : "contained"} color="primary" onClick={() => setIsSplitted(false)} >Não</Button>
                    </Box>
                </FormControl>
                {!isSplitted && <FormControl fullWidth>
                    <InputLabel id="envelopes-select-label">Envelope</InputLabel>
                    <Select
                        labelId="envelopes-select-label"
                        id="envelope-select"
                        label="Envelope"
                        sx={{ width: "100%", mb: 3 }}
                        name="envelope"
                        value={envelope}
                        onChange={handleSelectChange}
                    >
                        {envelopes.map((f, index) => (
                            <MenuItem key={index} value={f.id}>{f.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>}

            </Box >
        </TransitionsModal>
    );
}
