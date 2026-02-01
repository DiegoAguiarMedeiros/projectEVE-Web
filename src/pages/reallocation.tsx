import { useListEnvelopesWithAmount } from "src/hooks/queries/envelopes/useListEnvelopesWithAmount";
import { ReallocationView } from "src/sections/reallocation/view";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { CONFIG } from "src/config-global";
import ConfigSkeleton from "src/components/skeleton/ConfigSkeleton";

export default function ReallocationPage() {
    const { month, year } = SelectedMonthYearStore();
    const { data: envelopes, isLoading } = useListEnvelopesWithAmount(year, month);
    const envelopeSelected = localStorage.getItem("lastSlideIndex");
    if (isLoading) {
        return (
            <>
                <title> {`Transferência - ${CONFIG.appName}`}</title>
                <ConfigSkeleton />
            </>
        );
    }

    return (
        <>
            <title> {`Transferência - ${CONFIG.appName}`}</title>
            <ReallocationView envelopes={envelopes || []} envelopeSelected={envelopeSelected ? parseInt(envelopeSelected, 10) : null} />
        </>
    );
}
