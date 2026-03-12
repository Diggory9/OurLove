import { getSiteConfig, getFeaturedPhotos, getLatestTimelineEvents, getUpcomingSpecialDays } from "@/lib/data";
import HeroSection from "@/components/home/HeroSection";
import LoveDayCounter from "@/components/home/LoveDayCounter";
import FeaturedPhotos from "@/components/home/FeaturedPhotos";
import TimelinePreview from "@/components/home/TimelinePreview";
import AnniversaryCountdown from "@/components/home/AnniversaryCountdown";
import UpcomingDays from "@/components/home/UpcomingDays";

export default async function HomePage() {
  const [site, featuredPhotos, latestEvents, upcomingDays] = await Promise.all([
    getSiteConfig(),
    getFeaturedPhotos(),
    getLatestTimelineEvents(),
    getUpcomingSpecialDays(),
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
      <UpcomingDays days={upcomingDays} />
      <AnniversaryCountdown startDate={site.startDate} />
    </>
  );
}
