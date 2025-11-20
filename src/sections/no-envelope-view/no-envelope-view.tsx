import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useCreateProcessedIncomes } from "src/hooks/mutations/processed-incomes/useCreateProcessedIncomes";

import { RouterLink } from "src/routes/components";
import { IncomeStore } from "src/store/useIncomeStore";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";

// ----------------------------------------------------------------------

type NoEnvelopeViewProps = {
  title?: string;
  description?: string;
};

export function NoEnvelopeView({ title, description }: NoEnvelopeViewProps) {

  const { income } = IncomeStore();
  const { nextMonthToProcess, nextYearToProcess } = SelectedMonthYearStore();
  const processMutation = useCreateProcessedIncomes();
  const handleClickProcess = async () => {
    await processMutation.mutateAsync({
      description:`Renda do mês ${nextMonthToProcess}/${nextYearToProcess}`,
      totalIncomeProcessed: String(income),
      month: String(nextMonthToProcess),
      day: String(5),
      year: String(nextYearToProcess),
      isSplitted: true,
    });
  }

  return (
    <Container sx={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'80vh'}}>
      <Typography variant="h3" sx={{ mb: 2 }}>
        {title}
      </Typography>

      <Typography sx={{ color: "text.secondary" }}>
        {description}
      </Typography>

      <Button variant="contained" color="primary" onClick={handleClickProcess}>
        Processar {`${nextMonthToProcess} / ${nextYearToProcess}`}
      </Button>
    </Container>
  );
}
