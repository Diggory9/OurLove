import { notFound } from "next/navigation";
import { getLoveLetterBySlug, getSiteConfig } from "@/lib/data";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { formatDateLong } from "@/lib/utils";
import type { Metadata } from "next";

interface LoveLetterDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LoveLetterDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [letter, site] = await Promise.all([
    getLoveLetterBySlug(slug),
    getSiteConfig(),
  ]);

  if (!letter) return { title: "Lời nhắn không tìm thấy" };

  return {
    title: letter.title,
    description: `Lời nhắn từ ${letter.author || site.person1Name} gửi ${letter.recipient || site.person2Name}`,
    openGraph: {
      title: `${letter.title} | ${site.siteName}`,
      type: "article",
      locale: "vi_VN",
    },
  };
}

export default async function LoveLetterDetailPage({ params }: LoveLetterDetailPageProps) {
  const { slug } = await params;
  const [letter, site] = await Promise.all([
    getLoveLetterBySlug(slug),
    getSiteConfig(),
  ]);

  if (!letter) notFound();

  return (
    <section className="py-16">
      <Container>
        <div className="mb-8">
          <Button href="/loi-nhan" variant="outline" size="sm">
            &larr; Tất cả lời nhắn
          </Button>
        </div>

        <AnimatedSection>
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-primary-50 to-pink-50 rounded-3xl p-8 sm:p-12 shadow-sm border border-primary-100">
              <div className="text-center mb-8">
                <span className="text-4xl mb-4 block">💌</span>
                <h1 className="font-[var(--font-script)] text-3xl sm:text-4xl text-gray-900 mb-3">
                  {letter.title}
                </h1>
                <p className="text-sm text-primary-500">
                  Từ <strong>{letter.author || site.person1Name}</strong> gửi{" "}
                  <strong>{letter.recipient || site.person2Name}</strong>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDateLong(letter.createdAt)}
                </p>
              </div>

              <div className="border-t border-primary-200 pt-8">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line font-light text-lg">
                  {letter.content}
                </div>
              </div>

              <div className="mt-10 text-right">
                <p className="font-[var(--font-script)] text-2xl text-primary-600">
                  {letter.author || site.person1Name}
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </Container>
    </section>
  );
}
