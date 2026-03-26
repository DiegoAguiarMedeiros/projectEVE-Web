import { ItemList } from "src/components/itemList/ItemList";
import { ProcessedIncomes } from "src/types/ProcessedIncomes";
import { IncomeItem } from "src/sections/incomes/incomeItem";
import { Envelopes } from "src/types/Envelopes";

type Props = {
    items: ProcessedIncomes[];
    envelopes: Envelopes[];
    onDelete: (id: string) => void;
};

export function IncomeListPreview({ items, envelopes, onDelete }: Props) {
    return (
        <ItemList
            items={items}
            keyExtractor={(item) => item.id}
            getDateKey={(item) => `${item.year}-${String(item.month).padStart(2, "0")}-${String(item.day).padStart(2, "0")}`}
            renderItem={(item, hideDivider) => (
                <IncomeItem
                    income={item}
                    envelopes={envelopes}
                    onDelete={onDelete}
                    hideDivider={hideDivider}
                />
            )}
        />
    );
}
