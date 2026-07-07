import { useEffect, useState } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
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
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));


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
            const totalAllocation = parseFloat(envelopes.reduce((acc, item) => acc + item.percentage, 0).toFixed(2));
            setEnvelopeAllocation(totalAllocation);
        }
    }, [envelopes]);



    return (
        <Box sx={{
            width: "100%",
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            ...(isMobile
                ? {
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                }
                : {
                    borderTopRightRadius: 0,
                    borderTopLeftRadius: 0,
                    borderBottomRightRadius: Number(theme.shape.borderRadius) * 2,
                    borderBottomLeftRadius: Number(theme.shape.borderRadius) * 2,
                    backgroundColor: theme.palette.background.paper,
                }),
        }}>
            <Box sx={{ display: "flex", alignItems: "center", p: isMobile ? 2 : 4, justifyContent: "flex-end", gap: 2 }}>
                <EnvelopeForm data={envelopeActive} buttonLabel={t('common.add')} open={open} handleOpen={handleOpen} handleClose={handleClose} allEnvelopes={envelopes} />
                <Badges text={envelopeAlocation <= 100 ? t('settings.envelope.allocation_remaining', { count: parseFloat((100 - envelopeAlocation).toFixed(2)) }) : t('settings.envelope.allocation_exceeded', { count: parseFloat((envelopeAlocation - 100).toFixed(2)) })} bgColor={envelopeAlocation <= 100 ? theme.palette.success.main : theme.palette.error.main} />
            </Box>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: isMobile ? 1.5 : 3,
                width: '100%',
                padding: isMobile ? 1.5 : 3,
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
        </Box>
    );

}