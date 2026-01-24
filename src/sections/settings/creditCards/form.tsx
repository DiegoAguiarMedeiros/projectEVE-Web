import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { startTransition, useActionState, useCallback, useEffect, useImperativeHandle, useRef, useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import TransitionsModal from "src/sections/shared/transitionsModal";
import { useSnackbar, VariantType } from "notistack";
import { useCreateCreditCards } from "src/hooks/mutations/credit-cards/useCreateCreditCards";
import { useUpdateCreditCards } from "src/hooks/mutations/credit-cards/useUpdateCreditCards";
import { allFlags, CreditCards, CreditCardsPost, Flags } from "src/types/CreditCards";
import { useTranslation } from "react-i18next";


type CreditCardFormProps = {
    buttonIcon?: React.ReactNode;
    buttonLabel: string;
    data?: CreditCards
}

export function CreditCardForm({ buttonLabel, buttonIcon, data }: CreditCardFormProps) {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [name, setName] = useState(data ? data.name : "");
    const [flag, setFlag] = useState<Flags>(data ? data.flag : "Visa");
    const [errorName, setErrorName] = useState<string | null>(null);
    const [erroFlag, setErroFlag] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ["credit-cards"] });
    };
    const clearForm = () => {
        setName("")
        setFlag("Visa")
    };



    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createMutation = useCreateCreditCards();

    const updateMutation = useUpdateCreditCards();

    const submitAction = async (creditCards: CreditCardsPost) => {
        setIsPending(true);
        setError(null);

        try {
            if (data) {
                await updateMutation.mutateAsync({
                    id: data.id,
                    name: creditCards.name,
                    flag: creditCards.flag,
                    active: data.active!,
                    userId: data.userId!,
                });
            } else {
                await createMutation.mutateAsync({
                    name: creditCards.name,
                    flag: creditCards.flag,
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
        if (validateName() && validateFlag()) {
            startTransition(() => {
                submitAction({ name, flag });
            });
        }
    };

    const validateName = useCallback(() => {
        if (!name.trim()) {
            setErrorName(t('settings.credit_card.validation.name_required'));
            return false;
        }
        setErrorName(null);
        return true;
    }, [name, t]);

    const validateFlag = useCallback(() => {
        if (!flag) {
            setErrorName(t('settings.credit_card.validation.flag_required'));
            return false;
        }
        setErroFlag(null);
        return true;
    }, [flag, t]);


    const handleSelectChange = (event: SelectChangeEvent<Flags>) => {
        setFlag(event.target.value as Flags);
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
                    {buttonIcon}{buttonLabel === 'Adicionar' ? t('common.add') : buttonLabel === 'Editar' ? t('common.edit') : buttonLabel}
                </Button>
            }

            okButton={<Button type="submit" variant="outlined" color="primary" onClick={handleSubmit} disabled={isPending} >{t('common.add')}</Button>
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
                    {t('settings.credit_card.title')}
                </Typography>
                {error && <p>{error.message}</p>}
                <TextField
                    fullWidth
                    name="name"
                    label={t('settings.credit_card.name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={validateName}
                    sx={{ mb: 3 }}
                    error={!!errorName}
                    helperText={errorName ?? ""}
                />
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">{t('settings.credit_card.flag')}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label={t('settings.credit_card.flag')}
                        sx={{ width: "100%", mb: 3 }}
                        name="flag"
                        value={flag}
                        onChange={handleSelectChange}
                    >
                        {allFlags.map((f) => (
                            <MenuItem value={f}>{f}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box >
        </TransitionsModal>
    );
}
