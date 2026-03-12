"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchSpecialDays, deleteSpecialDay } from "@/lib/admin-api";
import type { SpecialDay } from "@/types";
import { formatDate } from "@/lib/utils";

const typeLabels: Record<string, string> = {
  birthday: "Sinh nhật",
  anniversary: "Kỷ niệm",
  valentine: "Valentine",
  custom: "Đặc biệt",
};

export default function AdminSpecialDaysPage() {
  const [days, setDays] = useState<SpecialDay[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadDays() {
    try {
      const data = await fetchSpecialDays();
      setDays(data as SpecialDay[]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadDays(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Xóa ngày đặc biệt này?")) return;
    try {
      await deleteSpecialDay(id);
      setDays((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi xóa");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ngày đặc biệt</h1>
        <Link
          href="/admin/special-days/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          + Thêm ngày
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-16" />
          ))}
        </div>
      ) : !days.length ? (
        <p className="text-gray-500 text-center py-12">Chưa có ngày đặc biệt nào.</p>
      ) : (
        <div className="space-y-3">
          {days.map((day) => (
            <div
              key={day.id}
              className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm"
            >
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-lg flex-shrink-0">
                {day.icon || "&#128197;"}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{day.title}</h3>
                <p className="text-sm text-gray-500">
                  {formatDate(day.date)} · {typeLabels[day.type] || day.type}
                  {day.recurring && " · Hàng năm"}
                </p>
              </div>
              <button
                onClick={() => handleDelete(day.id)}
                className="text-sm text-red-500 hover:underline"
              >
                Xóa
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
