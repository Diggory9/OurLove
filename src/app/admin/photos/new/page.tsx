"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchAlbums, createPhoto, uploadImages } from "@/lib/admin-api";
import type { Album } from "@/types";
import Image from "next/image";

export default function NewPhotoPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [albumId, setAlbumId] = useState("");
  const [featured, setFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAlbums().then((data) => {
      const a = data as Album[];
      setAlbums(a);
      if (a.length > 0) setAlbumId(a[0].id);
    });
  }, []);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    setError("");
    try {
      const results = await uploadImages(files);
      setUploadedUrls((prev) => [...prev, ...results.map((r) => r.url)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload thất bại");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!albumId) { setError("Vui lòng chọn album"); return; }
    if (!uploadedUrls.length) { setError("Vui lòng upload ít nhất 1 ảnh"); return; }

    setSaving(true);
    setError("");
    try {
      for (const url of uploadedUrls) {
        await createPhoto({
          albumId,
          src: url,
          thumbnail: url,
          featured,
        });
      }
      router.push("/admin/photos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi lưu ảnh");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload ảnh mới</h1>

      <div className="space-y-5 bg-white rounded-xl p-6 shadow-sm">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Album *
          </label>
          <select
            value={albumId}
            onChange={(e) => setAlbumId(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none"
          >
            {albums.map((a) => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded"
            />
            Ảnh nổi bật (hiện trên trang chủ)
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Chọn ảnh (tối đa 10)
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl w-full text-sm text-gray-500 hover:border-primary-400 hover:text-primary-600 disabled:opacity-50"
          >
            {uploading ? "Đang upload..." : "Nhấn để chọn ảnh"}
          </button>
        </div>

        {uploadedUrls.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Đã upload ({uploadedUrls.length} ảnh)
            </p>
            <div className="grid grid-cols-4 gap-2">
              {uploadedUrls.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                  <Image src={url} alt="" fill className="object-cover" sizes="100px" />
                  <button
                    onClick={() => setUploadedUrls((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    &#10005;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !uploadedUrls.length}
            className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : `Lưu ${uploadedUrls.length} ảnh`}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
