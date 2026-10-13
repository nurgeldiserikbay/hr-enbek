import createMiddleware from 'next-intl/middleware';

import { routing } from '@/shared/config/i18n/routing.ts';

export default createMiddleware(routing);

export const config = {
  // eslint-disable-next-line unicorn/prefer-string-raw -- Next.js only accepts a static string literal in segment config
  matcher: ['/((?!api|admin|cabinet|_next|_vercel|.*\\..*).*)'],
};
