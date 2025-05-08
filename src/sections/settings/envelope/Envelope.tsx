import { Box, Button, Card, CardContent, CardHeader,  FormControl, FormLabel, IconButton, Slider, Stack, Switch, TextField, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { _timeline } from "src/_mock/_data";
import EnvelopeService from "src/services/implementation/EnvelopeService";
import { useQuery } from "@tanstack/react-query";

export function Envelope() {


    const { data: envelope } = useQuery({
        queryKey: ['envelope' ],
        queryFn: () => EnvelopeService.list(),
        staleTime: 5000,
        gcTime: 60000,
        placeholderData: (previousData) => previousData,
    });


    const updateAllocation = (id: string, newAllocation: number) => {

    };

    const toggleActive = (id: string) => {

    };

    const deleteEnvelope = (id: string) => {};



    const updateColor = (id: string, newColor: string) => {};

    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                gap: 2,
                mt: 2,
            }}
        >
            {envelope && envelope.map((item) => (
                <Card
                    key={item.id}
                    sx={{
                        flex: "1 0 23%",
                        minWidth: 200,
                        boxSizing: "border-box",
                        padding: 1,
                    }}
                >
                    <CardHeader
                        title={<Typography variant="h6">{item.name}</Typography>}
                        subheader={
                            <Typography variant="body2">
                                Alocação: {item.percentage}%
                            </Typography>
                        }
                    />
                    <CardContent>
                        <Stack spacing={2}>
                            <FormControl fullWidth>
                                <FormLabel>Alocação</FormLabel>
                                <Slider
                                    value={item.percentage}
                                    onChange={(_, value) =>
                                        updateAllocation(item.id, value as number)
                                    }
                                    max={100}
                                    step={1}
                                />
                            </FormControl>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <TextField
                                    type="color"
                                    value={item.color}
                                    onChange={(e) => updateColor(item.id, e.target.value)}
                                    variant="outlined"
                                    size="small"
                                    sx={{ width: 50, minWidth: 50, padding: 0 }}
                                />

                                <FormLabel>Ativo</FormLabel>
                                <Switch
                                    checked={item.active}
                                    onChange={() => toggleActive(item.id)}
                                />

                                <IconButton
                                    onClick={() => deleteEnvelope(item.id)}
                                    color="error"
                                    size="small"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );

}