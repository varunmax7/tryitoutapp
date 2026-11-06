import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';

/**
 * i18n — implementation.md §15 Phase 1 task 3 and §8.
 * English only in V1; Hindi, Telugu and Tamil arrive in V2, which is why every string
 * lives here rather than in the components.
 */
export const i18n = i18next.createInstance();

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en } },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnNull: false,
});
