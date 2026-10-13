import { AUTH_API } from '@/entities/sessions';
import { readApiResponse } from '@/shared/api';

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
}

export async function changePassword(accessToken: string, change: PasswordChange): Promise<void> {
  const response = await fetch(AUTH_API.passwordChange, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(change),
  });
  await readApiResponse(response);
}
