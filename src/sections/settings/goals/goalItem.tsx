import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Stack,
    Box,
    Chip,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import dayjs from "dayjs";
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
    const { id, description, amountTotal, percentage, deadline } = goal;

    return (
        <Card
            sx={{
                borderRadius: 2,
                boxShadow: 1,
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

                {/* Row 2: Percentage + Deadline */}
                <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 0.5 }}>
                    <Chip
                        label={`${percentage} %`}
                        size="small"
                        color="info"
                        variant="outlined"
                        sx={{ height: 20, fontSize: "0.675rem" }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        &bull; {dayjs(deadline).format("DD/MM/YYYY")}
                    </Typography>
                </Box>

                {/* Row 3: Actions */}
                <Box display="flex" justifyContent="flex-end" alignItems="center" sx={{ mt: 1 }}>
                    <Stack direction="row" spacing={0}>
                        <GoalsForm
                            data={goal}
                            buttonIcon={<Edit fontSize="small" />}
                            buttonLabel={t('common.edit')}
                            envelope={envelope}
                        />
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDelete(id)}
                        >
                            <Delete fontSize="small" />
                        </IconButton>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}
