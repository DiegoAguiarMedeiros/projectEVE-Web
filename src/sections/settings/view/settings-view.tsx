import * as React from "react";
import { useState } from "react";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";


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
import { background } from "src/theme/core";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}


function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}

      {...other}
    >
      {value === index && <Box sx={{ width: '100%' }}>{children}</Box>}
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
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const theme = useTheme();



  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <DashboardContent  sx={{width: '99%', my: 1, mx: 'auto', p: 1 }}>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", borderTopRightRadius: '16px', borderTopLeftRadius: '16px', backgroundColor: theme.palette.background.paper, boxShadow: '0 0 2px 0 rgba(145 158 171 / 0.2), 0 12px 24px -4px rgba(145 158 171 / 0.12)' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label={t('settings.tabs.income')} {...a11yProps(0)} sx={value === 0 ? { backgroundColor: "var(--layout-nav-item-active-bg)" } : null} />
            <Tab label={t('settings.tabs.envelopes')} {...a11yProps(1)} sx={value === 1 ? { backgroundColor: "var(--layout-nav-item-active-bg)" } : null} />
            <Tab label={t('settings.tabs.goals')} {...a11yProps(2)} sx={value === 2 ? { backgroundColor: "var(--layout-nav-item-active-bg)" } : null} />
            <Tab label={t('settings.tabs.fixed_expenses')} {...a11yProps(3)} sx={value === 3 ? { backgroundColor: "var(--layout-nav-item-active-bg)" } : null} />
            <Tab label={t('settings.tabs.debts')} {...a11yProps(4)} sx={value === 4 ? { backgroundColor: "var(--layout-nav-item-active-bg)" } : null} />
            <Tab label={t('settings.tabs.credit_cards')} {...a11yProps(5)} sx={value === 5 ? { backgroundColor: "var(--layout-nav-item-active-bg)" } : null} />
          </Tabs>
        </Box>

        <CustomTabPanel value={value} index={0}>
          <IncomeTable incomes={incomes} />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          <EnvelopesTable envelopes={envelopes} />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={2}>
          <GoalsTable goals={goals} envelope={envelopes.filter(e => e.name === 'goals')[0]} />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={3}>
          <FixedExpenseTable fixedExpenses={fixedExpenses} envelopes={envelopes} />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={4}>
          <DebtTable debts={debts} envelopes={envelopes} />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={5}>
          <CreditCardsTable creditCards={creditCards} />
        </CustomTabPanel>
      </Box>
    </DashboardContent>
  );
}


