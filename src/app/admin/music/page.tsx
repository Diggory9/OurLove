"use client";

import { useEffect, useState, useRef } from "react";
import { fetchMusic, createMusic, updateMusicTrack, deleteMusicTrack, uploadAudio } from "@/lib/admin-api";
import type { Music } from "@/types";

export default function AdminMusicPage() {
  const [tracks, setTracks] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadTracks() {
    try {
      const data = await fetchMusic();
      setTracks(data as Music[]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTracks(); }, []);

  async function handleUploadAudio(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const result = await uploadAudio(file);
      setUrl(result.url);
      if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload thất bại");
    } finally {
      setUploading(false);
    }
  }

  async function handleCreate() {
    if (!title || !url) { setError("Tên và URL là bắt buộc"); return; }
    setSaving(true);
    setError("");
    try {
      await createMusic({ title, artist, url, order: tracks.length });
      setTitle(""); setArtist(""); setUrl(""); setShowForm(false);
      loadTracks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tạo bài hát");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(track: Music) {
    try {
      await updateMusicTrack(track.id, { active: !track.active });
      setTracks((prev) =>
        prev.map((t) => (t.id === track.id ? { ...t, active: !t.active } : t))
      );
    } catch {
      // ignore
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Xóa bài hát này?")) return;
    try {
      await deleteMusicTrack(id);
      setTracks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi xóa");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Music Playlist</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          {showForm ? "Đóng" : "+ Thêm bài hát"}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tên bài hát *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nghệ sĩ</label>
              <input type="text" value={artist} onChange={(e) => setArtist(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">URL nhạc *</label>
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL hoặc upload" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none" />
            <input ref={fileRef} type="file" accept="audio/*" onChange={handleUploadAudio} className="hidden" />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50">
              {uploading ? "Đang upload..." : "Upload file nhạc"}
            </button>
          </div>

          <button onClick={handleCreate} disabled={saving} className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50">
            {saving ? "Đang lưu..." : "Thêm bài hát"}
          </button>
        </div>
      )}

      {/* Track list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-16" />
          ))}
        </div>
      ) : !tracks.length ? (
        <p className="text-gray-500 text-center py-12">Chưa có bài hát nào.</p>
      ) : (
        <div className="space-y-3">
          {tracks.map((track) => (
            <div
              key={track.id}
              className={`bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm ${
                !track.active ? "opacity-50" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
                &#9835;
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{track.title}</h3>
                {track.artist && (
                  <p className="text-sm text-gray-500">{track.artist}</p>
                )}
              </div>
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => handleToggleActive(track)}
                  className={`text-xs px-2 py-1 rounded ${
                    track.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {track.active ? "Active" : "Inactive"}
                </button>
                <button
                  onClick={() => handleDelete(track.id)}
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
