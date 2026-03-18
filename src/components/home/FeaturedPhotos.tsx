"use client";

import Image from "next/image";
import Link from "next/link";
import type { Photo } from "@/types";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { useClientFallback } from "@/hooks/useClientFallback";

interface FeaturedPhotosProps {
  photos: Photo[];
}

export default function FeaturedPhotos({ photos: initialPhotos }: FeaturedPhotosProps) {
  const { data: photos, loading } = useClientFallback(initialPhotos, "/api/photos/featured");

  if (loading) {
    return (
      <section className="py-20">
        <Container>
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        </Container>
      </section>
    );
  }

  if (!photos.length) return null;

  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          title="Khoảnh khắc đáng nhớ"
          subtitle="Những bức ảnh đẹp nhất của chúng mình"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, i) => (
            <AnimatedSection key={photo.id} delay={i * 0.1}>
              <div className="group relative aspect-square overflow-hidden rounded-2xl">
                <Image
                  src={photo.src}
                  alt={photo.alt || photo.caption || "Ảnh kỷ niệm"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {photo.caption}
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/thu-vien"
            className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            Xem tất cả ảnh
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </Container>
    </section>
  );
}
