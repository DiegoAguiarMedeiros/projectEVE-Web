import EmailIcon from "@mui/icons-material/Email";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import SavingsIcon from "@mui/icons-material/Savings";

import { SvgColor } from "src/components/svg-color";
// ----------------------------------------------------------------------

import i18n from 'src/i18n';

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: "nav.budget",
    path: "/",
    icon: <DashboardIcon />,
  },
  {
    title: "nav.envelopes",
    path: "/envelopes",
    icon: <EmailIcon />,
  },
  {
    title: "nav.incomes",
    path: "/renda",
    icon: <AttachMoneyIcon />,
  },
  {
    title: "nav.settings",
    path: "/configuracoes",
    icon: <SettingsApplicationsIcon />,
  },
];
