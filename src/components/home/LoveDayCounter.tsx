"use client";

import { useState, useEffect } from "react";
import { calculateDaysTogether } from "@/lib/utils";

interface LoveDayCounterProps {
  startDate: string;
  person1: string;
  person2: string;
}

export default function LoveDayCounter({ startDate, person1, person2 }: LoveDayCounterProps) {
  const [time, setTime] = useState(calculateDaysTogether(startDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(calculateDaysTogether(startDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  const blocks = [
    { value: time.days, label: "Ngày" },
    { value: time.hours, label: "Giờ" },
    { value: time.minutes, label: "Phút" },
    { value: time.seconds, label: "Giây" },
  ];

  return (
    <section id="counter" className="py-20 bg-primary-50">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="text-primary-600 font-medium mb-2">
          {person1} & {person2}
        </p>
        <h2 className="font-[var(--font-script)] text-3xl sm:text-4xl text-gray-900 mb-10">
          Đã bên nhau
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {blocks.map((block) => (
            <div
              key={block.label}
              className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-lg border border-primary-100"
            >
              <div className="text-4xl sm:text-5xl font-extrabold text-primary-600">
                {String(block.value).padStart(block.label === "Ngày" ? 1 : 2, "0")}
              </div>
              <div className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                {block.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
