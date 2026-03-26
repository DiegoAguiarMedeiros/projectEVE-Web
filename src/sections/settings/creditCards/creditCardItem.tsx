import { useState } from "react";
import { Avatar, Box, Chip, Divider, IconButton, Typography } from "@mui/material";
import { CreditCard, Delete } from "@mui/icons-material";
import { CreditCardForm } from "src/sections/settings/creditCards/form";
import { CreditCards } from "src/types/CreditCards";
import { useTranslation } from "react-i18next";

type CreditCardItemProps = {
    creditCard: CreditCards;
    onDelete: (id: string) => void;
    hideDivider?: boolean;
};

export function CreditCardItem({ creditCard, onDelete, hideDivider }: CreditCardItemProps) {
    const { t } = useTranslation();
    const { id, name, flag } = creditCard;
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
                    <CreditCard sx={{ color: "primary.main", fontSize: 16 }} />
                </Avatar>

                <Box flex={1} minWidth={0}>
                    <Typography variant="subtitle2" fontWeight={600} noWrap>
                        {name}
                    </Typography>
                </Box>

                <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Chip
                        label={flag}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ height: 18, fontSize: "0.65rem" }}
                    />
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

            <CreditCardForm
                data={creditCard}
                buttonLabel={t('common.edit')}
                externalOpen={editOpen}
                onExternalClose={() => setEditOpen(false)}
            />
        </>
    );
}
