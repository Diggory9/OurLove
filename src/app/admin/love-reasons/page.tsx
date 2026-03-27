"use client";

import { useEffect, useState } from "react";
import { fetchLoveReasons, createLoveReason, updateLoveReason, deleteLoveReason } from "@/lib/admin-api";
import type { LoveReason } from "@/types";

export default function AdminLoveReasonsPage() {
  const [reasons, setReasons] = useState<LoveReason[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadReasons() {
    try {
      const data = await fetchLoveReasons();
      setReasons(data as LoveReason[]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadReasons(); }, []);

  function resetForm() {
    setContent("");
    setAuthor("");
    setEditingId(null);
    setShowForm(false);
    setError("");
  }

  function startEdit(r: LoveReason) {
    setEditingId(r.id);
    setContent(r.content);
    setAuthor(r.author);
    setShowForm(true);
  }

  async function handleSave() {
    if (!content.trim()) { setError("Nội dung là bắt buộc"); return; }
    setSaving(true);
    setError("");
    try {
      const data = { content: content.trim(), author, order: reasons.length };
      if (editingId) {
        await updateLoveReason(editingId, data);
      } else {
        await createLoveReason(data);
      }
      resetForm();
      loadReasons();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi lưu");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Xóa lý do này?")) return;
    try {
      await deleteLoveReason(id);
      setReasons((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi xóa");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lý do yêu em</h1>
          <p className="text-sm text-gray-500 mt-1">{reasons.length} lý do</p>
        </div>
        <button
          onClick={() => { showForm ? resetForm() : setShowForm(true); }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          {showForm ? "Đóng" : "+ Thêm lý do"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Lý do yêu *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={2}
              placeholder="VD: Vì em luôn biết cách làm anh cười khi anh buồn"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Người viết</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="VD: Anh Nguyên"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Thêm lý do"}
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-14" />
          ))}
        </div>
      ) : !reasons.length ? (
        <p className="text-gray-500 text-center py-12">Chưa có lý do nào. Hãy thêm những lý do yêu em!</p>
      ) : (
        <div className="space-y-2">
          {reasons.map((reason, index) => (
            <div key={reason.id} className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-sm font-bold flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{reason.content}</p>
                {reason.author && (
                  <p className="text-xs text-gray-400 mt-0.5">&mdash; {reason.author}</p>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => startEdit(reason)} className="text-sm text-primary-600 hover:underline">Sửa</button>
                <button onClick={() => handleDelete(reason.id)} className="text-sm text-red-500 hover:underline">Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
