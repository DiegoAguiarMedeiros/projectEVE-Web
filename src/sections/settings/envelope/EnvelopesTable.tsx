import { useEffect, useState } from "react";
import { Box, Card, Typography, useTheme } from "@mui/material";
import { _timeline } from "src/_mock/_data";
import { useQuery } from "@tanstack/react-query";
import Badges from "src/components/badge/badge";
import { EnvelopeCard } from "src/sections/settings/envelope/EnvelopeCard";
import { Envelopes } from "src/types/Envelopes";
import { EnvelopeList } from "./EnvelopeList";

type EnvelopesProps = {
    envelopes: Envelopes[]
}

export function EnvelopesTable({ envelopes }: EnvelopesProps) {


    const theme = useTheme();
    const [envelopeAlocation, setEnvelopeAllocation] = useState(0);
    useEffect(() => {
        if (envelopes) {
            const totalAllocation = envelopes.reduce((acc, item) => acc + item.percentage, 0);
            setEnvelopeAllocation(totalAllocation);
        }
    }, [envelopes]);

    return (
        <Card sx={{ width: "100%", borderTopRightRadius: 0, borderTopLeftRadius: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", p: 4, justifyContent: "flex-end", gap: 2 }}>

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
                    <EnvelopeList key={item.id} envelope={item} />
                ))}
            </Box>

        </Card>
    );

}