import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useProcessIncomes } from "src/hooks/mutations/process-incomes/useProcessIncomes";

import { RouterLink } from "src/routes/components";
import { IncomeStore } from "src/store/useIncomeStore";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";

// ----------------------------------------------------------------------

type NoDataViewProps = {
  title?: string;
  description?: string;
};

export function NoDataView({ title, description }: NoDataViewProps) {

  const { income } = IncomeStore();
  const { nextMonthToProcess, nextYearToProcess } = SelectedMonthYearStore();
  const processMutation = useProcessIncomes();
  const handleClickProcess = async () => {
    await processMutation.mutateAsync({
      totalIncomeProcessed: income,
      month: nextMonthToProcess,
      day: 5,
      year: nextYearToProcess,
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
      income: {income}
    </Container>
  );
}
