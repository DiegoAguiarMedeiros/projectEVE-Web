import EmailIcon from '@mui/icons-material/Email';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';

import { SvgColor } from 'src/components/svg-color';
// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Painel',
    path: '/',
    icon: <DashboardIcon />,
  },
  {
    title: 'Envelopes',
    path: '/envelopes',
    icon: <EmailIcon />,
  },
  {
    title: 'Configurações',
    path: '/configuracoes',
    icon: <SettingsApplicationsIcon />,
  },
];
