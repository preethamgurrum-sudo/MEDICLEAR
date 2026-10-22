import { useLanguage } from '../contexts/LanguageContext';
import { TRANSLATIONS } from '../lib/translations';

export function useTranslation() {
  const { language } = useLanguage();
  
  // Default to English if language is not set or not found in TRANSLATIONS
  const t = (key) => {
    const langCode = language || 'en';
    const translationSet = TRANSLATIONS[langCode] || TRANSLATIONS['en'];
    return translationSet[key] || TRANSLATIONS['en'][key] || key;
  };

  return { t, language };
}
