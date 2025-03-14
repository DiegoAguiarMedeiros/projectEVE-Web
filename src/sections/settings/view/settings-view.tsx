import * as React from 'react';
import { useState } from 'react';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import { useQuery } from '@tanstack/react-query';

import { DashboardContent } from 'src/layouts/dashboard';
import { _incomes } from 'src/_mock';
import { IncomesTable } from '../incomes';
import { CreditCardsTable } from '../creditCards';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}


function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
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
            <Tab label="Salário" {...a11yProps(0)} />
            <Tab label="Cartões" {...a11yProps(1)} />
            <Tab label="Investimento" {...a11yProps(2)} />
            <Tab label="Dívidas" {...a11yProps(3)} />
            <Tab label="Tema" {...a11yProps(4)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <IncomesTable />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <CreditCardsTable />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          Configuração dos investimentos
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          Configuração do dívidas
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
          Configuração do tema
        </CustomTabPanel>
      </Box>
    </DashboardContent>
  );
}


