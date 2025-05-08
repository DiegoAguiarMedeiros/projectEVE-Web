import * as React from 'react';
import { useState } from 'react';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import { Typography } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { _incomes } from 'src/_mock';
import { IncomeTable } from '../income';
import { CreditCardsTable } from '../creditCards';
import { FixedExpenseTable } from '../fixedExpense';
import { DebtTable } from '../debt';
import { Envelope } from '../envelope';

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
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export function SettingsView() {
  const [value, setValue] = useState(0);




  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <DashboardContent>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Envelopes" {...a11yProps(0)} />
            <Tab label="Salário" {...a11yProps(1)} />
            <Tab label="Gastos Fixo" {...a11yProps(2)} />
            <Tab label="Cartões" {...a11yProps(3)} />
            <Tab label="Dívidas" {...a11yProps(4)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Typography variant="caption" sx={{ m: 2, mb: 4 }}>
            Assim?
          </Typography>
          <Envelope />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Typography variant="caption" sx={{ m: 2, mb: 4 }}>
            instruções!
          </Typography>
          <IncomeTable />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <Typography variant="caption" sx={{ m: 2, mb: 4 }}>
            instruções!
          </Typography>
          <FixedExpenseTable />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <Typography variant="caption" sx={{ m: 2, mb: 4 }}>
            instruções!
          </Typography>
          <CreditCardsTable />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
          <Typography variant="caption" sx={{ m: 2, mb: 4 }}>
            instruções!
          </Typography>
          <DebtTable />
        </CustomTabPanel>
      </Box>
    </DashboardContent>
  );
}


