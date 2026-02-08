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
import { CreditCardForm } from "src/sections/settings/creditCards/form";
import { CreditCards } from "src/types/CreditCards";
import { useTranslation } from "react-i18next";

type CreditCardItemProps = {
    creditCard: CreditCards;
    onDelete: (id: string) => void;
};

export function CreditCardItem({
    creditCard,
    onDelete,
}: CreditCardItemProps) {
    const { t } = useTranslation();
    const { id, name, flag } = creditCard;

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
                {/* Row 1: Name + Flag */}
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
                        {name}
                    </Typography>
                    <Chip
                        label={flag}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ height: 22, fontSize: "0.75rem" }}
                    />
                </Box>

                {/* Row 2: Actions */}
                <Box display="flex" justifyContent="flex-end" alignItems="center" sx={{ mt: 1 }}>
                    <Stack direction="row" spacing={0}>
                        <CreditCardForm
                            data={creditCard}
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
