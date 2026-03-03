"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { fetchAlbum, updateAlbum } from "@/lib/admin-api";
import ImageUploader from "@/components/admin/ImageUploader";
import type { Album } from "@/types";

export default function EditAlbumPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [album, setAlbum] = useState<Album | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [order, setOrder] = useState(0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAlbum(slug)
      .then((data) => {
        const a = data as Album;
        setAlbum(a);
        setTitle(a.title);
        setDescription(a.description);
        setCoverImage(a.coverImage);
        setOrder(a.order);
      })
      .catch(() => setError("Không tìm thấy album"));
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await updateAlbum(slug, { title, description, coverImage, order });
      router.push("/admin/albums");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi cập nhật");
    } finally {
      setSaving(false);
    }
  }

  if (!album && !error) {
    return <div className="text-gray-500">Đang tải...</div>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sửa album</h1>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl p-6 shadow-sm">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tiêu đề *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mô tả</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>

        <ImageUploader value={coverImage} onChange={setCoverImage} label="Ảnh bìa" />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Thứ tự</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="w-32 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Cập nhật"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
