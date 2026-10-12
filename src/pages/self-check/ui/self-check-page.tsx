import { getTranslations } from 'next-intl/server';

import { getLabourInspections } from '@/entities/labour-inspections';
import { getSelfCheckTopics } from '@/entities/self-checks';
import { SelfCheckIntro } from '@/features/self-check';
import { MAIN_CONTENT_ID, selfCheckTopicRoute } from '@/shared/config';
import { ContentIcon } from '@/shared/ui/content-icon';
import { FeatureCard } from '@/shared/ui/feature-card';
import { ArrowRight, Info } from '@/shared/ui/icon';
import { Notice } from '@/shared/ui/notice';
import { SectionHeader } from '@/shared/ui/section-header';
import { Tag } from '@/shared/ui/tag';
import { LabourInspection } from '@/widgets/labour-inspection';

export async function SelfCheckPage() {
  const t = await getTranslations('SelfCheck.topics');
  const [topics, inspections] = await Promise.all([getSelfCheckTopics(), getLabourInspections()]);

  return (
    <main id={MAIN_CONTENT_ID} className="page-container flex flex-col gap-8 pt-6 pb-10 lg:gap-12 lg:pt-14 lg:pb-17">
      <SelfCheckIntro step={1} />

      <section aria-labelledby="self-check-topics" className="flex flex-col gap-6 lg:mt-0.5">
        <SectionHeader id="self-check-topics" size="md" title={t('title')} description={t('description')} />
        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
          {topics.map((topic) => (
            <FeatureCard
              key={topic.id}
              className="hover:outline-2 hover:outline-brand-primary"
              icon={<ContentIcon name={topic.icon} />}
              title={topic.title}
              description={topic.description}
              href={selfCheckTopicRoute(topic.id)}
              badge={<Tag size="sm">{t('questions', { count: topic.questionCount })}</Tag>}
            >
              <span
                aria-hidden="true"
                className="inline-flex items-center gap-2 text-body-m-semibold text-brand-primary"
              >
                {t('start')}
                <ArrowRight className="size-4" />
              </span>
            </FeatureCard>
          ))}
        </div>
        <Notice tone="warning" icon={<Info aria-hidden="true" />}>
          {t('notice')}
        </Notice>
      </section>

      <LabourInspection inspections={inspections} />
    </main>
  );
}
