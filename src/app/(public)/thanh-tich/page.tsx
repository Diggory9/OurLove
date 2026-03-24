import type { Metadata } from "next";
import {
  getSiteConfig,
  getAllAlbums,
  getFeaturedPhotos,
  getAllTimelineEvents,
  getAllBucketItems,
  getAllSpecialDays,
  getAllLoveLetters,
  getAllPlaces,
  getAllMusic,
} from "@/lib/data";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import AchievementList from "@/components/achievements/AchievementList";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return {
    title: "Thành tích",
    description: `Những cột mốc đáng nhớ của ${site.person1Name} & ${site.person2Name}`,
    openGraph: {
      title: `Thành tích | ${site.siteName}`,
      description: `Hành trình yêu thương và những thành tựu cùng nhau`,
      locale: "vi_VN",
    },
  };
}

function daysBetween(startDate: string): number {
  const start = new Date(startDate).getTime();
  return Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24));
}

export default async function AchievementsPage() {
  const [site, albums, photos, events, bucketItems, specialDays, letters, places, music] =
    await Promise.all([
      getSiteConfig(),
      getAllAlbums(),
      getFeaturedPhotos(),
      getAllTimelineEvents(),
      getAllBucketItems(),
      getAllSpecialDays(),
      getAllLoveLetters(),
      getAllPlaces(),
      getAllMusic(),
    ]);

  const days = daysBetween(site.startDate);
  const completedBucket = bucketItems.filter((i) => i.completed).length;

  const achievements = [
    // Mốc thời gian
    {
      id: "days-1",
      title: "Ngày đầu tiên",
      description: "Bắt đầu hành trình yêu thương",
      icon: "&#128156;",
      unlocked: days >= 1,
      progress: Math.min(days, 1),
      maxProgress: 1,
      category: "Cột mốc thời gian",
    },
    {
      id: "days-30",
      title: "1 tháng bên nhau",
      description: "Đã yêu nhau được 30 ngày",
      icon: "&#127801;",
      unlocked: days >= 30,
      progress: Math.min(days, 30),
      maxProgress: 30,
      category: "Cột mốc thời gian",
    },
    {
      id: "days-100",
      title: "100 ngày yêu",
      description: "Cùng nhau vượt qua 100 ngày",
      icon: "&#127942;",
      unlocked: days >= 100,
      progress: Math.min(days, 100),
      maxProgress: 100,
      category: "Cột mốc thời gian",
    },
    {
      id: "days-200",
      title: "200 ngày bên nhau",
      description: "Tình yêu ngày càng sâu đậm",
      icon: "&#127775;",
      unlocked: days >= 200,
      progress: Math.min(days, 200),
      maxProgress: 200,
      category: "Cột mốc thời gian",
    },
    {
      id: "days-365",
      title: "1 năm tròn",
      description: "Kỷ niệm 365 ngày yêu thương",
      icon: "&#127874;",
      unlocked: days >= 365,
      progress: Math.min(days, 365),
      maxProgress: 365,
      category: "Cột mốc thời gian",
    },
    {
      id: "days-500",
      title: "500 ngày",
      description: "Nửa nghìn ngày bên nhau",
      icon: "&#128171;",
      unlocked: days >= 500,
      progress: Math.min(days, 500),
      maxProgress: 500,
      category: "Cột mốc thời gian",
    },
    {
      id: "days-730",
      title: "2 năm yêu",
      description: "730 ngày không rời xa",
      icon: "&#128142;",
      unlocked: days >= 730,
      progress: Math.min(days, 730),
      maxProgress: 730,
      category: "Cột mốc thời gian",
    },
    {
      id: "days-1000",
      title: "1000 ngày",
      description: "Một nghìn ngày yêu thương",
      icon: "&#128081;",
      unlocked: days >= 1000,
      progress: Math.min(days, 1000),
      maxProgress: 1000,
      category: "Cột mốc thời gian",
    },

    // Kỷ niệm
    {
      id: "albums-1",
      title: "Album đầu tiên",
      description: "Tạo album ảnh đầu tiên",
      icon: "&#128247;",
      unlocked: albums.length >= 1,
      progress: Math.min(albums.length, 1),
      maxProgress: 1,
      category: "Kỷ niệm",
    },
    {
      id: "albums-5",
      title: "Nhiếp ảnh gia",
      description: "Có 5 album ảnh kỷ niệm",
      icon: "&#128248;",
      unlocked: albums.length >= 5,
      progress: Math.min(albums.length, 5),
      maxProgress: 5,
      category: "Kỷ niệm",
    },
    {
      id: "photos-10",
      title: "Khoảnh khắc đáng nhớ",
      description: "Có 10 ảnh nổi bật",
      icon: "&#127748;",
      unlocked: photos.length >= 10,
      progress: Math.min(photos.length, 10),
      maxProgress: 10,
      category: "Kỷ niệm",
    },
    {
      id: "events-5",
      title: "Dòng thời gian",
      description: "Ghi lại 5 sự kiện quan trọng",
      icon: "&#128197;",
      unlocked: events.length >= 5,
      progress: Math.min(events.length, 5),
      maxProgress: 5,
      category: "Kỷ niệm",
    },
    {
      id: "events-10",
      title: "Nhà sử học tình yêu",
      description: "10 mốc sự kiện trong timeline",
      icon: "&#128218;",
      unlocked: events.length >= 10,
      progress: Math.min(events.length, 10),
      maxProgress: 10,
      category: "Kỷ niệm",
    },
    {
      id: "letters-1",
      title: "Lá thư đầu tiên",
      description: "Viết lời nhắn yêu thương đầu tiên",
      icon: "&#128140;",
      unlocked: letters.length >= 1,
      progress: Math.min(letters.length, 1),
      maxProgress: 1,
      category: "Kỷ niệm",
    },
    {
      id: "letters-5",
      title: "Nhà thơ tình",
      description: "Viết 5 lời nhắn yêu thương",
      icon: "&#128221;",
      unlocked: letters.length >= 5,
      progress: Math.min(letters.length, 5),
      maxProgress: 5,
      category: "Kỷ niệm",
    },

    // Khám phá
    {
      id: "places-1",
      title: "Chuyến đi đầu tiên",
      description: "Ghim địa điểm đầu tiên trên bản đồ",
      icon: "&#128205;",
      unlocked: places.length >= 1,
      progress: Math.min(places.length, 1),
      maxProgress: 1,
      category: "Khám phá",
    },
    {
      id: "places-5",
      title: "Nhà thám hiểm",
      description: "Khám phá 5 địa điểm cùng nhau",
      icon: "&#127757;",
      unlocked: places.length >= 5,
      progress: Math.min(places.length, 5),
      maxProgress: 5,
      category: "Khám phá",
    },
    {
      id: "places-10",
      title: "Du lịch gia",
      description: "Đã đến 10 địa điểm cùng nhau",
      icon: "&#9992;",
      unlocked: places.length >= 10,
      progress: Math.min(places.length, 10),
      maxProgress: 10,
      category: "Khám phá",
    },
    {
      id: "bucket-1",
      title: "Ước mơ đầu tiên",
      description: "Hoàn thành 1 mục trong bucket list",
      icon: "&#9989;",
      unlocked: completedBucket >= 1,
      progress: Math.min(completedBucket, 1),
      maxProgress: 1,
      category: "Khám phá",
    },
    {
      id: "bucket-5",
      title: "Chinh phục ước mơ",
      description: "Hoàn thành 5 mục bucket list",
      icon: "&#128640;",
      unlocked: completedBucket >= 5,
      progress: Math.min(completedBucket, 5),
      maxProgress: 5,
      category: "Khám phá",
    },
    {
      id: "bucket-all",
      title: "Hoàn hảo!",
      description: "Hoàn thành toàn bộ bucket list",
      icon: "&#127941;",
      unlocked: bucketItems.length > 0 && completedBucket === bucketItems.length,
      progress: completedBucket,
      maxProgress: Math.max(bucketItems.length, 1),
      category: "Khám phá",
    },

    // Âm nhạc & Đặc biệt
    {
      id: "music-1",
      title: "Bài hát của chúng ta",
      description: "Thêm bài hát đầu tiên vào playlist",
      icon: "&#127925;",
      unlocked: music.length >= 1,
      progress: Math.min(music.length, 1),
      maxProgress: 1,
      category: "Âm nhạc & Đặc biệt",
    },
    {
      id: "music-10",
      title: "DJ tình yêu",
      description: "Playlist có 10 bài hát",
      icon: "&#127911;",
      unlocked: music.length >= 10,
      progress: Math.min(music.length, 10),
      maxProgress: 10,
      category: "Âm nhạc & Đặc biệt",
    },
    {
      id: "special-3",
      title: "Ngày đặc biệt",
      description: "Đánh dấu 3 ngày quan trọng",
      icon: "&#127881;",
      unlocked: specialDays.length >= 3,
      progress: Math.min(specialDays.length, 3),
      maxProgress: 3,
      category: "Âm nhạc & Đặc biệt",
    },
  ];

  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          title="Thành tích"
          subtitle={`Hành trình ${days.toLocaleString()} ngày yêu thương của ${site.person1Name} & ${site.person2Name}`}
        />

        <AchievementList achievements={achievements} />
      </Container>
    </section>
  );
}
