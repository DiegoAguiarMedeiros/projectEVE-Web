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
import dayjs from "dayjs";
import { IncomeForm } from "src/sections/incomes/form";
import { ProcessedIncomes } from "src/types/ProcessedIncomes";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { fCurrency } from "src/utils/format-number";

type IncomeItemProps = {
    income: ProcessedIncomes;
    envelopes: Envelopes[];
    onDelete: (id: string) => void;
};

export function IncomeItem({
    income,
    envelopes,
    onDelete,
}: IncomeItemProps) {
    const { t } = useTranslation();
    const { id, description, totalIncomeProcessed, day, month, year, isSplitted } = income;
    const [editOpen, setEditOpen] = useState(false);

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
                            color="success.main"
                            sx={{ flexShrink: 0 }}
                        >
                            + {fCurrency(totalIncomeProcessed)}
                        </Typography>
                    </Box>

                    {/* Row 2: Date + Split info + Delete */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <Typography variant="caption" color="text.secondary">
                                {dayjs(`${year}-${month}-${day}`).format("DD/MM/YYYY")}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                &bull;
                            </Typography>
                            <Chip
                                label={isSplitted ? t('income.table.all') : t('income.table.one')}
                                size="small"
                                color="info"
                                variant="outlined"
                                sx={{ height: 20, fontSize: "0.675rem" }}
                            />
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

            <IncomeForm
                data={income}
                buttonLabel={t('common.edit')}
                envelopes={envelopes}
                externalOpen={editOpen}
                onExternalClose={() => setEditOpen(false)}
            />
        </>
    );
}
