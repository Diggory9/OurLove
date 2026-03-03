"use client";

import { useState, useEffect } from "react";
import { getNextAnniversary, calculateCountdown } from "@/lib/utils";

interface AnniversaryCountdownProps {
  startDate: string;
}

export default function AnniversaryCountdown({ startDate }: AnniversaryCountdownProps) {
  const nextAnniversary = getNextAnniversary(startDate);
  const [countdown, setCountdown] = useState(calculateCountdown(nextAnniversary));

  const start = new Date(startDate);
  const yearsNext = nextAnniversary.getFullYear() - start.getFullYear();

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateCountdown(nextAnniversary));
    }, 1000);
    return () => clearInterval(interval);
  }, [nextAnniversary]);

  const blocks = [
    { value: countdown.days, label: "Ngày" },
    { value: countdown.hours, label: "Giờ" },
    { value: countdown.minutes, label: "Phút" },
    { value: countdown.seconds, label: "Giây" },
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-[var(--font-script)] text-3xl sm:text-4xl mb-3">
          Đếm ngược kỷ niệm {yearsNext} năm
        </h2>
        <p className="text-primary-200 mb-10">
          {nextAnniversary.toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {blocks.map((block) => (
            <div
              key={block.label}
              className="bg-white/10 backdrop-blur rounded-2xl p-6"
            >
              <div className="text-4xl sm:text-5xl font-extrabold">
                {String(block.value).padStart(2, "0")}
              </div>
              <div className="mt-2 text-sm font-medium text-primary-200 uppercase tracking-wider">
                {block.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
