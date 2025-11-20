import EmailIcon from "@mui/icons-material/Email";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import SavingsIcon from "@mui/icons-material/Savings";

import { SvgColor } from "src/components/svg-color";
// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: "Orçamento",
    path: "/",
    icon: <DashboardIcon />,
  },
  {
    title: "Envelopes",
    path: "/envelopes",
    icon: <EmailIcon />,
  },
  {
    title: "Minhas Rendas",
    path: "/renda",
    icon: <AttachMoneyIcon />,
  },
  {
    title: "Configurações",
    path: "/configuracoes",
    icon: <SettingsApplicationsIcon />,
  },
];
