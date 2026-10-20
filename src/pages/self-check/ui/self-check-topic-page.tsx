import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';

import { getLabourInspections } from '@/entities/labour-inspections';
import { getSelfCheckTopic } from '@/entities/self-checks';
import { SelfCheckFlow } from '@/features/self-check';
import { MAIN_CONTENT_ID } from '@/shared/config';
import { LabourInspection } from '@/widgets/labour-inspection';
import { SupportCard } from '@/widgets/support-card';

type SelfCheckTopicPageProps = Readonly<{
  topicId: string;
}>;

export async function SelfCheckTopicPage({ topicId }: SelfCheckTopicPageProps) {
  const [topic, inspections] = await Promise.all([getSelfCheckTopic(topicId), getLabourInspections(await getLocale())]);
  if (topic === undefined) notFound();

  return (
    <main id={MAIN_CONTENT_ID} className="page-container flex flex-col gap-8 pt-6 pb-10 lg:gap-12 lg:pt-14 lg:pb-13.5">
      <SelfCheckFlow topic={topic} support={<SupportCard variant="compact" />} />
      <LabourInspection inspections={inspections} />
    </main>
  );
}
