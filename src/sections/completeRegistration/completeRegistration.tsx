import * as React from "react";
import { useRouter } from "src/routes/hooks";
import { useCompleteRegistration } from "src/hooks/mutations/user/useCompleteRegistration";
import { usePaths } from "src/hooks/usePaths";

import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import Button from "@mui/material/Button";
import Stepper from "@mui/material/Stepper";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Alert, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ChipTabs } from "src/components/chip-tabs";

import { IncomeTable, IncomesDisplay } from "src/sections/settings/income";
import { EnvelopesTable } from "src/sections/settings/envelope";
import { GoalsTable, GoalsDisplay } from "src/sections/settings/goals";
import { FixedExpenseTable, FixedExpensesDisplay } from "src/sections/settings/fixedExpense";
import { DebtTable, DebtsDisplay } from "src/sections/settings/debt";
import { CreditCardsTable, CreditCardsDisplay } from "src/sections/settings/creditCards";

import { useListIncomes } from "src/hooks/queries/incomes/useListIncomes";
import { useListEnvelopes } from "src/hooks/queries/envelopes/useListEnvelopes";
import { useListGoals } from "src/hooks/queries/goals/useListGoals";
import { useListFixedExpenses } from "src/hooks/queries/fixed-expenses/useListFixedExpenses";
import { useListDebts } from "src/hooks/queries/debts/useListDebts";
import { useListCreditCards } from "src/hooks/queries/credit-cards/useListCreditCards";
import { useTable } from "src/sections/shared/useTable";
import { useTranslation } from "react-i18next";
import { useTotalIncomes } from "src/hooks/queries/incomes/useTotalIncomes";
import { IncomeStore } from "src/store/useIncomeStore";

const STEP_KEYS = [
  "complete_registration.steps.income",
  "complete_registration.steps.fixed_expenses",
  "complete_registration.steps.debts",
  "complete_registration.steps.credit_cards",
  "complete_registration.steps.goals",
  "complete_registration.steps.envelopes",
];

export function CompleteRegistrationView() {
  const router = useRouter();
  const table = useTable();
  const { t } = useTranslation();
  const paths = usePaths();
  const [activeStep, setActiveStep] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const steps = STEP_KEYS.map((key) => t(key));

  const { mutate: completeRegistration, isPending } = useCompleteRegistration(() => {
    router.push(paths.home);
  });

  const { setIncome } = IncomeStore();
  const { data: totalIncomes } = useTotalIncomes();

  React.useEffect(() => {
    if (totalIncomes?.total != null) {
      setIncome(totalIncomes.total);
    }
  }, [totalIncomes, setIncome]);

  const { data: incomes } = useListIncomes(table);
  const { data: envelopes } = useListEnvelopes();
  const { data: goals } = useListGoals(table);
  const { data: fixedExpenses } = useListFixedExpenses(table);
  const { data: debts } = useListDebts(table);
  const { data: creditCards } = useListCreditCards(table);

  const envelopeAllocation = React.useMemo(() => {
    if (!envelopes) return 0;
    return envelopes.reduce((acc, item) => acc + item.percentage, 0);
  }, [envelopes]);

  const canFinish = envelopeAllocation === 100;
  const isLastStep = activeStep === steps.length - 1;

  const handleFinish = () => {
    if (!canFinish) return;
    completeRegistration();
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleFinish();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const renderContent = () => {
    if (isMobile) {
      switch (activeStep) {
        case 0:
          return <IncomesDisplay incomes={incomes} table={table} />;
        case 1:
          return <FixedExpensesDisplay fixedExpenses={fixedExpenses} envelopes={envelopes || []} table={table} />;
        case 2:
          return <DebtsDisplay debts={debts} envelopes={envelopes || []} table={table} />;
        case 3:
          return <CreditCardsDisplay creditCards={creditCards} table={table} />;
        case 4:
          return <GoalsDisplay goals={goals} envelope={(envelopes || []).filter(e => e.name === 'goals')[0]} table={table} />;
        case 5:
          return <EnvelopesTable envelopes={envelopes || []} />;
        default:
          return null;
      }
    }

    switch (activeStep) {
      case 0:
        return <IncomeTable incomes={incomes} table={table} />;
      case 1:
        return <FixedExpenseTable fixedExpenses={fixedExpenses} envelopes={envelopes || []} table={table} />;
      case 2:
        return <DebtTable debts={debts} envelopes={envelopes || []} table={table} />;
      case 3:
        return <CreditCardsTable creditCards={creditCards} table={table} />;
      case 4:
        return <GoalsTable goals={goals} envelope={(envelopes || []).filter(e => e.name === 'goals')[0]} table={table} />;
      case 5:
        return <EnvelopesTable envelopes={envelopes || []} />;
      default:
        return null;
    }
  };

  return (
    <Container
      sx={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        py: isMobile ? 1 : 2,
        px: isMobile ? 1 : 3,
      }}
    >
      {/* Header fixo */}
      <Box sx={{ flexShrink: 0, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h4" sx={{ mb: 0.5 }}>
          {t('complete_registration.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {t('complete_registration.subtitle')}
        </Typography>

        {!canFinish && (
          <Alert
            severity="warning"
            variant="filled"
            sx={{ mb: 2, width: "100%", fontSize: "0.95rem", fontWeight: 600 }}
          >
            {t('complete_registration.allocation_warning')}
          </Alert>
        )}

        {isMobile ? (
          <Box sx={{ width: "100%", mb: 2 }}>
            <ChipTabs
              tabs={steps.map((label, index) => ({ label, index }))}
              activeIndex={activeStep}
              onChange={setActiveStep}
            />
          </Box>
        ) : (
          <Stepper activeStep={activeStep} sx={{ width: "100%", mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}
      </Box>

      {/* Conteúdo com scroll interno */}
      <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", width: "100%" }}>
        {renderContent()}
      </Box>

      {/* Botões sempre visíveis */}
      <Box sx={{ flexShrink: 0, display: "flex", justifyContent: "space-between", pt: 2, width: "100%" }}>
        <Button
          disabled={activeStep === 0 || isPending}
          onClick={handleBack}
          variant="outlined"
          color="inherit"
        >
          {t('complete_registration.back')}
        </Button>

        <Box sx={{ display: "flex", gap: 1 }}>
          {!isLastStep && (
            <Button variant="outlined" onClick={handleNext} disabled={isPending}>
              {t('complete_registration.continue')}
            </Button>
          )}
          {isLastStep && (
            <Button
              variant="contained"
              onClick={handleFinish}
              disabled={!canFinish || isPending}
              loading={isPending}
            >
              {t('complete_registration.finish')}
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
}
