import { getTranslations } from 'next-intl/server';

import { StaffSignInFlow } from '@/features/staff-sign-in';
import { AuthShell } from '@/widgets/auth-shell';

export async function StaffLoginPage() {
  const t = await getTranslations('StaffLoginPage');

  return (
    <AuthShell>
      <h1 className="mt-12 text-h3 leading-[32px] text-text-heading">{t('heading')}</h1>
      <div className="mt-2">
        <StaffSignInFlow />
      </div>
    </AuthShell>
  );
}
