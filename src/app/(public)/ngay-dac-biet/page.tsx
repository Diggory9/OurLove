import type { Metadata } from "next";
import { getAllSpecialDays, getSiteConfig } from "@/lib/data";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import SpecialDaysList from "@/components/special-days/SpecialDaysList";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return {
    title: "Ngày đặc biệt",
    description: `Những ngày quan trọng của ${site.person1Name} & ${site.person2Name}`,
    openGraph: {
      title: `Ngày đặc biệt | ${site.siteName}`,
      description: `Sinh nhật, kỷ niệm và những ngày đặc biệt`,
      locale: "vi_VN",
    },
  };
}

export default async function SpecialDaysPage() {
  const [days, site] = await Promise.all([
    getAllSpecialDays(),
    getSiteConfig(),
  ]);

  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          title="Ngày đặc biệt"
          subtitle={`Những ngày không thể quên của ${site.person1Name} & ${site.person2Name}`}
        />
        <SpecialDaysList days={days} />

        {!days.length && (
          <p className="text-center text-gray-500 py-20">
            Chưa có ngày đặc biệt nào. Hãy thêm qua trang quản trị!
          </p>
        )}
      </Container>
    </section>
  );
}
