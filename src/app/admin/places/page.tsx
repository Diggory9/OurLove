"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPlaces, deletePlace } from "@/lib/admin-api";
import type { Place } from "@/types";

export default function AdminPlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadPlaces() {
    try {
      const data = await fetchPlaces();
      setPlaces(data as Place[]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlaces();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Xóa địa điểm này?")) return;
    try {
      await deletePlace(id);
      setPlaces((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi xóa");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bản đồ kỷ niệm</h1>
        <Link
          href="/admin/places/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          + Thêm địa điểm
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-20" />
          ))}
        </div>
      ) : !places.length ? (
        <p className="text-gray-500 text-center py-12">Chưa có địa điểm nào.</p>
      ) : (
        <div className="space-y-3">
          {places.map((place) => (
            <div
              key={place.id}
              className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm"
            >
              {place.image ? (
                <img
                  src={place.image}
                  alt={place.title}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0 text-2xl">
                  &#128205;
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{place.title}</h3>
                <p className="text-sm text-gray-500">
                  {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                  {place.date && ` — ${new Date(place.date).toLocaleDateString("vi-VN")}`}
                </p>
              </div>
              <div className="flex gap-3 items-center">
                <Link
                  href={`/admin/places/${place.id}`}
                  className="text-sm text-primary-600 hover:underline"
                >
                  Sửa
                </Link>
                <button
                  onClick={() => handleDelete(place.id)}
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
