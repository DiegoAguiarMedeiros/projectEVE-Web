import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAllIncomes } from "src/hooks/queries/incomes/useAllIncomes";
import { useProcessAllIncomes } from "src/hooks/mutations/processed-incomes/useProcessAllIncomes";
import { IncomeForm } from "src/sections/incomes/form";

import { SelectedMonthYearStore } from "src/store/useSelectedMonthYearStore";
import { IncomeStore } from "src/store/useIncomeStore";
import { useCreateProcessedIncomes } from "src/hooks/mutations/processed-incomes/useCreateProcessedIncomes";

// ----------------------------------------------------------------------

type NoEnvelopeViewProps = {
  title?: string;
  description?: string;
};

export function NoEnvelopeView({ title, description }: NoEnvelopeViewProps) {
  const { t } = useTranslation();

  const { income } = IncomeStore();
  const { month, year } = SelectedMonthYearStore();
  const processAllMutation = useProcessAllIncomes();

  const monthKey = new Date(year, month - 1).toLocaleString('en', { month: 'long' }).toLowerCase();
  const monthName = t(`months.${monthKey}`);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);


  const handleClickProcess = async () => {
    if (!income) {
      setIncomeModalOpen(true);
      return;
    }

    await processAllMutation.mutateAsync({
      month,
      year,
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
        {t('home.process_button', { month: monthName, year })}
      </Button>

      <IncomeForm
        buttonLabel=""
        envelopes={[]}
        externalOpen={incomeModalOpen}
        onExternalClose={() => setIncomeModalOpen(false)}
        fixedMonth={month}
        fixedYear={year}
      />
    </Container>
  );
}
