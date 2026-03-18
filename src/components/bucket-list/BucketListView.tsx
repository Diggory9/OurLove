"use client";

import { useState } from "react";
import Image from "next/image";
import type { BucketItem } from "@/types";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { formatDate } from "@/lib/utils";
import { useClientFallback } from "@/hooks/useClientFallback";

interface BucketListViewProps {
  completed: BucketItem[];
  pending: BucketItem[];
}

export default function BucketListView({ completed: initialCompleted, pending: initialPending }: BucketListViewProps) {
  const allInitial = [...initialPending, ...initialCompleted];
  const { data: allItems, loading } = useClientFallback(allInitial, "/api/bucket-list");

  const completed = allItems.filter((item) => item.completed);
  const pending = allItems.filter((item) => !item.completed);

  const [tab, setTab] = useState<"all" | "pending" | "completed">("all");

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  const items =
    tab === "pending" ? pending : tab === "completed" ? completed : [...pending, ...completed];

  const categories = [...new Set(items.map((item) => item.category).filter(Boolean))];

  return (
    <div>
      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-10 flex-wrap">
        {(["all", "pending", "completed"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === t
                ? "bg-primary-600 text-white"
                : "bg-primary-100 text-primary-700 hover:bg-primary-200"
            }`}
          >
            {t === "all" ? "Tất cả" : t === "pending" ? "Chưa làm" : "Đã làm"}
          </button>
        ))}
      </div>

      {/* Items grouped by category */}
      {categories.length > 0 ? (
        <div className="space-y-10">
          {categories.map((category) => {
            const categoryItems = items.filter((item) => item.category === category);
            if (!categoryItems.length) return null;
            return (
              <div key={category}>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-0.5 bg-primary-400" />
                  {category}
                </h3>
                <BucketItemGrid items={categoryItems} />
              </div>
            );
          })}
          {/* Items without category */}
          {items.filter((item) => !item.category).length > 0 && (
            <div>
              {categories.length > 0 && (
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-0.5 bg-primary-400" />
                  Khác
                </h3>
              )}
              <BucketItemGrid items={items.filter((item) => !item.category)} />
            </div>
          )}
        </div>
      ) : (
        <BucketItemGrid items={items} />
      )}
    </div>
  );
}

function BucketItemGrid({ items }: { items: BucketItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, i) => (
        <AnimatedSection key={item.id} delay={i * 0.05}>
          <div
            className={`p-5 rounded-2xl border transition-all ${
              item.completed
                ? "bg-green-50 border-green-200"
                : "bg-white border-primary-100 hover:border-primary-200 hover:shadow-sm"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  item.completed
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-300"
                }`}
              >
                {item.completed && (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className={`font-medium ${
                    item.completed ? "text-green-800 line-through" : "text-gray-900"
                  }`}
                >
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                )}
                {item.completed && item.completedDate && (
                  <p className="text-xs text-green-600 mt-2">
                    ✅ Hoàn thành {formatDate(item.completedDate)}
                  </p>
                )}
              </div>
            </div>

            {item.completedImage && (
              <div className="mt-3 relative rounded-xl overflow-hidden aspect-video">
                <Image
                  src={item.completedImage}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )}
          </div>
        </AnimatedSection>
      ))}
    </div>
  );
}
