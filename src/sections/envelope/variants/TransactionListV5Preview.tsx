import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { Transactions, TransactionsUpdateStatus } from "src/types/Transactions";
import { TransactionItemV5 } from "src/sections/envelope/variants/TransactionItemV5";

type Props = {
    items: Transactions[];
    onUpdateStatus: (data: TransactionsUpdateStatus) => void;
    getTranslatedDescription: (desc: string, isTranslatable?: boolean) => string;
};

type Group = {
    dateKey: string;
    label: string;
    items: Transactions[];
};

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

export function TransactionListV5Preview({ items, onUpdateStatus, getTranslatedDescription }: Props) {
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
                        <TransactionItemV5
                            key={item.id}
                            transaction={item}
                            onUpdateStatus={onUpdateStatus}
                            getTranslatedDescription={getTranslatedDescription}
                            hideDivider={idx === group.items.length - 1}
                        />
                    ))}
                </Box>
            ))}
        </Box>
    );
}
