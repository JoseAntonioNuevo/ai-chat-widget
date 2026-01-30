/**
 * Language code
 * Can be any string (e.g., 'en', 'es', 'fr', 'de', 'pt-BR', 'zh-CN', etc.)
 * The lang value is passed to your backend API in the request body
 */
export type Lang = string;

/**
 * Built-in language codes with default translations
 */
export type BuiltInLang = 'en' | 'es';

/**
 * Translation labels for the chat widget
 */
export interface Labels {
  /** Chat window title */
  title: string;
  /** Input placeholder text */
  placeholder: string;
  /** Send button label (accessibility) */
  send: string;
  /** Close button label (accessibility) */
  close: string;
  /** Open chat button label (accessibility) */
  open: string;
  /** Loading/thinking indicator text */
  thinking: string;
  /** Generic error message */
  error: string;
  /** Retry button text */
  retry: string;
  /** Suggestions section title */
  suggestionsTitle: string;
  /** Restart chat button label (accessibility) */
  restart: string;
}

/**
 * Built-in translations object
 */
export type Translations = Record<BuiltInLang, Labels>;
