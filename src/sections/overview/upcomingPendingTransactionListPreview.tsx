import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { Transactions, PaymentMethod } from "src/types/Transactions";
import { CreditCards } from "src/types/CreditCards";
import { Envelopes } from "src/types/Envelopes";
import { UpcomingPendingTransactionItem } from "src/sections/overview/upcomingPendingTransactionItem";

type Group = { dateKey: string; label: string; items: Transactions[] };

function groupByDate(items: Transactions[]): Group[] {
    const map = new Map<string, Group>();

    for (const item of items) {
        const d = dayjs(item.date);
        const key = d.format("YYYY-MM-DD");
        if (!map.has(key)) {
            const today = dayjs().startOf("day");
            const yesterday = dayjs().subtract(1, "day").startOf("day");
            let label: string;
            if (d.isSame(today, "day")) label = "Hoje";
            else if (d.isSame(yesterday, "day")) label = "Ontem";
            else label = d.locale("pt-br").format("DD [de] MMMM");
            map.set(key, { dateKey: key, label, items: [] });
        }
        map.get(key)!.items.push(item);
    }

    return Array.from(map.values());
}

type Props = {
    items: Transactions[];
    envelopes: Envelopes[];
    creditCards: CreditCards[];
    onMarkAsPaid: (transaction: Transactions, paymentMethod: PaymentMethod, creditCardId?: string) => void;
};

export function UpcomingPendingTransactionListPreview({ items, envelopes, creditCards, onMarkAsPaid }: Props) {
    const groups = groupByDate(items);

    return (
        <Box sx={{ px: 1.5, py: 1 }}>
            {groups.map((group) => (
                <Box key={group.dateKey} mb={1.5}>
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
                        <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0, fontWeight: 500 }}>
                            {group.label}
                        </Typography>
                        <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
                    </Box>

                    {group.items.map((item, idx) => (
                        <UpcomingPendingTransactionItem
                            key={item.id}
                            transaction={item}
                            envelopes={envelopes}
                            onMarkAsPaid={onMarkAsPaid}
                            creditCards={creditCards}
                            hideDivider={idx === group.items.length - 1}
                        />
                    ))}
                </Box>
            ))}
        </Box>
    );
}
