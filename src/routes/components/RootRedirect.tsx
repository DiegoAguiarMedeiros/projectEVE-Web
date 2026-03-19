import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLang } from 'src/routes/paths';

export function RootRedirect() {
  const { i18n } = useTranslation();
  const lang = getLang(i18n.language);
  return <Navigate to={`/${lang}`} replace />;
}
