import { useState } from "react";
import { CreditCard, Delete, Edit } from "@mui/icons-material";
import { Chip } from "@mui/material";
import { CreditCardForm } from "src/sections/settings/creditCards/form";
import { CreditCards } from "src/types/CreditCards";
import { useTranslation } from "react-i18next";
import { ItemRow } from "src/components/itemList/ItemList";

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
            <ItemRow
                hideDivider={hideDivider}
                config={{
                    avatar: {
                        bgcolor: "primary.lighter",
                        icon: <CreditCard sx={{ color: "primary.main", fontSize: 16 }} />,
                    },
                    title: name,
                    subtitle: <></>,
                    amount: (
                        <Chip
                            label={flag}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ height: 18, fontSize: "0.65rem" }}
                        />
                    ),
                    menuActions: [
                        {
                            label: t("common.edit"),
                            icon: <Edit fontSize="small" />,
                            onClick: () => setEditOpen(true),
                        },
                        {
                            label: t("common.delete"),
                            icon: <Delete fontSize="small" />,
                            onClick: () => onDelete(id),
                            color: "error",
                        },
                    ],
                }}
            />
            <CreditCardForm
                data={creditCard}
                buttonLabel={t('common.edit')}
                externalOpen={editOpen}
                onExternalClose={() => setEditOpen(false)}
            />
        </>
    );
}
