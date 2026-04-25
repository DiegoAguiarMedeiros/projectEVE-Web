export type RouteKey =
  | 'home'
  | 'envelopes'
  | 'reallocation'
  | 'incomes'
  | 'goals'
  | 'debts'
  | 'settings'
  | 'profile'
  | 'completeRegistration'
  | 'signIn'
  | 'registration'
  | 'verifyEmail'
  | 'forgotPassword'
  | 'resetPassword'
  | 'notFound';

export const SUPPORTED_LANGS = ['pt-BR', 'en', 'es'] as const;
export type SupportedLang = typeof SUPPORTED_LANGS[number];
export const DEFAULT_LANG: SupportedLang = 'pt-BR';
export const NON_DEFAULT_LANGS = SUPPORTED_LANGS.filter(l => l !== DEFAULT_LANG) as SupportedLang[];

// Path segments (without the /:lang prefix)
export const ROUTE_SEGMENTS: Record<SupportedLang, Record<RouteKey, string>> = {
  'pt-BR': {
    home: '',
    envelopes: 'envelopes',
    reallocation: 'transferencia',
    incomes: 'renda',
    goals: 'metas',
    debts: 'dividas',
    settings: 'configuracoes',
    profile: 'perfil',
    completeRegistration: 'completar-cadastro',
    signIn: 'entrar',
    registration: 'cadastro',
    verifyEmail: 'verificar-email',
    forgotPassword: 'esqueci-minha-senha',
    resetPassword: 'redefinir-senha',
    notFound: 'nao-encontrado',
  },
  en: {
    home: '',
    envelopes: 'envelopes',
    reallocation: 'reallocation',
    incomes: 'income',
    goals: 'goals',
    debts: 'debts',
    settings: 'settings',
    profile: 'profile',
    completeRegistration: 'complete-registration',
    signIn: 'sign-in',
    registration: 'registration',
    verifyEmail: 'verify-email',
    forgotPassword: 'forgot-password',
    resetPassword: 'reset-password',
    notFound: 'not-found',
  },
  es: {
    home: '',
    envelopes: 'sobres',
    reallocation: 'transferencia',
    incomes: 'ingresos',
    goals: 'metas',
    debts: 'deudas',
    settings: 'configuracion',
    profile: 'perfil',
    completeRegistration: 'completar-registro',
    signIn: 'iniciar-sesion',
    registration: 'registro',
    verifyEmail: 'verificar-email',
    forgotPassword: 'olvide-mi-contrasena',
    resetPassword: 'restablecer-contrasena',
    notFound: 'no-encontrado',
  },
};

export function getLang(lang: string): SupportedLang {
  return SUPPORTED_LANGS.includes(lang as SupportedLang) ? (lang as SupportedLang) : 'pt-BR';
}

export function getPath(lang: SupportedLang, key: RouteKey): string {
  const segment = ROUTE_SEGMENTS[lang][key];
  if (lang === DEFAULT_LANG) {
    return segment ? `/${segment}` : '/';
  }
  return segment ? `/${lang}/${segment}` : `/${lang}`;
}

/** Given a lang and a URL segment, return the matching RouteKey (or null). */
export function getRouteKeyFromSegment(lang: SupportedLang, segment: string): RouteKey | null {
  const segments = ROUTE_SEGMENTS[lang];
  const entry = Object.entries(segments).find(([, v]) => v === segment);
  return entry ? (entry[0] as RouteKey) : null;
}
