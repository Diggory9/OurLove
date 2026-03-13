"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PhotoSlideshow from "@/components/gallery/PhotoSlideshow";
import type { Photo, Music } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function SlideshowPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [music, setMusic] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [photosRes, musicRes] = await Promise.all([
          fetch(`${API_URL}/api/photos/featured`).then((r) => r.json()),
          fetch(`${API_URL}/api/music`).then((r) => r.json()),
        ]);
        setPhotos(photosRes.data || []);
        setMusic(musicRes.data || []);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
        <div className="text-white/60 text-lg">Đang tải...</div>
      </div>
    );
  }

  if (!photos.length) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center flex-col gap-4">
        <p className="text-white/60 text-lg">Chưa có ảnh nổi bật nào.</p>
        <button
          onClick={() => router.back()}
          className="text-primary-400 hover:text-primary-300 text-sm"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <PhotoSlideshow
      photos={photos}
      music={music}
      onClose={() => router.back()}
    />
  );
}
