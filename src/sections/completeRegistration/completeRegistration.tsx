import * as React from "react";
import { useRouter } from "src/routes/hooks";
import { useCompleteRegistration } from "src/hooks/mutations/user/useCompleteRegistration";

import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import Button from "@mui/material/Button";
import Stepper from "@mui/material/Stepper";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useMediaQuery } from "@mui/material";
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

const STEPS = [
  "Sua Renda",
  "Suas Dívidas",
  "Seus Limites",
  "Suas Metas",
  "Suas Contas Fixas",
  "Seus Cartões",
];

export function CompleteRegistrationView() {
  const router = useRouter();
  const table = useTable();
  const [activeStep, setActiveStep] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { mutate: completeRegistration, isPending } = useCompleteRegistration(() => {
    router.push("/");
  });

  const { data: incomes } = useListIncomes(table);
  const { data: envelopes } = useListEnvelopes();
  const { data: goals } = useListGoals(table);
  const { data: fixedExpenses } = useListFixedExpenses(table);
  const { data: debts } = useListDebts(table);
  const { data: creditCards } = useListCreditCards(table);

  const handleNext = () => {
    if (activeStep === STEPS.length - 1) {
      completeRegistration();
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
          return <DebtsDisplay debts={debts} envelopes={envelopes || []} table={table} />;
        case 2:
          return <EnvelopesTable envelopes={envelopes || []} />;
        case 3:
          return <GoalsDisplay goals={goals} envelope={(envelopes || []).filter(e => e.name === 'goals')[0]} table={table} />;
        case 4:
          return <FixedExpensesDisplay fixedExpenses={fixedExpenses} envelopes={envelopes || []} table={table} />;
        case 5:
          return <CreditCardsDisplay creditCards={creditCards} table={table} />;
        default:
          return null;
      }
    }

    switch (activeStep) {
      case 0:
        return <IncomeTable incomes={incomes} />;
      case 1:
        return <DebtTable debts={debts} envelopes={envelopes || []} />;
      case 2:
        return <EnvelopesTable envelopes={envelopes || []} />;
      case 3:
        return <GoalsTable goals={goals} envelope={(envelopes || []).filter(e => e.name === 'goals')[0]} />;
      case 4:
        return <FixedExpenseTable fixedExpenses={fixedExpenses} envelopes={envelopes || []} />;
      case 5:
        return <CreditCardsTable creditCards={creditCards} />;
      default:
        return null;
    }
  };

  return (
    <Container sx={{ py: isMobile ? 2 : 5, px: isMobile ? 1 : 3 }}>
      <Box display="flex" flexDirection="column" alignItems="center" sx={{ width: "100%", minWidth: 0 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Completar cadastro
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Conte-nos um pouco mais para personalizarmos sua experiência. Tudo aqui pode ser editado depois!
        </Typography>

        {isMobile ? (
          <Box sx={{ width: "100%", mb: 2 }}>
            <ChipTabs
              tabs={STEPS.map((label, index) => ({ label, index }))}
              activeIndex={activeStep}
              onChange={setActiveStep}
            />
          </Box>
        ) : (
          <Stepper activeStep={activeStep} sx={{ width: "100%", mb: 5 }}>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        <Box sx={{ width: "100%", minHeight: 400 }}>
          {renderContent()}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              color="inherit"
            >
              Voltar
            </Button>
            <Button variant="contained" onClick={handleNext}>
              {activeStep === STEPS.length - 1 ? "Finalizar" : "Continuar"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
