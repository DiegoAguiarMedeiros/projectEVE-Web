import EmailIcon from "@mui/icons-material/Email";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import SavingsIcon from "@mui/icons-material/Savings";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import { Paths } from "src/hooks/usePaths";

// ----------------------------------------------------------------------

export function getNavData(paths: Paths) {
  return [
    {
      title: "nav.budget",
      path: paths.home,
      icon: <DashboardIcon />,
    },
    {
      title: "nav.envelopes",
      path: paths.envelopes,
      icon: <EmailIcon />,
    },
    {
      title: "nav.incomes",
      path: paths.incomes,
      icon: <AttachMoneyIcon />,
    },
    {
      title: "nav.goals",
      path: paths.goals,
      icon: <SavingsIcon />,
    },
    {
      title: "nav.debts",
      path: paths.debts,
      icon: <RemoveCircleIcon />,
    },
    {
      title: "nav.settings",
      path: paths.settings,
      icon: <SettingsApplicationsIcon />,
    },
  ];
}
