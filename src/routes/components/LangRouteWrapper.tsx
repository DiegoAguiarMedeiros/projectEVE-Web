import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SupportedLang } from 'src/routes/paths';

type Props = { lang: SupportedLang };

export function LangRouteWrapper({ lang }: Props) {
  const { i18n } = useTranslation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  return <Outlet />;
}
