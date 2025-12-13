import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Slider, TextField, Typography } from "@mui/material";
import { startTransition, useActionState, useCallback, useEffect, useImperativeHandle, useRef, useState, useTransition } from "react";
import TransitionsModal from "src/sections/shared/transitionsModal";
import { Envelopes } from "src/types/Envelopes";
import { useCreateDebts } from "src/hooks/mutations/debts/useCreateDebts";
import { useUpdateDebts } from "src/hooks/mutations/debts/useUpdateDebts";
import { Debts, DebtsPost } from "src/types/Debts";
import { useUpdateEnvelopes } from "src/hooks/mutations/envelopes/useUpdateEnvelopes";
import SaveIcon from '@mui/icons-material/Save';

type EnvelopeFormProps = {
    buttonIcon?: React.ReactNode;
    buttonLabel: string;
    data: Envelopes;
    open: boolean
    handleOpen: VoidFunction
    handleClose: VoidFunction
}

export function EnvelopeForm({ buttonLabel, buttonIcon, data, open, handleOpen, handleClose }: EnvelopeFormProps) {

    const [color, setColor] = useState('#4ECDC4');
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        if (data) {
            setColor(data.color);
            setPercentage(data.percentage);
        }
    }, [data]);






    const [name, setName] = useState(data ? data.name : "");
    const [errorName, setErrorName] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const updateMutation = useUpdateEnvelopes();

    const [selectedIcon, setSelectedIcon] = useState<string>("");

    const submitAction = async (envelopes: Envelopes) => {
        setIsPending(true);
        setError(null);

        try {
            if (data) {
                await updateMutation.mutateAsync({
                    id: data.id,
                    name: envelopes.name,
                    color: envelopes.color,
                    percentage: envelopes.percentage,
                });
            }
        } catch (err: any) {
            setError(err);
        } finally {
            handleClose()
            setIsPending(false);
        }
    };

    const handleSubmit = () => {
        startTransition(async () => {
            submitAction({
                id: data?.id,
                name: data?.name,
                color,
                percentage,
            })
        });
    }


    const validateName = useCallback(() => {
        if (!name.trim()) {
            setErrorName("Descrição é obrigatória.");
            return false;
        }
        setErrorName(null);
        return true;
    }, [name]);



    return (

        <TransitionsModal
            open={open}
            handleClose={handleClose}
            handleOpen={handleOpen}
            okButton={<Button type="submit" variant="outlined" color="primary" onClick={handleSubmit} disabled={isPending} startIcon={<SaveIcon sx={{ fontSize: 20 }} />}>Salvar</Button>
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
                    Envelope
                </Typography>



                {error && <p>{error.message}</p>}

                <TextField
                    fullWidth
                    name="name"
                    label="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={validateName}
                    sx={{ mb: 3 }}
                    error={!!errorName}
                    helperText={errorName ?? ""}
                />
                <Box sx={{ width: '100%', display: 'flex', px: 2, pb: 4, gap: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>Color</Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                style={{
                                    width: '60px',
                                    height: '40px',
                                    border: '2px solid #ccc',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            />
                            <Typography variant="body2" color="text.secondary">
                                {color.toUpperCase()}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ flex: '1 0 0', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>Percentage: {percentage}%</Typography>
                        <Slider
                            value={percentage}
                            onChange={(_, value) => setPercentage(value as number)}
                            min={0}
                            max={100}
                            step={1}
                            marks={[
                                { value: 0, label: '0%' },
                                { value: 25, label: '25%' },
                                { value: 50, label: '50%' },
                                { value: 75, label: '75%' },
                                { value: 100, label: '100%' }
                            ]}
                            valueLabelDisplay="auto"
                            sx={{
                                '& .MuiSlider-thumb': {
                                    bgcolor: color,
                                },
                                '& .MuiSlider-track': {
                                    bgcolor: color,
                                },
                                '& .MuiSlider-rail': {
                                    opacity: 0.3,
                                }
                            }}
                        />
                    </Box>
                </Box>




            </Box >
        </TransitionsModal>
    );
}
