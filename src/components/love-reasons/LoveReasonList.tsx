"use client";

import { useState, useCallback } from "react";
import type { LoveReason } from "@/types";
import AnimatedSection from "@/components/shared/AnimatedSection";

interface LoveReasonListProps {
  reasons: LoveReason[];
}

export default function LoveReasonList({ reasons }: LoveReasonListProps) {
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRandom = useCallback(() => {
    if (isSpinning || reasons.length === 0) return;
    setIsSpinning(true);

    let count = 0;
    const maxSpins = 12;
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * reasons.length);
      setHighlightId(reasons[idx].id);
      count++;
      if (count >= maxSpins) {
        clearInterval(interval);
        const finalIdx = Math.floor(Math.random() * reasons.length);
        setHighlightId(reasons[finalIdx].id);
        setIsSpinning(false);
        // Scroll to highlighted
        document.getElementById(`reason-${reasons[finalIdx].id}`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 80 + count * 15);
  }, [isSpinning, reasons]);

  return (
    <div>
      {/* Random button */}
      <div className="text-center mb-10">
        <button
          onClick={handleRandom}
          disabled={isSpinning}
          className="px-8 py-3 bg-gradient-to-r from-pink-500 to-primary-500 text-white font-bold rounded-2xl hover:from-pink-600 hover:to-primary-600 transition-all hover:scale-105 shadow-lg disabled:opacity-70 disabled:scale-100"
        >
          {isSpinning ? "Đang chọn..." : "Xem lý do ngẫu nhiên"}
        </button>
      </div>

      {/* Reasons grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {reasons.map((reason, i) => (
          <AnimatedSection key={reason.id} delay={Math.min(i * 0.05, 0.5)}>
            <div
              id={`reason-${reason.id}`}
              className={`rounded-2xl p-5 border-2 transition-all duration-300 ${
                highlightId === reason.id
                  ? "bg-primary-50 border-primary-400 shadow-lg scale-[1.02]"
                  : "bg-white border-gray-100 shadow-sm hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0 mt-0.5" dangerouslySetInnerHTML={{ __html: "&#128149;" }} />
                <div>
                  <p className="text-gray-800 font-medium text-sm leading-relaxed">
                    {reason.content}
                  </p>
                  {reason.author && (
                    <p className="text-xs text-primary-400 mt-2 font-semibold">
                      &mdash; {reason.author}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>

      {/* Total count */}
      <div className="text-center mt-10">
        <span className="text-sm text-gray-400">
          Tổng cộng {reasons.length} lý do yêu em
        </span>
      </div>
    </div>
  );
}
