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

import { IncomeTable } from "src/sections/settings/income";
import { EnvelopesTable } from "src/sections/settings/envelope";
import { GoalsTable } from "src/sections/settings/goals";
import { FixedExpenseTable } from "src/sections/settings/fixedExpense";
import { DebtTable } from "src/sections/settings/debt";
import { CreditCardsTable } from "src/sections/settings/creditCards";

import { useListIncomes } from "src/hooks/queries/incomes/useListIncomes";
import { useListEnvelopes } from "src/hooks/queries/envelopes/useListEnvelopes";
import { useListGoals } from "src/hooks/queries/goals/useListGoals";
import { useListFixedExpenses } from "src/hooks/queries/fixed-expenses/useListFixedExpenses";
import { useListDebts } from "src/hooks/queries/debts/useListDebts";
import { useListCreditCards } from "src/hooks/queries/credit-cards/useListCreditCards";
import { useTable } from "src/sections/shared/useTable";

const STEPS = [
  "Sua Renda",
  "Seus Limites",
  "Suas Metas",
  "Suas Contas Fixas",
  "Suas Dívidas",
  "Seus Cartões",
];

export function CompleteRegistrationView() {
  const router = useRouter();
  const table = useTable();
  const [activeStep, setActiveStep] = React.useState(0);

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
    console.log("handleNext called", { activeStep, totalSteps: STEPS.length });
    if (activeStep === STEPS.length - 1) {
      console.log("Calling completeRegistration mutation");
      completeRegistration();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const renderContent = () => {
    switch (activeStep) {
      case 0:
        return <IncomeTable incomes={incomes} />;
      case 1:
        return <EnvelopesTable envelopes={envelopes || []} />;
      case 2:
        return <GoalsTable goals={goals} envelope={(envelopes || []).filter(e => e.name === 'goals')[0]} />;
      case 3:
        return <FixedExpenseTable fixedExpenses={fixedExpenses} envelopes={envelopes || []} />;
      case 4:
        return <DebtTable debts={debts} envelopes={envelopes || []} />;
      case 5:
        return <CreditCardsTable creditCards={creditCards} />;
      default:
        return null;
    }
  };

  return (
    <Container sx={{ py: 5 }}>
      <Box display="flex" flexDirection="column" alignItems="center" sx={{ width: "100%" }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Completar cadastro
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Conte-nos um pouco mais para personalizarmos sua experiência. Tudo aqui pode ser editado depois!
        </Typography>

        <Stepper activeStep={activeStep} sx={{ width: "100%", mb: 5 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

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
