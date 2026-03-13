"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { fetchPlace, updatePlace } from "@/lib/admin-api";
import ImageUploader from "@/components/admin/ImageUploader";
import type { Place } from "@/types";

export default function EditPlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [place, setPlace] = useState<Place | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchPlace(id)
      .then((data) => setPlace(data as Place))
      .catch(() => setError("Không tìm thấy địa điểm"));
  }, [id]);

  function updateField(field: string, value: unknown) {
    setPlace((prev) => prev ? { ...prev, [field]: value } as Place : prev);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!place) return;

    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const updated = await updatePlace(id, {
        title: place.title,
        description: place.description,
        lat: place.lat,
        lng: place.lng,
        image: place.image,
        date: place.date,
      });
      setPlace(updated as Place);
      setSuccess("Đã lưu thành công!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi cập nhật");
    } finally {
      setSaving(false);
    }
  }

  if (!place && !error) {
    return <div className="text-gray-500">Đang tải...</div>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sửa địa điểm</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl p-6 shadow-sm">
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg">{success}</div>}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên địa điểm *</label>
          <input
            type="text"
            value={place?.title || ""}
            onChange={(e) => updateField("title", e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mô tả</label>
          <textarea
            value={place?.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Vĩ độ (Latitude) *</label>
            <input
              type="number"
              step="any"
              value={place?.lat ?? ""}
              onChange={(e) => updateField("lat", parseFloat(e.target.value))}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kinh độ (Longitude) *</label>
            <input
              type="number"
              step="any"
              value={place?.lng ?? ""}
              onChange={(e) => updateField("lng", parseFloat(e.target.value))}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ngày</label>
          <input
            type="date"
            value={place?.date?.split("T")[0] || ""}
            onChange={(e) => updateField("date", e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>

        <ImageUploader
          value={place?.image || ""}
          onChange={(url) => updateField("image", url)}
          label="Ảnh địa điểm"
        />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200"
          >
            Quay lại
          </button>
        </div>
      </form>
    </div>
  );
}
