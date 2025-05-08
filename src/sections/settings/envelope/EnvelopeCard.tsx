import { Card, CardHeader, Stack, Typography, IconButton, CardContent, FormControl, Slider, Box, FormLabel, Switch } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EnvelopeService, { Envelope, EnvelopePost, EnvelopeUpdateFiledDTO } from "src/services/implementation/EnvelopeService";
import { startTransition, useActionState, useState } from "react";
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from "notistack";
import Chips from "src/components/chip/chip";


type EnvelopeProps = {
    data: Envelope;
    setEnvelopeAllocation: React.Dispatch<React.SetStateAction<number>>

}
export function EnvelopeCard({ data, setEnvelopeAllocation }: EnvelopeProps) {

    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    const [envelopeData, setEnvelopeData] = useState<Envelope>(data);

    const [error, submitAction, isPending] = useActionState(
        async (previousState: any, envelope: EnvelopeUpdateFiledDTO) => {
            if (data) {

                const errorEnvelopeUpdate = await EnvelopeService.update({
                    id: data.id,
                    name: envelope.name,
                    color: envelope.color,
                    percentage: envelope.percentage,
                    active: envelope.active,
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
                active: envelopeData.active
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

    const toggleActive = () => {
        setEnvelopeData((prev) => ({
            ...prev,
            active: !envelopeData.active,
        }));
        submitForm();
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
                flex: "1 0 23%",
                minWidth: 200,
                boxSizing: "border-box",
                padding: 1,
                border: `1px solid ${envelopeData.color}`,
            }}
        >
            <CardHeader
                title={
                    <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">
                            {envelopeData.name} ({envelopeData.percentage}%)
                        </Typography>
                        <IconButton
                            onClick={() => deleteEnvelope(envelopeData.id)}
                            color="error"
                            size="small"
                        >
                            <DeleteIcon />
                        </IconButton>
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
                <FormControl fullWidth sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                    <Chips label={`${envelopeData.active}`} labels={['Ativo', 'Inativo']} fieldName='true' click={toggleActive} />
                </FormControl>
            </CardContent>
        </Card>


    )
}