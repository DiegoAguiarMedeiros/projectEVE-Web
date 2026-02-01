import { Envelopes } from "src/types/Envelopes";
import { Reallocation } from "../Reallocation";

// ----------------------------------------------------------------------

type ReallocationViewProps = {
    envelopes: Envelopes[];
    envelopeSelected: number | null;
};

export function ReallocationView({ envelopes, envelopeSelected }: ReallocationViewProps) {

    return (
        <Reallocation envelopes={envelopes} envelopeSelected={envelopeSelected} />
    );
}
