import type { Metadata } from "next";
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
        <AlbumGrid albums={albums} />
      </Container>
    </section>
  );
}
