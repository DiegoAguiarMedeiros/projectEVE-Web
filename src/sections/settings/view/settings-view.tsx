import * as React from "react";
import { useState } from "react";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { DashboardContent } from "src/layouts/dashboard";
import { _incomes } from "src/_mock";
import { IncomeTable } from "src/sections/settings/income";
import { CreditCardsTable } from "src/sections/settings/creditCards";
import { FixedExpenseTable } from "src/sections/settings/fixedExpense";
import { DebtTable } from "src/sections/settings/debt";
import { EnvelopesTable } from "src/sections/settings/envelope";
import { GoalsTable } from "src/sections/settings/goals";
import { Envelopes } from "src/types/Envelopes";
import { Incomes } from "src/types/Incomes";
import { Pagination } from "src/types/Pagination";
import { Goals } from "src/types/Goals";
import { FixedExpenses } from "src/types/FixedExpenses";
import { Debts } from "src/types/Debts";
import { CreditCards } from "src/types/CreditCards";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}


function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <Box
      maxWidth="xl"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </Box>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

type SettingsViewProps = {
  incomes: Pagination<Incomes> | undefined
  goals: Pagination<Goals> | undefined
  fixedExpenses: Pagination<FixedExpenses> | undefined
  debts: Pagination<Debts> | undefined
  creditCards: Pagination<CreditCards> | undefined
  envelopes: Envelopes[]
}
export function SettingsView({ incomes, envelopes, goals, fixedExpenses, debts, creditCards }: SettingsViewProps) {
  const [value, setValue] = useState(0);




  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <DashboardContent>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Minha Renda" {...a11yProps(0)} />
            <Tab label="Meus Limites" {...a11yProps(1)} />
            <Tab label="Minhas Metas" {...a11yProps(2)} />
            <Tab label="Minhas Contas Fixas" {...a11yProps(3)} />
            <Tab label="Minhas Dívidas" {...a11yProps(4)} />
            <Tab label="Meus Cartões" {...a11yProps(5)} />
          </Tabs>
        </Box>

        <CustomTabPanel value={value} index={0}>
          <Typography variant="caption" sx={{ m: 2, mb: 4 }}>
            instruções!
          </Typography>
          <IncomeTable incomes={incomes} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <EnvelopesTable envelopes={envelopes} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <GoalsTable goals={goals} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <Typography variant="caption" sx={{ m: 2, mb: 4 }}>
            instruções!
          </Typography>
          <FixedExpenseTable fixedExpenses={fixedExpenses} envelopes={envelopes} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
          <Typography variant="caption" sx={{ m: 2, mb: 4 }}>
            instruções!
          </Typography>
          <DebtTable debts={debts} envelopes={envelopes} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={5}>
          <Typography variant="caption" sx={{ m: 2, mb: 4 }}>
            instruções!
          </Typography>
          <CreditCardsTable creditCards={creditCards} />
        </CustomTabPanel>

      </Box>
    </DashboardContent>
  );
}


