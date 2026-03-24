"use client";

import { useEffect, useState, useRef } from "react";
import { fetchDateIdeas, createDateIdea, updateDateIdea, deleteDateIdea, uploadImage } from "@/lib/admin-api";
import type { DateIdea } from "@/types";
import Image from "next/image";

const CATEGORIES = [
  { value: "romantic", label: "Lãng mạn" },
  { value: "adventure", label: "Phiêu lưu" },
  { value: "food", label: "Ẩm thực" },
  { value: "relax", label: "Thư giãn" },
  { value: "creative", label: "Sáng tạo" },
  { value: "general", label: "Khác" },
];

export default function AdminDateIdeasPage() {
  const [ideas, setIdeas] = useState<DateIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [image, setImage] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [duration, setDuration] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadIdeas() {
    try {
      const data = await fetchDateIdeas();
      setIdeas(data as DateIdea[]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadIdeas(); }, []);

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategory("general");
    setImage("");
    setEstimatedCost("");
    setDuration("");
    setEditingId(null);
    setShowForm(false);
    setError("");
  }

  function startEdit(idea: DateIdea) {
    setEditingId(idea.id);
    setTitle(idea.title);
    setDescription(idea.description);
    setCategory(idea.category);
    setImage(idea.image);
    setEstimatedCost(idea.estimatedCost);
    setDuration(idea.duration);
    setShowForm(true);
  }

  async function handleUploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const result = await uploadImage(file);
      setImage(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload thất bại");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!title) { setError("Tiêu đề là bắt buộc"); return; }
    setSaving(true);
    setError("");
    try {
      const data = { title, description, category, image, estimatedCost, duration, order: ideas.length };
      if (editingId) {
        await updateDateIdea(editingId, data);
      } else {
        await createDateIdea(data);
      }
      resetForm();
      loadIdeas();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi lưu");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Xóa ý tưởng này?")) return;
    try {
      await deleteDateIdea(id);
      setIdeas((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi xóa");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ý tưởng hẹn hò</h1>
        <button
          onClick={() => { showForm ? resetForm() : setShowForm(true); }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          {showForm ? "Đóng" : "+ Thêm ý tưởng"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tiêu đề *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="VD: Dã ngoại công viên" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Danh mục</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none">
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Mô tả chi tiết ý tưởng hẹn hò..." className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Chi phí ước tính</label>
              <input type="text" value={estimatedCost} onChange={(e) => setEstimatedCost(e.target.value)} placeholder="VD: 200k - 500k" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Thời gian</label>
              <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="VD: 2-3 tiếng" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ảnh minh họa</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUploadImage} className="hidden" />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors disabled:opacity-50">
              {uploading ? "Đang upload..." : "Chọn ảnh để upload"}
            </button>
            {image && (
              <div className="mt-2 relative w-32 h-20 rounded-lg overflow-hidden">
                <Image src={image} alt="Preview" fill className="object-cover" />
              </div>
            )}
          </div>

          <button onClick={handleSave} disabled={saving} className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50">
            {saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Thêm ý tưởng"}
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-16" />
          ))}
        </div>
      ) : !ideas.length ? (
        <p className="text-gray-500 text-center py-12">Chưa có ý tưởng nào.</p>
      ) : (
        <div className="space-y-3">
          {ideas.map((idea) => (
            <div key={idea.id} className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm">
              {idea.image ? (
                <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={idea.image} alt={idea.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-lg bg-primary-50 flex items-center justify-center text-xl flex-shrink-0">
                  &#128149;
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{idea.title}</h3>
                <div className="flex gap-2 mt-0.5">
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {CATEGORIES.find((c) => c.value === idea.category)?.label || idea.category}
                  </span>
                  {idea.estimatedCost && <span className="text-xs text-gray-400">{idea.estimatedCost}</span>}
                  {idea.duration && <span className="text-xs text-gray-400">{idea.duration}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(idea)} className="text-sm text-primary-600 hover:underline">Sửa</button>
                <button onClick={() => handleDelete(idea.id)} className="text-sm text-red-500 hover:underline">Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
