import * as React from "react";
import { useState } from "react";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import { Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { ChipTabs } from "src/components/chip-tabs";


import { DashboardContent } from "src/layouts/dashboard";
import { _incomes } from "src/_mock";
import { IncomesDisplay } from "src/sections/settings/income";
import { CreditCardsDisplay } from "src/sections/settings/creditCards";
import { FixedExpensesDisplay } from "src/sections/settings/fixedExpense";
import { DebtsDisplay } from "src/sections/settings/debt";
import { EnvelopesTable } from "src/sections/settings/envelope";
import { GoalsDisplay } from "src/sections/settings/goals";
import { Envelopes } from "src/types/Envelopes";
import { Incomes } from "src/types/Incomes";
import { Pagination } from "src/types/Pagination";
import { Goals } from "src/types/Goals";
import { FixedExpenses } from "src/types/FixedExpenses";
import { Debts } from "src/types/Debts";
import { CreditCards } from "src/types/CreditCards";
import { ITable } from "src/sections/shared/useTable";
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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      sx={{ display: value === index ? 'flex' : 'none', flexDirection: 'column', flex: 1, minHeight: 0 }}
      {...other}
    >
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>{children}</Box>
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
  table: ITable
}
export function SettingsView({ incomes, envelopes, goals, fixedExpenses, debts, creditCards, table }: SettingsViewProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabs = [
    { label: t('settings.tabs.income'), index: 0 },
    { label: t('settings.tabs.envelopes'), index: 1 },
    { label: t('settings.tabs.goals'), index: 2 },
    { label: t('settings.tabs.fixed_expenses'), index: 3 },
    { label: t('settings.tabs.debts'), index: 4 },
    { label: t('settings.tabs.credit_cards'), index: 5 },
  ];

  return (
    <DashboardContent>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        {isMobile ? (
          <ChipTabs
            tabs={tabs}
            activeIndex={value}
            onChange={setValue}
          />
        ) : (
          <Box sx={{ borderBottom: 1, borderColor: "divider", backgroundColor: theme.palette.background.paper }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label={t('settings.tabs.income')} {...a11yProps(0)} sx={value === 0 ? { backgroundColor: "var(--layout-nav-item-active-bg)" } : null} />
              <Tab label={t('settings.tabs.envelopes')} {...a11yProps(1)} sx={value === 1 ? { backgroundColor: "var(--layout-nav-item-active-bg)" } : null} />
              <Tab label={t('settings.tabs.goals')} {...a11yProps(2)} sx={value === 2 ? { backgroundColor: "var(--layout-nav-item-active-bg)" } : null} />
              <Tab label={t('settings.tabs.fixed_expenses')} {...a11yProps(3)} sx={value === 3 ? { backgroundColor: "var(--layout-nav-item-active-bg)" } : null} />
              <Tab label={t('settings.tabs.debts')} {...a11yProps(4)} sx={value === 4 ? { backgroundColor: "var(--layout-nav-item-active-bg)" } : null} />
              <Tab label={t('settings.tabs.credit_cards')} {...a11yProps(5)} sx={value === 5 ? { backgroundColor: "var(--layout-nav-item-active-bg)" } : null} />
            </Tabs>
          </Box>
        )}

        <CustomTabPanel value={value} index={0}>
          <IncomesDisplay incomes={incomes} table={table} />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          <EnvelopesTable envelopes={envelopes} />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={2}>
          <GoalsDisplay goals={goals} envelope={envelopes.filter(e => e.name === 'goals')[0]} table={table} />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={3}>
          <FixedExpensesDisplay fixedExpenses={fixedExpenses} envelopes={envelopes} table={table} />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={4}>
          <DebtsDisplay debts={debts} envelopes={envelopes} table={table} />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={5}>
          <CreditCardsDisplay creditCards={creditCards} table={table} />
        </CustomTabPanel>
      </Box>
    </DashboardContent>
  );
}


