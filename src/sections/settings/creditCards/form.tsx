import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import { startTransition, useActionState, useCallback, useEffect, useImperativeHandle, useRef, useState, useTransition } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import TransitionsModal from 'src/sections/shared/transitionsModal';
import CreditCardService, { CreditCard, CreditCardPost } from 'src/services/implementation/creditCardService';
import { useSnackbar, VariantType } from 'notistack';

type CreditCardFormProps = {
    buttonIcon?: React.ReactNode;
    buttonLabel: string;
    data?: CreditCard
}

export function CreditCardForm({ buttonLabel, buttonIcon, data }: CreditCardFormProps) {
    const { enqueueSnackbar } = useSnackbar();

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [name, setName] = useState(data ? data.name : '');
    const [flag, setFlag] = useState(data ? data.flag : '');
    const [errorName, setErrorName] = useState<string | null>(null);
    const [erroFlag, setErroFlag] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ['creditCards'] });
    };
    const clearForm = () => {
        setName('')
        setFlag('')
    };




    const [error, submitAction, isPending] = useActionState(
        async (previousState: any, creditCard: CreditCardPost) => {
            if (data) {

                const errorPostIncomes = await CreditCardService.update({
                    id: data.id,
                    name: creditCard.name,
                    flag: creditCard.flag,
                    active: creditCard.active!,
                    userId: creditCard.userId!,
                });

                if (!errorPostIncomes) {
                    return errorPostIncomes;
                }
                enqueueSnackbar('Salário editado com sucesso!', { autoHideDuration: 3000, variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'bottom' } });

            } else {

                const errorPostIncomes = await CreditCardService.create({
                    name: creditCard.name,
                    flag: creditCard.flag,
                    active: creditCard.active,
                    userId: creditCard.userId,
                });

                if (!errorPostIncomes) {
                    return errorPostIncomes;
                }
                enqueueSnackbar('Salário cadastrado com sucesso!', { autoHideDuration: 3000, variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'bottom' } });


            }

            clearForm();
            refresh();
            handleClose();
            return null;
        },
        null,
    );

    const handleSubmit = async () => {
        if (validateName() && validateFlag()) {
            startTransition(async () => {
                await submitAction({ name, flag });
            });
        }
    };

    const validateName = useCallback(() => {
        if (!name.trim()) {
            setErrorName('Nome é obrigatória.');
            return false;
        }
        setErrorName(null);
        return true;
    }, [name]);

    const validateFlag = useCallback(() => {
        if (!flag.trim()) {
            setErrorName('Bandeira é obrigatória.');
            return false;
        }
        setErroFlag(null);
        return true;
    }, [flag]);


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
                    name="name"
                    label="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={validateName}
                    sx={{ mb: 3 }}
                    error={!!errorName}
                    helperText={errorName ?? ''}
                />
                <TextField
                    fullWidth
                    name="flag"
                    label="Bandeira"
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    onBlur={validateFlag}
                    sx={{ mb: 3 }}
                    error={!!erroFlag}
                    helperText={erroFlag ?? ''}
                />
            </Box >
        </TransitionsModal>
    );
}
