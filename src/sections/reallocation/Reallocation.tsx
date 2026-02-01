
import { CardProps, Box, Button, Card, Stack, Typography, FormControl, Select, MenuItem, TextField, InputAdornment } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Iconify } from "src/components/iconify";
import { useTransferBalance } from "src/hooks/mutations/envelopes/useTransferBalance";
import { DashboardContent } from "src/layouts/dashboard";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { RealEnvelopesCard } from "src/sections/envelope/RealEnvelopeCard";
import { Envelopes } from "src/types/Envelopes";

type ReallocationProps = {
    envelopes: Envelopes[];
    envelopeSelected: number | null;
};

export function Reallocation({ envelopes, envelopeSelected }: ReallocationProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { month, year } = SelectedMonthYearStore();
    const transferMutation = useTransferBalance();

    console.log("envelopeSelected", envelopeSelected);
    console.log("envelopes", envelopes);

    const [fromEnvelopeId, setFromEnvelopeId] = useState(envelopeSelected != null ? envelopes[envelopeSelected]?.id : "");
    const [toEnvelopeId, setToEnvelopeId] = useState("");
    const [amount, setAmount] = useState<number | string>("");
    const [error, setError] = useState<string | null>(null);

    const sourceEnvelope = envelopes.find((e) => e.id === fromEnvelopeId);

    // Filter out source envelope from destination options
    const destinationEnvelopes = envelopes.filter(
        (e) => e.id !== fromEnvelopeId
    );

    const handleTransferSubmit = () => {
        if (!fromEnvelopeId) {
            setError("Selecione um envelope de origem");
            return;
        }
        if (!toEnvelopeId) {
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
                fromEnvelopeId,
                toEnvelopeId,
                amount: numAmount,
                year,
                month,
            },
            {
                onSuccess: () => {
                    navigate("/envelopes");
                },
            }
        );
    };

    const isTransferValid =
        fromEnvelopeId &&
        toEnvelopeId &&
        Number(amount) > 0 &&
        (!sourceEnvelope || Number(amount) <= (sourceEnvelope.amount || 0));

    return (
        <DashboardContent>

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
                            <Box sx={{ flex: 1, width: "100%", maxWidth: 286 }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ mb: 1, display: "block", textAlign: "center" }}
                                >
                                    {t("envelope.transfer.from")}
                                </Typography>
                                <FormControl fullWidth>
                                    <Select
                                        value={fromEnvelopeId}
                                        onChange={(e) => {
                                            setFromEnvelopeId(e.target.value);
                                            if (e.target.value === toEnvelopeId) {
                                                setToEnvelopeId("");
                                            }
                                        }}
                                        displayEmpty
                                        renderValue={(selected) => {
                                            if (!selected) {
                                                return (
                                                    <Typography color="text.disabled" align="center">
                                                        Selecione o envelope
                                                    </Typography>
                                                );
                                            }
                                            const env = envelopes.find((e) => e.id === selected);
                                            return env ? (
                                                <Box
                                                    sx={{
                                                        width: "100%",
                                                        pointerEvents: "none",
                                                        minHeight: 110,
                                                    }}
                                                >
                                                    <RealEnvelopesCard envelope={env} activeCard={false} />
                                                </Box>
                                            ) : (
                                                selected
                                            );
                                        }}
                                        sx={{
                                            width: "100%",
                                            "& .MuiSelect-select": {
                                                padding: "0 !important",
                                                minHeight: "auto",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            },
                                            "& fieldset": { border: "none" },
                                            ...(!fromEnvelopeId && {
                                                border: "1px dashed",
                                                borderColor: "text.disabled",
                                                borderRadius: 2,
                                                minHeight: 130,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }),
                                            ...(fromEnvelopeId && {
                                                "& .MuiSelect-select": {
                                                    overflow: "visible",
                                                },
                                            }),
                                        }}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    maxHeight: 400,
                                                    bgcolor: "transparent",
                                                    boxShadow: "none",
                                                    "& .MuiList-root": {
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: 1,
                                                        p: 1,
                                                    },
                                                },
                                            },
                                        }}
                                    >
                                        {envelopes.map((env) => (
                                            <MenuItem
                                                key={env.id}
                                                value={env.id}
                                                sx={{
                                                    p: 0,
                                                    bgcolor: "transparent !important",
                                                    "&:hover": { transform: "scale(1.02)" },
                                                    transition: "transform 0.2s",
                                                    mb: 1,
                                                }}
                                            >
                                                <RealEnvelopesCard envelope={env} activeCard={false} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
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
                            <Box sx={{ flex: 1, width: "100%", maxWidth: 286 }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ mb: 1, display: "block", textAlign: "center" }}
                                >
                                    {t("envelope.transfer.to")}
                                </Typography>
                                <FormControl fullWidth>
                                    <Select
                                        value={toEnvelopeId}
                                        onChange={(e) => setToEnvelopeId(e.target.value)}
                                        displayEmpty
                                        disabled={!fromEnvelopeId}
                                        renderValue={(selected) => {
                                            if (!selected) {
                                                return (
                                                    <Typography color="text.disabled" align="center">
                                                        Selecione o envelope
                                                    </Typography>
                                                );
                                            }
                                            const env = envelopes.find((e) => e.id === selected);
                                            return env ? (
                                                <Box
                                                    sx={{
                                                        width: "100%",
                                                        pointerEvents: "none",
                                                        minHeight: 110,
                                                    }}
                                                >
                                                    <RealEnvelopesCard envelope={env} activeCard={false} />
                                                </Box>
                                            ) : (
                                                selected
                                            );
                                        }}
                                        sx={{
                                            width: "100%",
                                            "& .MuiSelect-select": {
                                                padding: "0 !important",
                                                minHeight: "auto",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            },
                                            "& fieldset": { border: "none" },
                                            ...(!toEnvelopeId && {
                                                border: "1px dashed",
                                                borderColor: "text.disabled",
                                                borderRadius: 2,
                                                minHeight: 130,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }),
                                            ...(toEnvelopeId && {
                                                "& .MuiSelect-select": {
                                                    overflow: "visible",
                                                },
                                            }),
                                        }}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    maxHeight: 400,
                                                    bgcolor: "transparent",
                                                    boxShadow: "none",
                                                    "& .MuiList-root": {
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: 1,
                                                        p: 1,
                                                    },
                                                },
                                            },
                                        }}
                                    >
                                        {destinationEnvelopes.map((env) => (
                                            <MenuItem
                                                key={env.id}
                                                value={env.id}
                                                sx={{
                                                    p: 0,
                                                    bgcolor: "transparent !important",
                                                    "&:hover": { transform: "scale(1.02)" },
                                                    transition: "transform 0.2s",
                                                    mb: 1,
                                                }}
                                            >
                                                <RealEnvelopesCard envelope={env} activeCard={false} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
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
                                        <InputAdornment position="start">R$</InputAdornment>
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
                                onClick={() => navigate("/envelopes")}
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