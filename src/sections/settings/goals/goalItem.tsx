import { useState } from "react";
import { Avatar, Box, Chip, Divider, IconButton, Typography } from "@mui/material";
import { Delete, Savings } from "@mui/icons-material";
import { useDateFormat } from "src/hooks/useDateFormat";
import { GoalsForm } from "src/sections/settings/goals/form";
import { Goals } from "src/types/Goals";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { useCurrency } from "src/hooks/useCurrency";

type GoalItemProps = {
    goal: Goals;
    envelope: Envelopes;
    onDelete: (id: string) => void;
    hideDivider?: boolean;
};

export function GoalItem({ goal, envelope, onDelete, hideDivider }: GoalItemProps) {
    const { t } = useTranslation();
    const { symbol } = useCurrency();
    const { formatDate } = useDateFormat();
    const { id, description, amountTotal, percentage, deadline } = goal;
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
                        bgcolor: "primary.lighter",
                        flexShrink: 0,
                    }}
                >
                    <Savings sx={{ color: "primary.main", fontSize: 16 }} />
                </Avatar>

                <Box flex={1} minWidth={0}>
                    <Typography variant="subtitle2" fontWeight={600} noWrap>
                        {description}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.75} mt={0.25}>
                        <Chip
                            label={`${percentage} %`}
                            size="small"
                            color="info"
                            variant="outlined"
                            sx={{ height: 18, fontSize: "0.65rem" }}
                        />
                        <Typography variant="caption" color="text.secondary">
                            {formatDate(deadline)}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.25 }}>
                    <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                        {symbol} {amountTotal}
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

            <GoalsForm
                data={goal}
                buttonLabel={t('common.edit')}
                envelope={envelope}
                externalOpen={editOpen}
                onExternalClose={() => setEditOpen(false)}
            />
        </>
    );
}
