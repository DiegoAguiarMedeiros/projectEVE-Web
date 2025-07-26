import { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { _timeline } from "src/_mock/_data";
import EnvelopesService from "src/services/implementation/EnvelopesService";
import { useQuery } from "@tanstack/react-query";
import Badges from "src/components/badge/badge";
import { EnvelopeCard } from "./EnvelopeCard";

export function Envelope() {


    const theme = useTheme();
    const [envelopeAlocation, setEnvelopeAllocation] = useState(0);
    const { data: envelope } = useQuery({
        queryKey: ['envelope'],
        queryFn: () => EnvelopesService.list(),
        staleTime: 5000,
        gcTime: 60000,
        placeholderData: (previousData) => previousData,
    });


    useEffect(() => {
        if (envelope) {
            const totalAllocation = envelope.reduce((acc, item) => acc  + item.percentage, 0);
            setEnvelopeAllocation(totalAllocation);
        }
    }, [envelope]);
    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                <Typography variant="caption" sx={{ m: 2 }}>
                    Assim?
                </Typography>
                <Badges text={envelopeAlocation <= 100 ? `Faltam ${ 100 - envelopeAlocation }% para alocação` : `Passou ${ envelopeAlocation - 100 }% do máximo`} bgColor={envelopeAlocation <= 100 ? theme.palette.success.main : theme.palette.error.main} />
            </Box>
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
                    <EnvelopeCard key={item.id} data={item} setEnvelopeAllocation={setEnvelopeAllocation} />
                ))}
            </Box>

        </>
    );

}