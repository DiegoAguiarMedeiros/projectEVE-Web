import { useEffect } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGS, SupportedLang, getLang, ROUTE_SEGMENTS } from 'src/routes/paths';

export function LangRouteWrapper() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();

  // First segment of the URL is the lang prefix (e.g. "/pt-BR/entrar" → "pt-BR")
  const lang = pathname.split('/')[1] ?? '';
  const isValidLang = SUPPORTED_LANGS.includes(lang as SupportedLang);

  // Sync i18n language with the URL lang segment.
  // i18n is a stable singleton — safe to exclude from deps.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isValidLang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  if (!isValidLang) {
    const fallback = getLang(i18n.language);
    return <Navigate to={`/${fallback}/${ROUTE_SEGMENTS[fallback].notFound}`} replace />;
  }

  return <Outlet />;
}
