"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchLoveLetters, deleteLoveLetter } from "@/lib/admin-api";
import type { LoveLetter } from "@/types";
import { formatDate } from "@/lib/utils";

export default function AdminLoveLettersPage() {
  const [letters, setLetters] = useState<LoveLetter[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadLetters() {
    try {
      const data = await fetchLoveLetters();
      setLetters(data as LoveLetter[]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadLetters(); }, []);

  async function handleDelete(slug: string) {
    if (!confirm("Xóa lời nhắn này?")) return;
    try {
      await deleteLoveLetter(slug);
      setLetters((prev) => prev.filter((l) => l.slug !== slug));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi xóa");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lời nhắn yêu thương</h1>
        <Link
          href="/admin/love-letters/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          + Thêm lời nhắn
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-16" />
          ))}
        </div>
      ) : !letters.length ? (
        <p className="text-gray-500 text-center py-12">Chưa có lời nhắn nào.</p>
      ) : (
        <div className="space-y-3">
          {letters.map((letter) => (
            <div
              key={letter.id}
              className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm"
            >
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-lg flex-shrink-0">
                &#128140;
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{letter.title}</h3>
                <p className="text-sm text-gray-500">
                  {letter.author && `Từ ${letter.author}`}
                  {letter.scheduledAt && ` · Hẹn: ${formatDate(letter.scheduledAt)}`}
                  {!letter.isVisible && " · Ẩn"}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/love-letters/${letter.slug}`}
                  className="text-sm text-primary-600 hover:underline"
                >
                  Sửa
                </Link>
                <button
                  onClick={() => handleDelete(letter.slug)}
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
