import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { ProcessedIncomes } from "src/types/ProcessedIncomes";
import { IncomeItem } from "src/sections/incomes/incomeItem";
import { Envelopes } from "src/types/Envelopes";

type Group = { dateKey: string; label: string; items: ProcessedIncomes[] };

function groupByDate(items: ProcessedIncomes[]): Group[] {
    const map = new Map<string, Group>();

    for (const item of items) {
        const key = `${item.year}-${String(item.month).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`;
        if (!map.has(key)) {
            const d = dayjs(key);
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
    items: ProcessedIncomes[];
    envelopes: Envelopes[];
    onDelete: (id: string) => void;
};

export function IncomeListPreview({ items, envelopes, onDelete }: Props) {
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
                        <IncomeItem
                            key={item.id}
                            income={item}
                            envelopes={envelopes}
                            onDelete={onDelete}
                            hideDivider={idx === group.items.length - 1}
                        />
                    ))}
                </Box>
            ))}
        </Box>
    );
}
