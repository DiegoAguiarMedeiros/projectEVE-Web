import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmailIcon from '@mui/icons-material/Email';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { info } from 'console';
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
    title: 'Envelope',
    path: '/envelope',
    icon: <EmailIcon />,
    info: <KeyboardArrowDownIcon />,
    subItems: [
      { title: 'Subopção 1', path: '/user/subopcao1' },
      { title: 'Subopção 2', path: '/user/subopcao2' },
    ],
  },
  {
    title: 'Configurações',
    path: '/products',
    icon: <SettingsApplicationsIcon />,
  }
];
