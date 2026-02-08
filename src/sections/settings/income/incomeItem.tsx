import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Stack,
    Box,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import { FormIncomes } from "src/sections/settings/income/form";
import { Incomes } from "src/types/Incomes";
import { useTranslation } from "react-i18next";
import { useCurrency } from "src/hooks/useCurrency";

type IncomeItemProps = {
    income: Incomes;
    onDelete: (id: string) => void;
};

export function IncomeItem({
    income,
    onDelete,
}: IncomeItemProps) {
    const { t } = useTranslation();
    const { symbol } = useCurrency();
    const { id, description, amount, paymentDay } = income;

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
                        color="success.main"
                        sx={{ flexShrink: 0 }}
                    >
                        {symbol} {amount}
                    </Typography>
                </Box>

                {/* Row 2: Payment Day */}
                <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                        {t('settings.income.table.headers.payment_day')}: {paymentDay}
                    </Typography>
                </Box>

                {/* Row 3: Actions */}
                <Box display="flex" justifyContent="flex-end" alignItems="center" sx={{ mt: 1 }}>
                    <Stack direction="row" spacing={0}>
                        <FormIncomes
                            data={income}
                            buttonIcon={<Edit fontSize="small" />}
                            buttonLabel={t('common.edit')}
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
