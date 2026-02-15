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
                    {/* Row 1: Name + Flag + Delete */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
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
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <Chip
                                label={flag}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ height: 22, fontSize: "0.75rem" }}
                            />
                            <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => { e.stopPropagation(); onDelete(id); }}
                            >
                                <Delete fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            <CreditCardForm
                data={creditCard}
                buttonLabel={t('common.edit')}
                externalOpen={editOpen}
                onExternalClose={() => setEditOpen(false)}
            />
        </>
    );
}
