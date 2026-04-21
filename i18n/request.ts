import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'es'] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale: (typeof locales)[number] =
    requestedLocale === 'en' || requestedLocale === 'es' ? requestedLocale : 'en';

  return {
    locale,
    messages: (await import(`./${locale}.json`)).default,
  };
});