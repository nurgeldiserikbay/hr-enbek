import { cookies } from 'next/headers';
import { locale as rootLocale } from 'next/root-params';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { loadMessages } from './messages.ts';
import { LOCALE_COOKIE_NAME, routing } from './routing.ts';

const readLocaleCookie = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get(LOCALE_COOKIE_NAME)?.value;
};

export default getRequestConfig(async () => {
  const requested = (await rootLocale()) ?? (await readLocaleCookie());
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    timeZone: 'Asia/Almaty',
    messages: await loadMessages(locale),
  };
});
