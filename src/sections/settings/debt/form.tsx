import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { startTransition, useActionState, useCallback, useEffect, useImperativeHandle, useRef, useState, useTransition } from "react";
import TransitionsModal from "src/sections/shared/transitionsModal";
import { Envelopes } from "src/types/Envelopes";
import { useCreateDebts } from "src/hooks/mutations/debts/useCreateDebts";
import { useUpdateDebts } from "src/hooks/mutations/debts/useUpdateDebts";
import { Debts, DebtsPost } from "src/types/Debts";

type DebtFormProps = {
    buttonIcon?: React.ReactNode;
    buttonLabel: string;
    data?: Debts;
    envelopes: Envelopes[];
}

export function DebtForm({ buttonLabel, buttonIcon, data, envelopes }: DebtFormProps) {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const envelopeId = envelopes.filter(envelope => envelope.name === "debts")[0]
    const [description, setDescription] = useState(data ? data.description : "");
    const [amount, setAmount] = useState(data ? data.amount : "");
    const [installmentsTotal, setInstallmentsTotal] = useState(data ? data.installmentsTotal : "");
    const [installmentsPaid, setInstallmentsPaid] = useState(data ? data.installmentsPaid : "");
    const [paymentDay, setPaymentDay] = useState(data ? data.paymentDay : "");

    const [errorDescription, setErrorDescription] = useState<string | null>(null);
    const [errorAmount, setErrorAmount] = useState<string | null>(null);
    const [errorInstallmentsTotal, setErrorInstallmentsTotal] = useState<string | null>(null);
    const [errorInstallmentsPaid, setErrorInstallmentsPaid] = useState<string | null>(null);
    const [errorPaymentDay, setErrorPaymentDay] = useState<string | null>(null);

    const clearForm = () => {
        setDescription("")
        setAmount("")
        setInstallmentsTotal("")
        setInstallmentsPaid("")
        setPaymentDay("")
    };



    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createMutation = useCreateDebts();

    const updateMutation = useUpdateDebts();

    const submitAction = async (debts: DebtsPost) => {
        setIsPending(true);
        setError(null);

        try {
            if (data) {
                await updateMutation.mutateAsync({
                    id: data.id,
                    description: debts.description,
                    amount: debts.amount,
                    installmentsTotal: debts.installmentsTotal,
                    installmentsPaid: debts.installmentsPaid,
                    paymentDay: debts.paymentDay,
                    status: debts.status,
                });
            } else {
                await createMutation.mutateAsync({
                    envelopeId: debts.envelopeId,
                    description: debts.description,
                    amount: debts.amount,
                    installmentsTotal: debts.installmentsTotal,
                    installmentsPaid: debts.installmentsPaid,
                    paymentDay: debts.paymentDay,
                    status: debts.status,
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
            startTransition(async () => {
                submitAction({
                    envelopeId: envelopeId.id,
                    description,
                    amount,
                    installmentsTotal,
                    installmentsPaid,
                    paymentDay,
                    status: "Pending"
                });
            });
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

    const validateAmount = useCallback(() => {
        if (!amount.trim()) {
            setErrorAmount("Valor é obrigatório.");
            return false;
        }

        if (Number.isNaN(Number(amount))) {
            setErrorAmount("Valor deve ser numérico.");
            return false;
        }
        setErrorAmount(null);
        return true;
    }, [amount]);

    const validateInstallmentsTotal = useCallback(() => {
        if (!installmentsTotal.trim()) {
            setErrorInstallmentsTotal("Valor é obrigatório.");
            return false;
        }

        if (Number.isNaN(Number(installmentsTotal))) {
            setErrorInstallmentsTotal("Valor deve ser numérico.");
            return false;
        }
        setErrorInstallmentsTotal(null);
        return true;
    }, [installmentsTotal]);

    const validateInstallmentsPaid = useCallback(() => {
        if (!installmentsPaid.trim()) {
            setErrorInstallmentsPaid("Valor é obrigatório.");
            return false;
        }

        if (Number.isNaN(Number(installmentsPaid))) {
            setErrorInstallmentsPaid("Valor deve ser numérico.");
            return false;
        }
        setErrorInstallmentsPaid(null);
        return true;
    }, [installmentsPaid]);

    const validatePaymentDay = useCallback(() => {
        const day = Number(paymentDay);
        if (!paymentDay.trim()) {
            setErrorPaymentDay("Dia do pagamento é obrigatório.");
            return false;
        }
        if (Number.isNaN(day) || day < 1 || day > 31) {
            setErrorPaymentDay("O dia do pagamento deve estar entre 1 e 31.");
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
                    Dívida
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
                    label="Valor da parcela"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onBlur={validateAmount}
                    sx={{ mb: 3 }}
                    error={!!errorAmount}
                    helperText={errorAmount ?? ""}
                    slotProps={{
                        input: {
                            inputMode: "numeric",
                        }
                    }}
                />

                <TextField
                    fullWidth
                    type="number"
                    name="installmentsPaid"
                    label="Parcelas pagas"
                    value={installmentsPaid}
                    onChange={(e) => setInstallmentsPaid(e.target.value)}
                    onBlur={validateInstallmentsPaid}
                    sx={{ mb: 3 }}
                    error={!!errorInstallmentsPaid}
                    helperText={errorInstallmentsPaid ?? ""}
                    slotProps={{
                        input: {
                            inputMode: "numeric",
                        }
                    }}
                />
                <TextField
                    fullWidth
                    type="number"
                    name="installmentsTotal"
                    label="Total de parcelas"
                    value={installmentsTotal}
                    onChange={(e) => setInstallmentsTotal(e.target.value)}
                    onBlur={validateInstallmentsTotal}
                    sx={{ mb: 3 }}
                    error={!!errorInstallmentsTotal}
                    helperText={errorInstallmentsTotal ?? ""}
                    slotProps={{
                        input: {
                            inputMode: "numeric",
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
                    helperText={errorPaymentDay ?? ""}
                    slotProps={{
                        input: {
                            inputMode: "numeric",
                            "aria-valuemin": 1,
                            "aria-valuemax": 31,
                        }
                    }}
                />
            </Box >
        </TransitionsModal>
    );
}
