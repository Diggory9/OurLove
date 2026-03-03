import Image from "next/image";
import Link from "next/link";
import type { Album } from "@/types";
import Card from "@/components/ui/Card";
import AnimatedSection from "@/components/shared/AnimatedSection";

interface AlbumGridProps {
  albums: Album[];
}

export default function AlbumGrid({ albums }: AlbumGridProps) {
  if (!albums.length) {
    return (
      <p className="text-center text-gray-500 py-20">
        Chưa có album nào.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {albums.map((album, i) => (
        <AnimatedSection key={album.id} delay={i * 0.1}>
          <Link href={`/thu-vien/${album.slug}`}>
            <Card>
              <div className="relative aspect-[4/3] overflow-hidden">
                {album.coverImage ? (
                  <Image
                    src={album.coverImage}
                    alt={album.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                    <svg className="w-12 h-12 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg">{album.title}</h3>
                {album.description && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {album.description}
                  </p>
                )}
                <p className="mt-2 text-xs text-primary-500 font-medium">
                  {album.photoCount} ảnh
                </p>
              </div>
            </Card>
          </Link>
        </AnimatedSection>
      ))}
    </div>
  );
}
