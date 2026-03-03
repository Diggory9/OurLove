"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { fetchTimelineEvent, updateTimelineEvent } from "@/lib/admin-api";
import ImageUploader from "@/components/admin/ImageUploader";
import type { TimelineEvent } from "@/types";

export default function EditTimelineEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [image, setImage] = useState("");
  const [order, setOrder] = useState(0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchTimelineEvent(slug)
      .then((data) => {
        const e = data as TimelineEvent;
        setTitle(e.title);
        setDate(e.date.split("T")[0]);
        setDescription(e.description);
        setIcon(e.icon);
        setImage(e.image);
        setOrder(e.order);
        setLoaded(true);
      })
      .catch(() => setError("Không tìm thấy sự kiện"));
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await updateTimelineEvent(slug, { title, date, description, icon, image, order });
      router.push("/admin/timeline");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi cập nhật");
    } finally {
      setSaving(false);
    }
  }

  if (!loaded && !error) return <div className="text-gray-500">Đang tải...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sửa sự kiện</h1>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl p-6 shadow-sm">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tiêu đề *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" required />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ngày *</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" required />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mô tả</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Icon (emoji)</label>
          <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
        </div>

        <ImageUploader value={image} onChange={setImage} label="Ảnh sự kiện" />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Thứ tự</label>
          <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="w-32 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50">
            {saving ? "Đang lưu..." : "Cập nhật"}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50">
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
