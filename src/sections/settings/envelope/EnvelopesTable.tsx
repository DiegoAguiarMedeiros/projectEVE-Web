import { useEffect, useState } from "react";
import { Box, Card, Typography, useTheme } from "@mui/material";
import { _timeline } from "src/_mock/_data";
import { useQuery } from "@tanstack/react-query";
import Badges from "src/components/badge/badge";
import { Envelopes } from "src/types/Envelopes";
import { EnvelopeCard } from "./EnvelopeCard";
import { EnvelopeForm } from "./form";

type EnvelopesProps = {
    envelopes: Envelopes[]
}

export function EnvelopesTable({ envelopes }: EnvelopesProps) {


    const theme = useTheme();


    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [envelopeActive, setEnvelopeActive] = useState<Envelopes>(envelopes[0]);
    const [envelopeAlocation, setEnvelopeAllocation] = useState(0);


    const handleActiveEnvelope = (envelope: Envelopes) => {
        setEnvelopeActive(envelope);
        handleOpen()
    }
    useEffect(() => {
        if (envelopes) {
            const totalAllocation = envelopes.reduce((acc, item) => acc + item.percentage, 0);
            console.log("totalAllocation", totalAllocation)
            setEnvelopeAllocation(totalAllocation);
        }
    }, [envelopes]);

    return (
        <Card sx={{ width: "100%", borderTopRightRadius: 0, borderTopLeftRadius: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", p: 4, justifyContent: "flex-end", gap: 2 }}>
                <EnvelopeForm data={envelopeActive} buttonLabel="Adicionar" open={open} handleOpen={handleOpen} handleClose={handleClose} />
                <Badges text={envelopeAlocation <= 100 ? `Faltam ${100 - envelopeAlocation}% para alocação` : `Passou ${envelopeAlocation - 100}% do máximo`} bgColor={envelopeAlocation <= 100 ? theme.palette.success.main : theme.palette.error.main} />
            </Box>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 3,
                width: '100%',
                padding: 3,
                paddingTop: 0
            }}>
                {envelopes && envelopes.map((item) => (
                    <EnvelopeCard key={item.id} envelope={item} handleActiveEnvelope={handleActiveEnvelope} />
                ))}
            </Box>

        </Card>
    );

}