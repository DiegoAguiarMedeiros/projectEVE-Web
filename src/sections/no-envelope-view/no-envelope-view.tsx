import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCreateProcessedIncomes } from "src/hooks/mutations/processed-incomes/useCreateProcessedIncomes";
import { IncomeForm } from "src/sections/incomes/form";

import { IncomeStore } from "src/store/useIncomeStore";
import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";

// ----------------------------------------------------------------------

type NoEnvelopeViewProps = {
  title?: string;
  description?: string;
};

export function NoEnvelopeView({ title, description }: NoEnvelopeViewProps) {
  const { t } = useTranslation();
  const { income } = IncomeStore();
  const { nextMonthToProcess, nextYearToProcess } = SelectedMonthYearStore();
  const processMutation = useCreateProcessedIncomes();

  const [incomeModalOpen, setIncomeModalOpen] = useState(false);

  const handleClickProcess = async () => {
    if (!income) {
      setIncomeModalOpen(true);
      return;
    }

    await processMutation.mutateAsync({
      description: t('home.income_description', { month: nextMonthToProcess, year: nextYearToProcess }),
      totalIncomeProcessed: String(income),
      month: String(nextMonthToProcess),
      day: String(5),
      year: String(nextYearToProcess),
      isSplitted: true,
    });
  }

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
      <Typography variant="h3" sx={{ mb: 2 }}>
        {title}
      </Typography>

      <Typography sx={{ color: "text.secondary" }}>
        {description}
      </Typography>

      <Button variant="contained" color="primary" onClick={handleClickProcess}>
        {t('home.process_button', { month: nextMonthToProcess, year: nextYearToProcess })}
      </Button>

      <IncomeForm
        buttonLabel=""
        envelopes={[]}
        externalOpen={incomeModalOpen}
        onExternalClose={() => setIncomeModalOpen(false)}
        fixedMonth={nextMonthToProcess}
        fixedYear={nextYearToProcess}
      />
    </Container>
  );
}
