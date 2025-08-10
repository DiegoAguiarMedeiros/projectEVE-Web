import { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { _timeline } from "src/_mock/_data";
import { useQuery } from "@tanstack/react-query";
import Badges from "src/components/badge/badge";
import { EnvelopeCard } from "src/sections/settings/envelope/EnvelopeCard";
import { Envelopes } from "src/types/Envelopes";

type EnvelopesProps = {
    envelopes: Envelopes[]
}

export function EnvelopesTable({ envelopes }: EnvelopesProps) {


    const theme = useTheme();
    const [envelopeAlocation, setEnvelopeAllocation] = useState(0);

    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                <Typography variant="caption" sx={{ m: 2 }}>
                    Assim?
                </Typography>
                <Badges text={envelopeAlocation <= 100 ? `Faltam ${100 - envelopeAlocation}% para alocação` : `Passou ${envelopeAlocation - 100}% do máximo`} bgColor={envelopeAlocation <= 100 ? theme.palette.success.main : theme.palette.error.main} />
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
                {envelopes && envelopes.map((item) => (
                    <EnvelopeCard key={item.id} data={item} setEnvelopeAllocation={setEnvelopeAllocation} />
                ))}
            </Box>

        </>
    );

}