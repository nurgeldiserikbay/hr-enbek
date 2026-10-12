import type { Locale } from './routing.ts';

type Messages = Record<string, unknown>;

const isMessages = (value: unknown): value is Messages =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const mergeWithFallback = (fallback: Messages, primary: Messages): Messages => {
  const merged: Messages = { ...fallback };
  for (const [key, value] of Object.entries(primary)) {
    const fallbackValue = fallback[key];
    merged[key] = isMessages(value) && isMessages(fallbackValue) ? mergeWithFallback(fallbackValue, value) : value;
  }
  return merged;
};

const loadLocaleMessages = async (locale: Locale): Promise<Messages> => {
  const imported = (await import(`../../../../messages/${locale}.json`)) as { default: Messages };
  return imported.default;
};

export const loadMessages = async (locale: Locale): Promise<Messages> => {
  if (locale === 'en') {
    const [kk, en] = await Promise.all([loadLocaleMessages('kk'), loadLocaleMessages('en')]);
    return mergeWithFallback(kk, en);
  }
  return loadLocaleMessages(locale);
};
