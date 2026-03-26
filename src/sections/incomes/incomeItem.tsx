import { useState } from "react";
import { Avatar, Box, Chip, Divider, IconButton, Typography } from "@mui/material";
import { ArrowDownward, Delete } from "@mui/icons-material";
import { useDateFormat } from "src/hooks/useDateFormat";
import { IncomeForm } from "src/sections/incomes/form";
import { ProcessedIncomes } from "src/types/ProcessedIncomes";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { fCurrency } from "src/utils/format-number";

type IncomeItemProps = {
    income: ProcessedIncomes;
    envelopes: Envelopes[];
    onDelete: (id: string) => void;
    hideDivider?: boolean;
};

export function IncomeItem({ income, envelopes, onDelete, hideDivider }: IncomeItemProps) {
    const { t } = useTranslation();
    const { formatDate } = useDateFormat();
    const { id, description, totalIncomeProcessed, day, month, year, isSplitted } = income;
    const [editOpen, setEditOpen] = useState(false);

    return (
        <>
            <Box
                display="flex"
                alignItems="center"
                gap={1.5}
                py={1.25}
                px={0.5}
                onClick={() => setEditOpen(true)}
                sx={{ cursor: "pointer" }}
            >
                <Avatar
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1.5,
                        bgcolor: "success.lighter",
                        flexShrink: 0,
                    }}
                >
                    <ArrowDownward sx={{ color: "success.main", fontSize: 16 }} />
                </Avatar>

                <Box flex={1} minWidth={0}>
                    <Typography variant="subtitle2" fontWeight={600} noWrap>
                        {description}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.75} mt={0.25}>
                        <Typography variant="caption" color="text.secondary">
                            {formatDate(`${year}-${month}-${day}`)}
                        </Typography>
                        <Chip
                            label={isSplitted ? t('income.table.all') : t('income.table.one')}
                            size="small"
                            color="info"
                            variant="outlined"
                            sx={{ height: 18, fontSize: "0.65rem" }}
                        />
                    </Box>
                </Box>

                <Box sx={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.25 }}>
                    <Typography variant="subtitle2" fontWeight={700} color="success.main">
                        + {fCurrency(totalIncomeProcessed)}
                    </Typography>
                    <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => { e.stopPropagation(); onDelete(id); }}
                        sx={{ p: 0.25 }}
                    >
                        <Delete sx={{ fontSize: 14 }} />
                    </IconButton>
                </Box>
            </Box>

            {!hideDivider && <Divider />}

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
