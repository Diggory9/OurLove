"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import Image from "next/image";
import type { Photo } from "@/types";

interface PhotoLightboxProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
}

export default function PhotoLightbox({
  photos,
  currentIndex,
  onClose,
  onChangeIndex,
}: PhotoLightboxProps) {
  const [isSlideshow, setIsSlideshow] = useState(false);
  const slideshowRef = useRef<ReturnType<typeof setInterval>>(null);

  const goNext = useCallback(() => {
    onChangeIndex((currentIndex + 1) % photos.length);
  }, [currentIndex, photos.length, onChangeIndex]);

  const goPrev = useCallback(() => {
    onChangeIndex((currentIndex - 1 + photos.length) % photos.length);
  }, [currentIndex, photos.length, onChangeIndex]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goNext, goPrev]);

  // Slideshow auto-advance
  useEffect(() => {
    if (isSlideshow) {
      slideshowRef.current = setInterval(goNext, 5000);
    }
    return () => {
      if (slideshowRef.current) clearInterval(slideshowRef.current);
    };
  }, [isSlideshow, goNext]);

  const photo = photos[currentIndex];

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        className="absolute top-4 right-4 text-white/70 hover:text-white z-10 text-2xl"
        onClick={onClose}
      >
        &#10005;
      </button>

      {/* Slideshow toggle */}
      <button
        className="absolute top-4 left-4 text-white/70 hover:text-white z-10 text-sm bg-white/10 px-3 py-1.5 rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          setIsSlideshow(!isSlideshow);
        }}
      >
        {isSlideshow ? "Dừng slideshow" : "Slideshow"}
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm z-10">
        {currentIndex + 1} / {photos.length}
      </div>

      {/* Prev button */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10 w-12 h-12 flex items-center justify-center bg-white/10 rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Image */}
      <div
        className="relative max-w-[90vw] max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.src}
          alt={photo.alt || ""}
          width={photo.width || 1200}
          height={photo.height || 800}
          className="max-h-[85vh] w-auto object-contain"
          priority
        />
        {photo.caption && (
          <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm p-3 text-center">
            {photo.caption}
          </p>
        )}
      </div>

      {/* Next button */}
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10 w-12 h-12 flex items-center justify-center bg-white/10 rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
