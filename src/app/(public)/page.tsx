import { getSiteConfig, getFeaturedPhotos, getLatestTimelineEvents, getUpcomingSpecialDays, getOnThisDay, getRandomLoveReason } from "@/lib/data";
import HeroSection from "@/components/home/HeroSection";
import LoveDayCounter from "@/components/home/LoveDayCounter";
import FeaturedPhotos from "@/components/home/FeaturedPhotos";
import TimelinePreview from "@/components/home/TimelinePreview";
import AnniversaryCountdown from "@/components/home/AnniversaryCountdown";
import UpcomingDays from "@/components/home/UpcomingDays";
import DailyQuote from "@/components/home/DailyQuote";
import OnThisDay from "@/components/home/OnThisDay";
import DailyLoveReason from "@/components/home/DailyLoveReason";

export default async function HomePage() {
  const [site, featuredPhotos, latestEvents, upcomingDays, onThisDay, loveReason] = await Promise.all([
    getSiteConfig(),
    getFeaturedPhotos(),
    getLatestTimelineEvents(),
    getUpcomingSpecialDays(),
    getOnThisDay(),
    getRandomLoveReason(),
  ]);

  return (
    <>
      <HeroSection site={site} />
      <LoveDayCounter
        startDate={site.startDate}
        person1={site.person1Name}
        person2={site.person2Name}
      />
      <DailyLoveReason reason={loveReason} />
      <DailyQuote />
      <OnThisDay data={onThisDay} />
      <FeaturedPhotos photos={featuredPhotos} />
      <TimelinePreview events={latestEvents} />
      <UpcomingDays days={upcomingDays} />
      <AnniversaryCountdown startDate={site.startDate} />
    </>
  );
}
