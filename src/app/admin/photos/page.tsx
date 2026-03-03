"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchPhotos, fetchAlbums, deletePhoto } from "@/lib/admin-api";
import type { Photo, Album } from "@/types";

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [filterAlbum, setFilterAlbum] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const [photosData, albumsData] = await Promise.all([
        fetchPhotos(filterAlbum || undefined),
        fetchAlbums(),
      ]);
      setPhotos(photosData as Photo[]);
      setAlbums(albumsData as Album[]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, [filterAlbum]);

  async function handleDelete(id: string) {
    if (!confirm("Xóa ảnh này?")) return;
    try {
      await deletePhoto(id);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi xóa");
    }
  }

  async function toggleFeatured(photo: Photo) {
    try {
      const { updatePhoto } = await import("@/lib/admin-api");
      await updatePhoto(photo.id, { featured: !photo.featured });
      setPhotos((prev) =>
        prev.map((p) => (p.id === photo.id ? { ...p, featured: !p.featured } : p))
      );
    } catch {
      // ignore
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Photos</h1>
        <Link
          href="/admin/photos/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          + Upload ảnh
        </Link>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={filterAlbum}
          onChange={(e) => setFilterAlbum(e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
        >
          <option value="">Tất cả album</option>
          {albums.map((album) => (
            <option key={album.id} value={album.id}>
              {album.title}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : !photos.length ? (
        <p className="text-gray-500 text-center py-12">Chưa có ảnh nào.</p>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={photo.src}
                  alt={photo.alt || ""}
                  fill
                  className="object-cover"
                  sizes="150px"
                />
                {photo.featured && (
                  <div className="absolute top-1 right-1 bg-accent-400 text-white text-[10px] px-1.5 py-0.5 rounded">
                    Featured
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFeatured(photo)}
                    className="text-[10px] bg-white text-gray-800 px-2 py-1 rounded"
                  >
                    {photo.featured ? "Unfeatured" : "Featured"}
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="text-[10px] bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
