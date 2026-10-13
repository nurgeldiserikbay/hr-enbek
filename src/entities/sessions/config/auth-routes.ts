export const AUTH_API = {
  agreement: '/api/auth/agreement',
  staffLogin: '/api/auth/staff/login',
  staffChallenge: '/api/auth/staff/challenge',
  staffVerify: '/api/auth/staff/verify',
  session: '/api/auth/session',
  passwordChange: '/api/auth/password',
  logout: '/api/auth/logout',
  passportStart: '/api/auth/passport/start',
  passportCallback: '/api/auth/passport/callback',
} as const;

export const SIGNED_IN_HOME = '/cabinet';

export const SIGN_IN_CHOICE_PARAM = 'select';
