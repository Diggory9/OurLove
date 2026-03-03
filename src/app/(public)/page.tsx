import { getSiteConfig, getFeaturedPhotos, getLatestTimelineEvents } from "@/lib/data";
import HeroSection from "@/components/home/HeroSection";
import LoveDayCounter from "@/components/home/LoveDayCounter";
import FeaturedPhotos from "@/components/home/FeaturedPhotos";
import TimelinePreview from "@/components/home/TimelinePreview";
import AnniversaryCountdown from "@/components/home/AnniversaryCountdown";

export default async function HomePage() {
  const [site, featuredPhotos, latestEvents] = await Promise.all([
    getSiteConfig(),
    getFeaturedPhotos(),
    getLatestTimelineEvents(),
  ]);

  return (
    <>
      <HeroSection site={site} />
      <LoveDayCounter
        startDate={site.startDate}
        person1={site.person1Name}
        person2={site.person2Name}
      />
      <FeaturedPhotos photos={featuredPhotos} />
      <TimelinePreview events={latestEvents} />
      <AnniversaryCountdown startDate={site.startDate} />
    </>
  );
}
