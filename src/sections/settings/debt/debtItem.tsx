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
import { DebtForm } from "src/sections/settings/debt/form";
import { Debts } from "src/types/Debts";
import { Envelopes } from "src/types/Envelopes";
import { useTranslation } from "react-i18next";
import { useCurrency } from "src/hooks/useCurrency";

type DebtItemProps = {
    debt: Debts;
    envelopes: Envelopes[];
    onDelete: (id: string) => void;
};

export function DebtItem({
    debt,
    envelopes,
    onDelete,
}: DebtItemProps) {
    const { t } = useTranslation();
    const { symbol } = useCurrency();
    const { id, description, amount, paymentDay, installmentsPaid, installmentsTotal } = debt;

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
                        color="error.main"
                        sx={{ flexShrink: 0 }}
                    >
                        {symbol} {amount}
                    </Typography>
                </Box>

                {/* Row 2: Installments + Payment Day */}
                <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 0.5 }}>
                    <Chip
                        label={`${installmentsPaid}/${installmentsTotal}`}
                        size="small"
                        color="warning"
                        variant="outlined"
                        sx={{ height: 20, fontSize: "0.675rem" }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        &bull; {t('settings.debt.table.headers.payment_day')}: {paymentDay}
                    </Typography>
                </Box>

                {/* Row 3: Actions */}
                <Box display="flex" justifyContent="flex-end" alignItems="center" sx={{ mt: 1 }}>
                    <Stack direction="row" spacing={0}>
                        <DebtForm
                            data={debt}
                            buttonIcon={<Edit fontSize="small" />}
                            buttonLabel={t('common.edit')}
                            envelopes={envelopes}
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
