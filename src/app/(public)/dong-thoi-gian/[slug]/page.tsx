import { notFound } from "next/navigation";
import Image from "next/image";
import { getTimelineEventBySlug, getSiteConfig } from "@/lib/data";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import AnimatedSection from "@/components/shared/AnimatedSection";
import ShareButtons from "@/components/shared/ShareButtons";
import { formatDateLong } from "@/lib/utils";
import type { Metadata } from "next";

interface TimelineDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TimelineDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [event, site] = await Promise.all([
    getTimelineEventBySlug(slug),
    getSiteConfig(),
  ]);

  if (!event) return { title: "Sự kiện không tìm thấy" };

  return {
    title: event.title,
    description: event.description || `Kỷ niệm của ${site.person1Name} & ${site.person2Name}`,
    openGraph: {
      title: `${event.title} | ${site.siteName}`,
      description: event.description,
      images: event.image ? [{ url: event.image }] : undefined,
      type: "article",
      locale: "vi_VN",
    },
  };
}

export default async function TimelineDetailPage({ params }: TimelineDetailPageProps) {
  const { slug } = await params;
  const event = await getTimelineEventBySlug(slug);

  if (!event) notFound();

  const allImages = [
    ...(event.image ? [event.image] : []),
    ...(event.images || []),
  ];

  return (
    <section className="py-16">
      <Container>
        <div className="mb-8">
          <Button href="/dong-thoi-gian" variant="outline" size="sm">
            &larr; Dòng thời gian
          </Button>
        </div>

        <AnimatedSection>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                {event.icon && (
                  <span className="text-3xl">{event.icon}</span>
                )}
                <span className="text-sm font-medium text-primary-500 bg-primary-50 px-4 py-1.5 rounded-full">
                  {formatDateLong(event.date)}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                {event.title}
              </h1>
            </div>

            {event.description && (
              <div className="prose prose-gray max-w-none mb-10">
                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            )}

            <div className="flex justify-center mb-8">
              <ShareButtons title={event.title} description={event.description} />
            </div>

            {allImages.length > 0 && (
              <div className="space-y-6">
                {allImages.length === 1 ? (
                  <div className="relative rounded-2xl overflow-hidden aspect-video">
                    <Image
                      src={allImages[0]}
                      alt={event.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 768px"
                      priority
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {allImages.map((img, i) => (
                      <div
                        key={i}
                        className={`relative rounded-2xl overflow-hidden ${
                          i === 0 && allImages.length % 2 !== 0
                            ? "sm:col-span-2 aspect-video"
                            : "aspect-square"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${event.title} - ảnh ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes={
                            i === 0 && allImages.length % 2 !== 0
                              ? "(max-width: 768px) 100vw, 768px"
                              : "(max-width: 768px) 100vw, 384px"
                          }
                          priority={i === 0}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </AnimatedSection>
      </Container>
    </section>
  );
}
