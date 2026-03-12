"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchBucketItems, deleteBucketItem, toggleBucketItem } from "@/lib/admin-api";
import type { BucketItem } from "@/types";

export default function AdminBucketListPage() {
  const [items, setItems] = useState<BucketItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadItems() {
    try {
      const data = await fetchBucketItems();
      setItems(data as BucketItem[]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadItems(); }, []);

  async function handleToggle(id: string) {
    try {
      const updated = (await toggleBucketItem(id)) as BucketItem;
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Xóa mục này?")) return;
    try {
      await deleteBucketItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi xóa");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kế hoạch cùng nhau</h1>
        <Link
          href="/admin/bucket-list/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          + Thêm mục
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-16" />
          ))}
        </div>
      ) : !items.length ? (
        <p className="text-gray-500 text-center py-12">Chưa có kế hoạch nào.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm"
            >
              <button
                onClick={() => handleToggle(item.id)}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  item.completed
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-300 hover:border-primary-400"
                }`}
              >
                {item.completed && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold ${item.completed ? "text-gray-400 line-through" : "text-gray-900"}`}>
                  {item.title}
                </h3>
                {item.category && (
                  <p className="text-xs text-gray-500">{item.category}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(item.id)}
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
