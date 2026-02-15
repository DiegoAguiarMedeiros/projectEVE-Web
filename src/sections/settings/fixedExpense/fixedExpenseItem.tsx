import { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Box,
    Chip,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import { FixedExpenseForm } from "src/sections/settings/fixedExpense/form";
import { FixedExpenses } from "src/types/FixedExpenses";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { fCurrency } from "src/utils/format-number";

type FixedExpenseItemProps = {
    fixedExpense: FixedExpenses;
    envelopes: Envelopes[];
    onDelete: (id: string) => void;
};

export function FixedExpenseItem({
    fixedExpense,
    envelopes,
    onDelete,
}: FixedExpenseItemProps) {
    const { t } = useTranslation();
    const { id, description, envelopeId, amount, paymentDay } = fixedExpense;
    const [editOpen, setEditOpen] = useState(false);

    const envelopeName = envelopes.find(e => e.id === envelopeId)?.name || "";

    return (
        <>
            <Card
                onClick={() => setEditOpen(true)}
                sx={{
                    borderRadius: 2,
                    boxShadow: 1,
                    cursor: "pointer",
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    "&:active": (theme) => ({
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                    }),
                }}
            >
                <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                    {/* Row 1: Description + Amount */}
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
                        <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            sx={{
                                flex: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {description}
                        </Typography>
                        <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            color="error.main"
                            sx={{ flexShrink: 0 }}
                        >
                            - {fCurrency(amount)}
                        </Typography>
                    </Box>

                    {/* Row 2: Envelope + Payment Day + Delete */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <Chip
                                label={t(envelopeName)}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ height: 20, fontSize: "0.675rem" }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                &bull; {t('settings.fixed_expense.table.headers.payment_day')}: {paymentDay}
                            </Typography>
                        </Box>
                        <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => { e.stopPropagation(); onDelete(id); }}
                        >
                            <Delete fontSize="small" />
                        </IconButton>
                    </Box>
                </CardContent>
            </Card>

            <FixedExpenseForm
                data={fixedExpense}
                buttonLabel={t('common.edit')}
                envelopes={envelopes}
                externalOpen={editOpen}
                onExternalClose={() => setEditOpen(false)}
            />
        </>
    );
}
