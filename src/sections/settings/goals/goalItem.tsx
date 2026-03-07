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
};

export function GoalItem({
    goal,
    envelope,
    onDelete,
}: GoalItemProps) {
    const { t } = useTranslation();
    const { symbol } = useCurrency();
    const { formatDate } = useDateFormat();
    const { id, description, amountTotal, percentage, deadline } = goal;
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
                            color="primary.main"
                            sx={{ flexShrink: 0 }}
                        >
                            {symbol} {amountTotal}
                        </Typography>
                    </Box>

                    {/* Row 2: Percentage + Deadline + Delete */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <Chip
                                label={`${percentage} %`}
                                size="small"
                                color="info"
                                variant="outlined"
                                sx={{ height: 20, fontSize: "0.675rem" }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                &bull; {formatDate(deadline)}
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
