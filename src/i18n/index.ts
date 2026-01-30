import type { Lang, Labels, Translations, BuiltInLang } from './types';
import { en } from './en';
import { es } from './es';

export * from './types';

/**
 * Built-in translations (English and Spanish)
 * For other languages, use the `labels` prop to provide custom translations
 */
export const translations: Translations = {
  en,
  es,
};

/**
 * Check if a language has built-in translations
 */
function isBuiltInLang(lang: string): lang is BuiltInLang {
  return lang in translations;
}

/**
 * Get labels for a specific language
 *
 * @param lang - Language code (any string, e.g., 'en', 'es', 'fr', 'de', 'pt-BR')
 * @returns Labels for the specified language, or English defaults if not found
 *
 * @example
 * ```ts
 * getLabels('en');  // Returns English labels
 * getLabels('es');  // Returns Spanish labels
 * getLabels('fr');  // Returns English labels (no built-in French)
 * ```
 */
export function getLabels(lang: Lang): Labels {
  if (isBuiltInLang(lang)) {
    return translations[lang];
  }
  // Fallback to English for unknown languages
  return translations.en;
}

/**
 * Merge custom labels with defaults
 *
 * @param lang - Base language code (any string)
 * @param customLabels - Partial custom labels to override
 * @returns Complete labels with overrides applied
 *
 * @example
 * ```ts
 * // French with custom labels
 * mergeLabels('fr', {
 *   title: 'Assistant',
 *   placeholder: 'Écrivez votre message...',
 *   send: 'Envoyer',
 *   close: 'Fermer',
 *   open: 'Ouvrir le chat',
 *   thinking: 'Réflexion',
 *   error: 'Une erreur est survenue',
 *   retry: 'Réessayer',
 * });
 * ```
 */
export function mergeLabels(lang: Lang, customLabels?: Partial<Labels>): Labels {
  const baseLabels = getLabels(lang);
  if (!customLabels) return baseLabels;
  return { ...baseLabels, ...customLabels };
}
