"use client";

import { useEffect, useState } from "react";
import { loveQuotes } from "@/data/love-quotes";

function getDailyQuote(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return loveQuotes[dayOfYear % loveQuotes.length];
}

export default function DailyQuote() {
  const [quote, setQuote] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setQuote(getDailyQuote());
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!quote) return null;

  return (
    <section className="py-16 bg-gradient-to-b from-primary-50/50 to-transparent">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div
          className={`transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="text-primary-400 text-4xl mb-4">&hearts;</div>
          <blockquote className="text-xl md:text-2xl font-medium text-gray-700 leading-relaxed font-[var(--font-script)] italic">
            &ldquo;{quote}&rdquo;
          </blockquote>
          <p className="mt-4 text-sm text-primary-400 font-medium">
            Lời yêu thương mỗi ngày
          </p>
        </div>
      </div>
    </section>
  );
}
