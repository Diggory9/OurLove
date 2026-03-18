"use client";

import { useState, useEffect } from "react";
import type { SpecialDay } from "@/types";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { formatDate } from "@/lib/utils";
import { useClientFallback } from "@/hooks/useClientFallback";

interface SpecialDaysListProps {
  days: SpecialDay[];
}

const typeLabels: Record<string, string> = {
  birthday: "Sinh nhật",
  anniversary: "Kỷ niệm",
  valentine: "Valentine",
  custom: "Đặc biệt",
};

const typeColors: Record<string, string> = {
  birthday: "bg-pink-100 text-pink-700 border-pink-200",
  anniversary: "bg-purple-100 text-purple-700 border-purple-200",
  valentine: "bg-red-100 text-red-700 border-red-200",
  custom: "bg-blue-100 text-blue-700 border-blue-200",
};

function calculateDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function SpecialDaysList({ days: initialDays }: SpecialDaysListProps) {
  const { data: days, loading } = useClientFallback(initialDays, "/api/special-days");
  const [, setTick] = useState(0);

  // Update countdown every minute
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!days.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {days.map((day, i) => {
        const daysUntil = day.nextOccurrence
          ? calculateDaysUntil(day.nextOccurrence)
          : calculateDaysUntil(day.date);
        const isToday = daysUntil === 0;
        const isPast = daysUntil < 0;

        return (
          <AnimatedSection key={day.id} delay={i * 0.1}>
            <div
              className={`p-6 rounded-2xl border transition-all ${
                isToday
                  ? "bg-gradient-to-br from-primary-50 to-pink-50 border-primary-300 shadow-md ring-2 ring-primary-200"
                  : "bg-white border-primary-100 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{day.icon || "📅"}</span>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                    typeColors[day.type] || typeColors.custom
                  }`}
                >
                  {typeLabels[day.type] || "Đặc biệt"}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {day.title}
              </h3>

              <p className="text-sm text-gray-500 mb-3">
                {formatDate(day.date)}
                {day.recurring && (
                  <span className="ml-2 text-xs text-gray-400">(hàng năm)</span>
                )}
              </p>

              {day.description && (
                <p className="text-sm text-gray-500 mb-4">{day.description}</p>
              )}

              <div className="pt-3 border-t border-gray-100">
                {isToday ? (
                  <p className="text-center text-primary-600 font-bold text-sm animate-pulse">
                    🎉 Hôm nay!
                  </p>
                ) : isPast && !day.recurring ? (
                  <p className="text-center text-gray-400 text-sm">
                    Đã qua
                  </p>
                ) : (
                  <p className="text-center text-sm">
                    <span className="text-gray-500">Còn </span>
                    <span className="font-bold text-primary-600 text-lg">
                      {daysUntil}
                    </span>
                    <span className="text-gray-500"> ngày</span>
                  </p>
                )}
              </div>
            </div>
          </AnimatedSection>
        );
      })}
    </div>
  );
}
