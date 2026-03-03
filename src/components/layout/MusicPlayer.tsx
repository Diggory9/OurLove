"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Music } from "@/types";

interface MusicPlayerProps {
  playlist: Music[];
}

export default function MusicPlayer({ playlist }: MusicPlayerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = playlist[currentIndex];

  // Restore state from localStorage
  useEffect(() => {
    const savedIndex = localStorage.getItem("music_index");
    if (savedIndex) {
      const idx = parseInt(savedIndex);
      if (idx >= 0 && idx < playlist.length) setCurrentIndex(idx);
    }
  }, [playlist.length]);

  // Save state
  useEffect(() => {
    localStorage.setItem("music_index", String(currentIndex));
  }, [currentIndex]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const playNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play().catch(() => {}), 100);
  }, [currentIndex, playlist.length]);

  const playPrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentIndex(prevIndex);
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play().catch(() => {}), 100);
  }, [currentIndex, playlist.length]);

  if (!playlist.length) return null;

  return (
    <>
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.url}
          onEnded={playNext}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />
      )}

      <div className="fixed bottom-6 right-6 z-50">
        {/* Expanded player */}
        {isOpen && (
          <div className="mb-3 bg-white rounded-2xl shadow-2xl border border-primary-100 p-4 w-72">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-primary-600">
                {currentIndex + 1}/{playlist.length}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                &#10005;
              </button>
            </div>

            <div className="text-center mb-4">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {currentTrack?.title || "Chưa có bài hát"}
              </p>
              {currentTrack?.artist && (
                <p className="text-xs text-gray-500 mt-0.5">{currentTrack.artist}</p>
              )}
            </div>

            <div className="flex items-center justify-center gap-6">
              <button
                onClick={playPrev}
                className="text-gray-500 hover:text-primary-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>

              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors shadow-lg"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <button
                onClick={playNext}
                className="text-gray-500 hover:text-primary-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>
            </div>

            {!isPlaying && (
              <p className="text-center text-xs text-gray-400 mt-3">
                Nhấn để phát nhạc
              </p>
            )}
          </div>
        )}

        {/* Floating button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
            isPlaying
              ? "bg-primary-600 text-white animate-pulse"
              : "bg-white text-primary-600 border-2 border-primary-200 hover:border-primary-400"
          }`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </button>
      </div>
    </>
  );
}
