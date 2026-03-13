import type { Metadata } from "next";
import Link from "next/link";
import { getAllAlbums, getSiteConfig } from "@/lib/data";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import AlbumGrid from "@/components/gallery/AlbumGrid";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return {
    title: "Thư viện ảnh",
    description: `Album ảnh kỷ niệm của ${site.person1Name} & ${site.person2Name}`,
    openGraph: {
      title: `Thư viện ảnh | ${site.siteName}`,
      description: `Album ảnh kỷ niệm của ${site.person1Name} & ${site.person2Name}`,
      locale: "vi_VN",
    },
  };
}

export default async function GalleryPage() {
  const albums = await getAllAlbums();

  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          title="Thư viện ảnh"
          subtitle="Mỗi bức ảnh là một câu chuyện tình yêu"
        />
        <div className="flex justify-center mb-8">
          <Link
            href="/slideshow"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            Xem slideshow
          </Link>
        </div>
        <AlbumGrid albums={albums} />
      </Container>
    </section>
  );
}
