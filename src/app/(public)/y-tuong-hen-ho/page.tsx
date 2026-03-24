import type { Metadata } from "next";
import { getAllDateIdeas, getSiteConfig } from "@/lib/data";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import DateIdeaRandom from "@/components/date-ideas/DateIdeaRandom";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return {
    title: "Ý tưởng hẹn hò",
    description: `Gợi ý hẹn hò cho ${site.person1Name} & ${site.person2Name}`,
    openGraph: {
      title: `Ý tưởng hẹn hò | ${site.siteName}`,
      description: `Bí quyết hẹn hò thú vị cho cặp đôi`,
      locale: "vi_VN",
    },
  };
}

export default async function DateIdeasPage() {
  const [ideas, site] = await Promise.all([
    getAllDateIdeas(),
    getSiteConfig(),
  ]);

  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          title="Ý tưởng hẹn hò"
          subtitle={`Hôm nay ${site.person1Name} & ${site.person2Name} nên làm gì nhỉ?`}
        />

        {ideas.length > 0 ? (
          <DateIdeaRandom ideas={ideas} />
        ) : (
          <p className="text-center text-gray-500 py-20">
            Chưa có ý tưởng nào. Hãy thêm qua trang quản trị!
          </p>
        )}
      </Container>
    </section>
  );
}
