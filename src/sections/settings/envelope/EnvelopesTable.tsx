import { useEffect, useState } from "react";
import { Box, Card, Typography, useTheme } from "@mui/material";
import { _timeline } from "src/_mock/_data";
import { useQuery } from "@tanstack/react-query";
import Badges from "src/components/badge/badge";
import { Envelopes } from "src/types/Envelopes";
import SkeletonLoading from "src/components/skeleton/SkeletonLoading";
import { EnvelopeCard } from "src/sections/settings/envelope/EnvelopeCard";
import { EnvelopeForm } from "src/sections/settings/envelope/form";
import { useTranslation } from "react-i18next";



type EnvelopesProps = {
    envelopes: Envelopes[]
}

export function EnvelopesTable({ envelopes }: EnvelopesProps) {

    const { t } = useTranslation();
    const theme = useTheme();


    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [envelopeActive, setEnvelopeActive] = useState<Envelopes>(envelopes ? envelopes[0] : {} as Envelopes);
    const [envelopeAlocation, setEnvelopeAllocation] = useState(0);


    const handleActiveEnvelope = (envelope: Envelopes) => {
        setEnvelopeActive(envelope);
        handleOpen()
    }
    useEffect(() => {
        if (envelopes) {
            const totalAllocation = envelopes.reduce((acc, item) => acc + item.percentage, 0);
            setEnvelopeAllocation(totalAllocation);
        }
    }, [envelopes]);



    return (
        <Card sx={{ width: "100%", borderTopRightRadius: 0, borderTopLeftRadius: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", p: 4, justifyContent: "flex-end", gap: 2 }}>
                <EnvelopeForm data={envelopeActive} buttonLabel={t('common.add')} open={open} handleOpen={handleOpen} handleClose={handleClose} />
                <Badges text={envelopeAlocation <= 100 ? t('settings.envelope.allocation_remaining', { count: 100 - envelopeAlocation }) : t('settings.envelope.allocation_exceeded', { count: envelopeAlocation - 100 })} bgColor={envelopeAlocation <= 100 ? theme.palette.success.main : theme.palette.error.main} />
            </Box>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 3,
                width: '100%',
                padding: 3,
                paddingTop: 0
            }}>
                {!envelopes ? (
                    <Box sx={{ gridColumn: "1 / -1" }}>
                        <SkeletonLoading count={1} height={200} />
                    </Box>
                ) : envelopes.map((item) => (
                    <EnvelopeCard
                        key={item.id}
                        envelope={item}
                        handleActiveEnvelope={handleActiveEnvelope}
                    />
                ))}
            </Box>



        </Card>
    );

}