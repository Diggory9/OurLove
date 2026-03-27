"use client";

import { useEffect, useState } from "react";
import type { LoveReason } from "@/types";

interface DailyLoveReasonProps {
  reason: LoveReason | null;
}

export default function DailyLoveReason({ reason: initialReason }: DailyLoveReasonProps) {
  const [reason, setReason] = useState(initialReason);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!initialReason) {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      fetch(`${API_URL}/api/love-reasons/random`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            setReason(json.data);
          }
        })
        .catch(() => {});
    }
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, [initialReason]);

  if (!reason) return null;

  return (
    <section className="py-14">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div
          className={`transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 px-4 py-1.5 rounded-full text-xs font-semibold mb-4">
            <span dangerouslySetInnerHTML={{ __html: "&#128149;" }} />
            Lý do yêu em
          </div>
          <blockquote className="text-xl md:text-2xl font-medium text-gray-700 leading-relaxed font-[var(--font-script)] italic">
            &ldquo;{reason.content}&rdquo;
          </blockquote>
          {reason.author && (
            <p className="mt-3 text-sm text-primary-400 font-medium">
              &mdash; {reason.author}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
