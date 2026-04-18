import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async (params) => ({
  locale: params.locale || 'en',
  messages: (await import(`./${params.locale || 'en'}.json`)).default,
}));
