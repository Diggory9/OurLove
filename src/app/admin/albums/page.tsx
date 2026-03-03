"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchAlbums, deleteAlbum } from "@/lib/admin-api";
import type { Album } from "@/types";

export default function AdminAlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAlbums() {
    try {
      const data = await fetchAlbums();
      setAlbums(data as Album[]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAlbums(); }, []);

  async function handleDelete(slug: string) {
    if (!confirm("Xóa album này? Tất cả ảnh trong album cũng sẽ bị xóa.")) return;
    try {
      await deleteAlbum(slug);
      setAlbums((prev) => prev.filter((a) => a.slug !== slug));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi xóa album");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Albums</h1>
        <Link
          href="/admin/albums/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          + Tạo album
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-20" />
          ))}
        </div>
      ) : !albums.length ? (
        <p className="text-gray-500 text-center py-12">Chưa có album nào.</p>
      ) : (
        <div className="space-y-3">
          {albums.map((album) => (
            <div
              key={album.id}
              className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {album.coverImage ? (
                  <Image
                    src={album.coverImage}
                    alt={album.title}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No img
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{album.title}</h3>
                <p className="text-sm text-gray-500">{album.photoCount} ảnh</p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/albums/${album.slug}`}
                  className="text-sm text-primary-600 hover:underline"
                >
                  Sửa
                </Link>
                <button
                  onClick={() => handleDelete(album.slug)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
