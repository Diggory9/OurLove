"use client";

import { useEffect, useState } from "react";
import { fetchAlbums, fetchPhotos, fetchTimelineEvents, fetchMusic, fetchLoveLetters, fetchBucketItems, fetchSpecialDays } from "@/lib/admin-api";
import Link from "next/link";

interface Stats {
  albums: number;
  photos: number;
  events: number;
  music: number;
  letters: number;
  bucketItems: number;
  specialDays: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ albums: 0, photos: 0, events: 0, music: 0, letters: 0, bucketItems: 0, specialDays: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [albums, photos, events, music, letters, bucketItems, specialDays] = await Promise.all([
          fetchAlbums(),
          fetchPhotos(),
          fetchTimelineEvents(),
          fetchMusic(),
          fetchLoveLetters().catch(() => []),
          fetchBucketItems().catch(() => []),
          fetchSpecialDays().catch(() => []),
        ]);
        setStats({
          albums: (albums as unknown[]).length,
          photos: (photos as unknown[]).length,
          events: (events as unknown[]).length,
          music: (music as unknown[]).length,
          letters: (letters as unknown[]).length,
          bucketItems: (bucketItems as unknown[]).length,
          specialDays: (specialDays as unknown[]).length,
        });
      } catch {
        // Ignore errors
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const cards = [
    { label: "Albums", value: stats.albums, href: "/admin/albums", color: "bg-pink-500" },
    { label: "Photos", value: stats.photos, href: "/admin/photos", color: "bg-rose-500" },
    { label: "Timeline", value: stats.events, href: "/admin/timeline", color: "bg-red-500" },
    { label: "Lời nhắn", value: stats.letters, href: "/admin/love-letters", color: "bg-purple-500" },
    { label: "Kế hoạch", value: stats.bucketItems, href: "/admin/bucket-list", color: "bg-blue-500" },
    { label: "Ngày đặc biệt", value: stats.specialDays, href: "/admin/special-days", color: "bg-green-500" },
    { label: "Music", value: stats.music, href: "/admin/music", color: "bg-amber-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center text-white text-lg mb-3`}>
                {card.value}
              </div>
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Hành động nhanh</h2>
          <div className="space-y-2">
            <Link href="/admin/albums/new" className="block text-sm text-primary-600 hover:underline">
              + Tạo album mới
            </Link>
            <Link href="/admin/photos/new" className="block text-sm text-primary-600 hover:underline">
              + Upload ảnh mới
            </Link>
            <Link href="/admin/timeline/new" className="block text-sm text-primary-600 hover:underline">
              + Thêm sự kiện timeline
            </Link>
            <Link href="/admin/love-letters/new" className="block text-sm text-primary-600 hover:underline">
              + Viết lời nhắn
            </Link>
            <Link href="/admin/bucket-list/new" className="block text-sm text-primary-600 hover:underline">
              + Thêm kế hoạch
            </Link>
            <Link href="/admin/special-days/new" className="block text-sm text-primary-600 hover:underline">
              + Thêm ngày đặc biệt
            </Link>
            <Link href="/admin/settings" className="block text-sm text-primary-600 hover:underline">
              Cài đặt website
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Hướng dẫn</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>1. Vào Settings để cập nhật tên cặp đôi và ngày bắt đầu yêu</li>
            <li>2. Tạo albums và upload ảnh kỷ niệm</li>
            <li>3. Thêm các mốc sự kiện vào timeline</li>
            <li>4. Upload nhạc yêu thích vào playlist</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
