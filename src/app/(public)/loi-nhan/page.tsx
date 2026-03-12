import type { Metadata } from "next";
import { getAllLoveLetters, getSiteConfig } from "@/lib/data";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import LoveLetterList from "@/components/love-letters/LoveLetterList";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return {
    title: "Lời nhắn yêu thương",
    description: `Những lời nhắn yêu thương của ${site.person1Name} & ${site.person2Name}`,
    openGraph: {
      title: `Lời nhắn yêu thương | ${site.siteName}`,
      description: `Những lời nhắn yêu thương của ${site.person1Name} & ${site.person2Name}`,
      locale: "vi_VN",
    },
  };
}

export default async function LoveLettersPage() {
  const [letters, site] = await Promise.all([
    getAllLoveLetters(),
    getSiteConfig(),
  ]);

  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          title="Lời nhắn yêu thương"
          subtitle={`Những lời từ trái tim ${site.person1Name} & ${site.person2Name}`}
        />
        <LoveLetterList letters={letters} />

        {!letters.length && (
          <p className="text-center text-gray-500 py-20">
            Chưa có lời nhắn nào. Hãy thêm qua trang quản trị!
          </p>
        )}
      </Container>
    </section>
  );
}
