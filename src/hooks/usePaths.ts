import { useTranslation } from 'react-i18next';
import { getPath, getLang, RouteKey, SupportedLang } from 'src/routes/paths';

export type Paths = Record<RouteKey, string>;

export function usePaths(): Paths {
  const { i18n } = useTranslation();
  const lang = getLang(i18n.language) as SupportedLang;

  return {
    home: getPath(lang, 'home'),
    envelopes: getPath(lang, 'envelopes'),
    reallocation: getPath(lang, 'reallocation'),
    incomes: getPath(lang, 'incomes'),
    goals: getPath(lang, 'goals'),
    debts: getPath(lang, 'debts'),
    settings: getPath(lang, 'settings'),
    profile: getPath(lang, 'profile'),
    completeRegistration: getPath(lang, 'completeRegistration'),
    signIn: getPath(lang, 'signIn'),
    registration: getPath(lang, 'registration'),
    verifyEmail: getPath(lang, 'verifyEmail'),
    notFound: getPath(lang, 'notFound'),
  };
}
