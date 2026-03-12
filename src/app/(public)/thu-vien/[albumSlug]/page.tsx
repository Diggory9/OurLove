import { notFound } from "next/navigation";
import { getAlbumBySlug, getPhotosByAlbumSlug } from "@/lib/data";
import Container from "@/components/ui/Container";
import PhotoGrid from "@/components/gallery/PhotoGrid";
import Button from "@/components/ui/Button";

interface AlbumDetailPageProps {
  params: Promise<{ albumSlug: string }>;
}

export async function generateMetadata({ params }: AlbumDetailPageProps) {
  const { albumSlug } = await params;
  const album = await getAlbumBySlug(albumSlug);
  if (!album) return { title: "Album không tìm thấy" };
  return {
    title: album.title,
    description: album.description || `Album ảnh ${album.title}`,
    openGraph: {
      title: album.title,
      description: album.description || `Album ảnh ${album.title}`,
      images: album.coverImage ? [{ url: album.coverImage }] : undefined,
      locale: "vi_VN",
    },
  };
}

export default async function AlbumDetailPage({ params }: AlbumDetailPageProps) {
  const { albumSlug } = await params;
  const [album, photos] = await Promise.all([
    getAlbumBySlug(albumSlug),
    getPhotosByAlbumSlug(albumSlug),
  ]);

  if (!album) notFound();

  return (
    <section className="py-16">
      <Container>
        <div className="mb-8">
          <Button href="/thu-vien" variant="outline" size="sm">
            &larr; Tất cả album
          </Button>
        </div>

        <div className="text-center mb-14">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {album.title}
          </h1>
          {album.description && (
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              {album.description}
            </p>
          )}
          <p className="mt-2 text-sm text-primary-500 font-medium">
            {photos.length} ảnh
          </p>
        </div>

        <PhotoGrid photos={photos} />
      </Container>
    </section>
  );
}
