import { getLabourInspections } from '@/entities/labour-inspections';
import { getLatestNews } from '@/entities/news';
import { getPortalStats } from '@/entities/portal-stats';
import { MAIN_CONTENT_ID } from '@/shared/config';
import { LabourInspection } from '@/widgets/labour-inspection';
import { PortalStats } from '@/widgets/portal-stats';

import { AudienceSection } from './audience-section.tsx';
import { HeroSection } from './hero-section.tsx';
import { NewsSection } from './news-section.tsx';

export async function HomePage() {
  const [stats, news, inspections] = await Promise.all([getPortalStats(), getLatestNews(), getLabourInspections()]);

  return (
    <main id={MAIN_CONTENT_ID} className="pt-6 pb-10 lg:pt-14 lg:pb-9">
      <div className="page-container flex flex-col gap-8 lg:gap-14">
        <HeroSection />
        <PortalStats stats={stats} />
      </div>
      <div className="page-container mt-8 lg:mt-18">
        <AudienceSection />
      </div>
      <div className="mt-8 lg:mt-12">
        <NewsSection news={news} />
      </div>
      <div className="page-container mt-8 lg:mt-[45px]">
        <LabourInspection inspections={inspections} />
      </div>
    </main>
  );
}
