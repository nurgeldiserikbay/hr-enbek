import { useTranslations } from 'next-intl';

import { Card } from '@/shared/ui/card';
import { StepList } from '@/shared/ui/step-list';

const STEP_KEYS = ['chooseTopic', 'answer', 'result'] as const;

type SelfCheckIntroProps = Readonly<{
  step: 1 | 2 | 3;
}>;

export function SelfCheckIntro({ step }: SelfCheckIntroProps) {
  const t = useTranslations('SelfCheck');

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_22.5rem] lg:gap-6">
      <Card className="p-4 lg:p-10">
        <h1 className="text-h2-xs text-text-heading lg:text-h1-sm">{t('title')}</h1>
        <p className="mt-3 text-body-l text-text-body lg:mt-4">{t('description')}</p>
      </Card>
      <Card tone="brand" className="p-4 lg:px-6 lg:pt-[38px] lg:pb-7">
        <h2 className="text-body-s">{t('stepsTitle')}</h2>
        <StepList
          tone="inverse"
          className="mt-3 flex flex-col gap-2.5"
          steps={STEP_KEYS.map((key, index) => {
            const position = index + 1;
            let state: 'done' | 'current' | 'upcoming' = 'upcoming';
            if (position < step) state = 'done';
            else if (position === step) state = 'current';
            return { key, label: t(`steps.${key}`), state };
          })}
        />
      </Card>
    </section>
  );
}
