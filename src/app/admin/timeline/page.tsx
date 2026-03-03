"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchTimelineEvents, deleteTimelineEvent } from "@/lib/admin-api";
import type { TimelineEvent } from "@/types";
import { formatDate } from "@/lib/utils";

export default function AdminTimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadEvents() {
    try {
      const data = await fetchTimelineEvents();
      setEvents(data as TimelineEvent[]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadEvents(); }, []);

  async function handleDelete(slug: string) {
    if (!confirm("Xóa sự kiện này?")) return;
    try {
      await deleteTimelineEvent(slug);
      setEvents((prev) => prev.filter((e) => e.slug !== slug));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi xóa");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Timeline</h1>
        <Link
          href="/admin/timeline/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          + Thêm sự kiện
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-16" />
          ))}
        </div>
      ) : !events.length ? (
        <p className="text-gray-500 text-center py-12">Chưa có sự kiện nào.</p>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm"
            >
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-lg flex-shrink-0">
                {event.icon || "&#10084;"}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/timeline/${event.slug}`}
                  className="text-sm text-primary-600 hover:underline"
                >
                  Sửa
                </Link>
                <button
                  onClick={() => handleDelete(event.slug)}
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
