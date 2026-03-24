"use client";

import { useState } from "react";
import Image from "next/image";
import type { Photo } from "@/types";
import PhotoLightbox from "./PhotoLightbox";

interface PhotoGridProps {
  photos: Photo[];
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!photos.length) {
    return (
      <p className="text-center text-gray-500 py-20">
        Chưa có ảnh nào trong album này.
      </p>
    );
  }

  return (
    <>
      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            className="break-inside-avoid cursor-pointer group"
            onClick={() => setLightboxIndex(i)}
          >
            <div className="relative overflow-hidden rounded-xl">
              {photo.mediaType === "video" && photo.videoUrl ? (
                <video
                  src={photo.videoUrl}
                  poster={photo.src}
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                <Image
                  src={photo.src}
                  alt={photo.alt || photo.caption || "Ảnh"}
                  width={photo.width || 600}
                  height={photo.height || 400}
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              {photo.mediaType === "video" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            {photo.caption && (
              <p className="mt-2 text-xs text-gray-500 px-1">{photo.caption}</p>
            )}
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onChangeIndex={setLightboxIndex}
        />
      )}
    </>
  );
}
