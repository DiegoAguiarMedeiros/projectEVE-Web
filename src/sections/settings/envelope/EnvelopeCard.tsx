import { Card, CardHeader, Stack, Typography, IconButton, CardContent, FormControl, Slider, Box, FormLabel, Switch, useTheme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { startTransition, useActionState, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import Chips from "src/components/chip/chip";
import { useUpdateEnvelopes } from "src/hooks/mutations/envelopes/useUpdateEnvelopes";
import { Envelopes } from "src/types/Envelopes";


type EnvelopeProps = {
    data: Envelopes;

}
export function EnvelopeCard({ data }: EnvelopeProps) {
    const theme = useTheme();
    const [envelopeData, setEnvelopeData] = useState<Envelopes>(data);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const updateMutation = useUpdateEnvelopes();

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
            setIsPending(false);
        }
    };

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
                flex: "1 0 20%",
                minWidth: 200,
                maxHeight: "144px",
                boxSizing: "border-box",
                padding: 1,
                bgcolor: "var(--layout-nav-item-active-bg)",

            }}
        >
            <CardHeader
                title={
                    <Stack sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
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
            <CardContent sx={{ p: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                <FormControl fullWidth sx={{}}>
                    <Slider
                        getAriaValueText={valueLabelFormat}
                        valueLabelFormat={valueLabelFormat}
                        valueLabelDisplay="on"
                        aria-label="pretto slider"
                        value={envelopeData.percentage}
                        onChange={(_, value) => {

                            if (envelopeData.name !== "debts") updateAllocation(value as number)
                        }}
                        onBlur={submitForm}
                        max={100}
                        step={1}
                        disableSwap={envelopeData.name === "debts"}
                    />
                </FormControl>
                < FormControl fullWidth sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: "row", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography>Cor:</Typography>
                        <Box
                            component="label"
                            sx={{
                                width: 24,
                                height: 24,
                                borderRadius: "50%",
                                backgroundColor: envelopeData.color,
                                cursor: "pointer",
                                border: "1px solid #ccc",
                                display: "inline-block",
                            }}
                        >
                            <input
                                type="color"
                                value={envelopeData.color}
                                onChange={(e) => updateColor(e.target.value)}
                                onBlur={submitForm}
                                style={{
                                    opacity: 0,
                                    width: "100%",
                                    height: "100%",
                                    cursor: "pointer",
                                }}
                            />
                        </Box>
                    </Box>
                </FormControl>
            </CardContent>
        </Card >
    )
}