import { Card, CardHeader, Stack, Typography, IconButton, CardContent, FormControl, Slider, Box, FormLabel, Switch } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EnvelopesService, { Envelope, EnvelopePost, EnvelopeUpdateFiledDTO } from "src/services/implementation/EnvelopesService";
import { startTransition, useActionState, useState } from "react";
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from "notistack";
import Chips from "src/components/chip/chip";


type EnvelopeGoalsProps = {
    data: Envelope;
    setEnvelopeAllocation: React.Dispatch<React.SetStateAction<number>>

}
export function EnvelopeGoalsCard({ data, setEnvelopeAllocation }: EnvelopeGoalsProps) {

    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    const [envelopeTesteData, setEnvelopeTesteData] = useState<Envelope[]>([
        {
            id: '1',
            name: "Teste 1",
            color: "#fff",
            percentage: 1,
            userId: ""
        },
        {
            id: '2',
            name: "Teste 2",
            color: "#aaa",
            percentage: 2,
            userId: ""
        },
        {
            id: '3',
            name: "Teste 3",
            color: "#bbb",
            percentage: 3,
            userId: ""
        },
        {
            id: '4',
            name: "Teste 4",
            color: "#ccc",
            percentage: 4,
            userId: ""
        },
        {
            id: '5',
            name: "Teste 5",
            color: "#ddd",
            percentage: 5,
            userId: ""
        }
    ]);
    const [envelopeData, setEnvelopeData] = useState<Envelope>(data);

    const [error, submitAction, isPending] = useActionState(
        async (previousState: any, envelope: EnvelopeUpdateFiledDTO) => {
            if (data) {

                const errorEnvelopeUpdate = await EnvelopesService.update({
                    id: data.id,
                    name: envelope.name,
                    color: envelope.color,
                    percentage: envelope.percentage,
                });
                console.log('errorEnvelopeUpdate', errorEnvelopeUpdate);
                if (!errorEnvelopeUpdate) {
                    return errorEnvelopeUpdate;
                }
                enqueueSnackbar('Envelope editado com sucesso!', { autoHideDuration: 3000, variant: 'success', anchorOrigin: { horizontal: 'right', vertical: 'bottom' } });

            }
            refresh();
            return null;
        },
        null,
    );


    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ['envelope'] });
    };;

    const submitForm = () => {
        startTransition(async () => {
            submitAction({
                id: envelopeData.id,
                name: envelopeData.name,
                color: envelopeData.color,
                percentage: envelopeData.percentage,
            })
        });
    }
    const valueLabelFormat = (value: number) => (`${value} %`);

    const updateAllocation = (newAllocation: number) => {
        setEnvelopeData((prev) => ({
            ...prev,
            percentage: newAllocation,
        }));
    };
    const updateAllocation2 = (newAllocation: number) => {
    };

    const deleteEnvelope = (id: string) => { };

    const updateColor = (newColor: string) => {
        setEnvelopeData((prev) => ({
            ...prev,
            color: newColor,
        }));
    };

    return (
        <Card
            key={envelopeData.id}
            sx={{
                flex: "1 0 100%",
                minWidth: 200,
                boxSizing: "border-box",
                padding: 1,
            }}
        >
            <CardHeader
                title={
                    <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">
                            {envelopeData.name} ({envelopeData.percentage}%)
                        </Typography>
                    </Stack>
                }
                sx={{ p: 1, }}
            />
            <CardContent sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControl fullWidth sx={{}}>
                    <Slider
                        getAriaValueText={valueLabelFormat}
                        valueLabelFormat={valueLabelFormat}
                        valueLabelDisplay="auto"
                        aria-label="pretto slider"
                        value={envelopeData.percentage}
                        onChange={(_, value) =>
                            updateAllocation(value as number)
                        }
                        onBlur={submitForm}
                        max={100}
                        step={1}
                    />
                </FormControl>
                {envelopeTesteData && envelopeTesteData.map(item => (
                    <Box
                        key={item.id}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            boxSizing: 'border-box',
                            p:1
                        }}
                    >
                        <CardHeader
                            title={
                                <Typography variant="body1">
                                    {item.name}
                                </Typography>
                            }
                            sx={{ flex: 1, p: 0 }}
                        />

                        <FormControl sx={{
                            flex: 2, p: 0,
                            display: 'flex',
                            flexDirection: 'column',
                        }} fullWidth>
                            <Slider
                                getAriaValueText={valueLabelFormat}
                                valueLabelFormat={valueLabelFormat}
                                valueLabelDisplay="auto"
                                aria-label="pretto slider"
                                value={item.percentage}
                                onChange={(_, value) => updateAllocation2(value as number)}
                                onBlur={submitForm}
                                max={100}
                                step={1}
                            />
                        </FormControl>
                    </Box>


                ))}
                <FormControl fullWidth sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyItems: 'center', gap: 1 }}>
                        <Typography>Cor:</Typography>
                        <Box
                            component="label"
                            sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                backgroundColor: envelopeData.color,
                                cursor: 'pointer',
                                border: '1px solid #ccc',
                                display: 'inline-block',
                            }}
                        >
                            <input
                                type="color"
                                value={envelopeData.color}
                                onChange={(e) => updateColor(e.target.value)}
                                onBlur={submitForm}
                                style={{
                                    opacity: 0,
                                    width: '100%',
                                    height: '100%',
                                    cursor: 'pointer',
                                }}
                            />
                        </Box>
                    </Box>


                    <IconButton
                        onClick={() => deleteEnvelope(envelopeData.id)}
                        color="error"
                        size="small"
                    >
                        <DeleteIcon />
                    </IconButton>
                </FormControl>
            </CardContent>


        </Card >
    )
}