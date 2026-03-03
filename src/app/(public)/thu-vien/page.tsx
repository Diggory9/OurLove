import type { Metadata } from "next";
import { getAllAlbums } from "@/lib/data";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import AlbumGrid from "@/components/gallery/AlbumGrid";

export const metadata: Metadata = {
  title: "Thư viện ảnh",
  description: "Album ảnh kỷ niệm của chúng mình",
};

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
