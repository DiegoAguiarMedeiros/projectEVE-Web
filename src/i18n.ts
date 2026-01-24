import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import ptBR from './locales/pt-BR/translation.json';
import es from './locales/es/translation.json';

const resources = {
    en: {
        translation: en,
    },
    'pt-BR': {
        translation: ptBR,
    },
    es: {
        translation: es,
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'pt-BR', // Default to Portuguese as per user context
        debug: false,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

export default i18n;
