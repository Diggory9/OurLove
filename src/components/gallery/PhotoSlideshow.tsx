"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import type { Photo, Music } from "@/types";

interface PhotoSlideshowProps {
  photos: Photo[];
  music: Music[];
  onClose: () => void;
}

export default function PhotoSlideshow({ photos, music, onClose }: PhotoSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [musicIndex, setMusicIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Auto-play slideshow
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(goNext, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, goNext]);

  // Play music
  useEffect(() => {
    if (audioRef.current && music.length > 0) {
      if (isMusicPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMusicPlaying, musicIndex, music.length]);

  // Keyboard controls
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, goNext, goPrev]);

  const currentPhoto = photos[currentIndex];
  const currentTrack = music[musicIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      {/* Background image with blur */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={currentPhoto.src}
          alt=""
          fill
          className="object-cover blur-2xl opacity-30 scale-110"
          priority
        />
      </div>

      {/* Main photo */}
      <div className="relative w-full h-full flex items-center justify-center p-8">
        <div className="relative max-w-5xl max-h-[85vh] w-full h-full">
          <Image
            key={currentIndex}
            src={currentPhoto.src}
            alt={currentPhoto.alt || currentPhoto.caption || ""}
            fill
            className="object-contain animate-fade-in"
            priority
            sizes="100vw"
          />
        </div>
      </div>

      {/* Caption */}
      {currentPhoto.caption && (
        <div className="absolute bottom-24 left-0 right-0 text-center">
          <p className="text-white/90 text-lg font-[var(--font-script)] bg-black/30 inline-block px-6 py-2 rounded-full backdrop-blur-sm">
            {currentPhoto.caption}
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full">
        <button onClick={goPrev} className="text-white/80 hover:text-white transition-colors" title="Ảnh trước">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-white/80 hover:text-white transition-colors"
          title={isPlaying ? "Tạm dừng" : "Tiếp tục"}
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>

        <button onClick={goNext} className="text-white/80 hover:text-white transition-colors" title="Ảnh tiếp">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        <div className="w-px h-6 bg-white/20" />

        <span className="text-white/60 text-sm min-w-[4rem] text-center">
          {currentIndex + 1} / {photos.length}
        </span>

        {music.length > 0 && (
          <>
            <div className="w-px h-6 bg-white/20" />
            <button
              onClick={() => setIsMusicPlaying(!isMusicPlaying)}
              className="text-white/80 hover:text-white transition-colors"
              title={isMusicPlaying ? "Tắt nhạc" : "Bật nhạc"}
            >
              {isMusicPlaying ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M9 9H5v6h4l5 5V4L9 9z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707a1 1 0 011.707.707v14a1 1 0 01-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
              )}
            </button>
          </>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-sm p-2 rounded-full"
        title="Đóng (Esc)"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      {/* Music info */}
      {music.length > 0 && currentTrack && isMusicPlaying && (
        <div className="absolute top-6 left-6 text-white/60 text-sm bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
          <span className="animate-pulse">&#9835;</span>
          <span>{currentTrack.title}</span>
        </div>
      )}

      {/* Audio element */}
      {music.length > 0 && (
        <audio
          ref={audioRef}
          src={currentTrack?.url}
          autoPlay
          onEnded={() => setMusicIndex((prev) => (prev + 1) % music.length)}
        />
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(1.02); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
