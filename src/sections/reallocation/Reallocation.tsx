import { CardProps, Box, Button, Card, Stack, Typography, TextField, InputAdornment, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Iconify } from "src/components/iconify";
import { useTransferBalance } from "src/hooks/mutations/envelopes/useTransferBalance";
import { DashboardContent } from "src/layouts/dashboard";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { RealEnvelopesCard } from "src/components/realEnvelopeCard";
import { Envelopes } from "src/types/Envelopes";
import { useCurrency } from "src/hooks/useCurrency";
import { usePaths } from "src/hooks/usePaths";

type ReallocationProps = {
    envelopes: Envelopes[];
    envelopeSelected: number | null;
};

export function Reallocation({ envelopes, envelopeSelected }: ReallocationProps) {
    const { t } = useTranslation();
    const paths = usePaths();
    const { symbol } = useCurrency();
    const navigate = useNavigate();

    const { month, year } = SelectedMonthYearStore();
    const transferMutation = useTransferBalance();

    // Initialize source index based on prop or default to 0
    const [sourceIndex, setSourceIndex] = useState(() => {
        if (envelopeSelected != null && envelopes[envelopeSelected]) {
            return envelopeSelected;
        }
        return 0;
    });

    const [destinationIndex, setDestinationIndex] = useState(0);
    const [amount, setAmount] = useState<number | string>("");
    const [error, setError] = useState<string | null>(null);

    const sourceEnvelope = envelopes[sourceIndex];

    // Filter out source envelope from destination options
    const destinationEnvelopes = envelopes.filter(
        (e) => e.id !== sourceEnvelope?.id
    );

    // Update destination index if out of bounds (e.g. when list shrinks)
    useEffect(() => {
        if (destinationIndex >= destinationEnvelopes.length && destinationEnvelopes.length > 0) {
            setDestinationIndex(0);
        } else if (destinationEnvelopes.length === 0) {
            setDestinationIndex(0);
        }
    }, [destinationEnvelopes.length, destinationIndex]);

    const destinationEnvelope = destinationEnvelopes[destinationIndex];

    const handleTransferSubmit = () => {
        if (!sourceEnvelope) {
            setError("Selecione um envelope de origem");
            return;
        }
        if (!destinationEnvelope) {
            setError(t("envelope.validation.select_target"));
            return;
        }

        const numAmount = Number(amount);
        if (!amount || numAmount <= 0) {
            setError("O valor deve ser maior que zero");
            return;
        }

        if (sourceEnvelope && numAmount > (sourceEnvelope.amount || 0)) {
            setError(t("envelope.validation.insufficient_funds"));
            return;
        }

        transferMutation.mutate(
            {
                fromEnvelopeId: sourceEnvelope.id,
                toEnvelopeId: destinationEnvelope.id,
                amount: numAmount,
                year,
                month,
            },
            {
                onSuccess: () => {
                    navigate(paths.envelopes);
                },
            }
        );
    };

    const isTransferValid =
        sourceEnvelope &&
        destinationEnvelope &&
        Number(amount) > 0 &&
        (!sourceEnvelope || Number(amount) <= (sourceEnvelope.amount || 0));

    // Carousel Handlers
    const handlePrevSource = () => {
        setSourceIndex((prev) => (prev === 0 ? envelopes.length - 1 : prev - 1));
    };

    const handleNextSource = () => {
        setSourceIndex((prev) => (prev === envelopes.length - 1 ? 0 : prev + 1));
    };

    const handlePrevDest = () => {
        if (destinationEnvelopes.length === 0) return;
        setDestinationIndex((prev) => (prev === 0 ? destinationEnvelopes.length - 1 : prev - 1));
    };

    const handleNextDest = () => {
        if (destinationEnvelopes.length === 0) return;
        setDestinationIndex((prev) => (prev === destinationEnvelopes.length - 1 ? 0 : prev + 1));
    };

    return (
        <DashboardContent  sx={{width: '99%', my: 1, mx: 'auto', p: 1 }}>

            <Box sx={{
                flexGrow: 1,
                display: 'flex',
                pb: 1
            }}>
                <Card sx={{
                    p: { xs: 3, md: 5 },
                    width: 1,
                    height: 1, // Make card full height
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center', // Center content vertically
                    gap: 3
                }}>
                    <Stack spacing={4} sx={{ width: "100%", alignItems: "center", maxWidth: 800 }}> {/* Limit content width inside full card */}
                        {/* Transfer Cards Layout */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 2,
                                width: "100%",
                                flexDirection: { xs: "column", sm: "row" },
                            }}
                        >
                            {/* Source Envelope Selector */}
                            <Box sx={{ flex: 1, width: "100%", maxWidth: 350 }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ mb: 1, display: "block", textAlign: "center" }}
                                >
                                    {t("envelope.transfer.from")}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                    <IconButton onClick={handlePrevSource}>
                                        <Iconify icon="eva:arrow-ios-back-fill" />
                                    </IconButton>

                                    {sourceEnvelope ? (
                                        <Box sx={{
                                            width: 350, // Fixed width
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}>
                                            <RealEnvelopesCard envelope={sourceEnvelope} activeCard={false} />
                                        </Box>
                                    ) : (
                                        <Box sx={{ height: 140, width: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed grey', borderRadius: 2 }}>
                                            <Typography variant="body2" color="text.secondary">Sem envelopes</Typography>
                                        </Box>
                                    )}

                                    <IconButton onClick={handleNextSource}>
                                        <Iconify icon="eva:arrow-ios-forward-fill" />
                                    </IconButton>
                                </Box>
                            </Box>

                            {/* Arrow Icon */}
                            <Iconify
                                icon="solar:arrow-right-username-bold-duotone"
                                width={32}
                                sx={{
                                    color: "text.disabled",
                                    transform: { xs: "rotate(90deg)", sm: "none" },
                                }}
                            />

                            {/* Destination Envelope Selector */}
                            <Box sx={{ flex: 1, width: "100%", maxWidth: 350 }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ mb: 1, display: "block", textAlign: "center" }}
                                >
                                    {t("envelope.transfer.to")}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                    <IconButton onClick={handlePrevDest} disabled={destinationEnvelopes.length === 0}>
                                        <Iconify icon="eva:arrow-ios-back-fill" />
                                    </IconButton>

                                    {destinationEnvelope ? (
                                        <Box sx={{
                                            width: 350, // Fixed width
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}>
                                            <RealEnvelopesCard envelope={destinationEnvelope} activeCard={false} />
                                        </Box>
                                    ) : (
                                        <Box sx={{ height: 140, width: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed grey', borderRadius: 2 }}>
                                            <Typography variant="body2" color="text.secondary">Selecione o envelope</Typography>
                                        </Box>
                                    )}

                                    <IconButton onClick={handleNextDest} disabled={destinationEnvelopes.length === 0}>
                                        <Iconify icon="eva:arrow-ios-forward-fill" />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Box>

                        <TextField
                            fullWidth
                            type="number"
                            label={t("envelope.transfer.amount_label")}
                            placeholder="0,00"
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value);
                                setError(null);
                            }}
                            error={
                                !!error ||
                                (sourceEnvelope &&
                                    Number(amount) > (sourceEnvelope.amount || 0))
                            }
                            helperText={
                                error ||
                                (sourceEnvelope &&
                                    Number(amount) > (sourceEnvelope.amount || 0)
                                    ? t("envelope.validation.insufficient_funds")
                                    : "")
                            }
                            slotProps={{
                                input: {
                                    inputMode: "numeric",
                                    startAdornment: (
                                        <InputAdornment position="start">{symbol}</InputAdornment>
                                    ),
                                    sx: {
                                        textAlign: "right",
                                        color:
                                            sourceEnvelope &&
                                                Number(amount) > (sourceEnvelope.amount || 0)
                                                ? "error.main"
                                                : "inherit",
                                    },
                                },
                            }}
                            sx={{ maxWidth: 400 }}
                        />

                        <Stack direction="row" spacing={2} sx={{ width: '100%', maxWidth: 400 }}>
                            <Button
                                fullWidth
                                size="large"
                                color="inherit"
                                variant="outlined"
                                onClick={() => navigate(paths.envelopes)}
                            >
                                {t("common.back")}
                            </Button>

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={handleTransferSubmit}
                                loading={transferMutation.isPending}
                                disabled={!isTransferValid}
                            >
                                {t("common.transfer")}
                            </Button>
                        </Stack>
                    </Stack>
                </Card>
            </Box>
        </DashboardContent>
    );
}