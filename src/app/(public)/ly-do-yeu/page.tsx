import type { Metadata } from "next";
import { getAllLoveReasons, getSiteConfig } from "@/lib/data";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import LoveReasonList from "@/components/love-reasons/LoveReasonList";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return {
    title: "Lý do yêu em",
    description: `Những lý do ${site.person1Name} yêu ${site.person2Name}`,
    openGraph: {
      title: `Lý do yêu em | ${site.siteName}`,
      description: `Vì sao anh yêu em?`,
      locale: "vi_VN",
    },
  };
}

export default async function LoveReasonsPage() {
  const [reasons, site] = await Promise.all([
    getAllLoveReasons(),
    getSiteConfig(),
  ]);

  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          title="Lý do yêu em"
          subtitle={`${reasons.length} lý do ${site.person1Name} yêu ${site.person2Name}`}
        />

        {reasons.length > 0 ? (
          <LoveReasonList reasons={reasons} />
        ) : (
          <p className="text-center text-gray-500 py-20">
            Chưa có lý do nào. Hãy thêm qua trang quản trị!
          </p>
        )}
      </Container>
    </section>
  );
}
