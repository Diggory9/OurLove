"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import type { DateIdea } from "@/types";
import { cn } from "@/lib/utils";

interface DateIdeaRandomProps {
  ideas: DateIdea[];
}

const categoryColors: Record<string, string> = {
  "romantic": "bg-pink-100 text-pink-700",
  "adventure": "bg-orange-100 text-orange-700",
  "food": "bg-amber-100 text-amber-700",
  "relax": "bg-blue-100 text-blue-700",
  "creative": "bg-purple-100 text-purple-700",
  "general": "bg-gray-100 text-gray-700",
};

const categoryLabels: Record<string, string> = {
  "romantic": "Lãng mạn",
  "adventure": "Phiêu lưu",
  "food": "Ẩm thực",
  "relax": "Thư giãn",
  "creative": "Sáng tạo",
  "general": "Khác",
};

export default function DateIdeaRandom({ ideas }: DateIdeaRandomProps) {
  const [currentIdea, setCurrentIdea] = useState<DateIdea | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const filteredIdeas = filter === "all"
    ? ideas
    : ideas.filter((i) => i.category === filter);

  const categories = [...new Set(ideas.map((i) => i.category))];

  const handleSpin = useCallback(() => {
    if (filteredIdeas.length === 0 || isSpinning) return;

    setIsSpinning(true);

    // Simulate spinning effect
    let count = 0;
    const maxSpins = 15;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * filteredIdeas.length);
      setCurrentIdea(filteredIdeas[randomIndex]);
      count++;

      if (count >= maxSpins) {
        clearInterval(interval);
        const finalIndex = Math.floor(Math.random() * filteredIdeas.length);
        setCurrentIdea(filteredIdeas[finalIndex]);
        setIsSpinning(false);
      }
    }, 100 + count * 20);
  }, [filteredIdeas, isSpinning]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            filter === "all"
              ? "bg-primary-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          Tất cả ({ideas.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              filter === cat
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {categoryLabels[cat] || cat} ({ideas.filter((i) => i.category === cat).length})
          </button>
        ))}
      </div>

      {/* Spin button */}
      <div className="text-center mb-8">
        <button
          onClick={handleSpin}
          disabled={isSpinning || filteredIdeas.length === 0}
          className={cn(
            "relative px-10 py-4 rounded-2xl text-lg font-bold transition-all",
            isSpinning
              ? "bg-primary-400 text-white scale-95"
              : "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 hover:scale-105 shadow-lg hover:shadow-xl"
          )}
        >
          {isSpinning ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Đang quay...
            </span>
          ) : (
            "Gợi ý hẹn hò ngẫu nhiên!"
          )}
        </button>
      </div>

      {/* Result card */}
      {currentIdea && (
        <div
          className={cn(
            "bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300",
            isSpinning ? "opacity-60 scale-[0.98]" : "opacity-100 scale-100"
          )}
        >
          {currentIdea.image && (
            <div className="relative h-56 w-full">
              <Image
                src={currentIdea.image}
                alt={currentIdea.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold",
                  categoryColors[currentIdea.category] || categoryColors.general
                )}
              >
                {categoryLabels[currentIdea.category] || currentIdea.category}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {currentIdea.title}
            </h3>
            {currentIdea.description && (
              <p className="text-gray-600 text-sm mb-4">
                {currentIdea.description}
              </p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {currentIdea.estimatedCost && (
                <span className="flex items-center gap-1">
                  <span dangerouslySetInnerHTML={{ __html: "&#128176;" }} />
                  {currentIdea.estimatedCost}
                </span>
              )}
              {currentIdea.duration && (
                <span className="flex items-center gap-1">
                  <span dangerouslySetInnerHTML={{ __html: "&#9200;" }} />
                  {currentIdea.duration}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* All ideas grid */}
      {!currentIdea && filteredIdeas.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredIdeas.map((idea) => (
            <div
              key={idea.id}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                {idea.image ? (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={idea.image} alt={idea.title} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-primary-50 flex items-center justify-center text-2xl flex-shrink-0">
                    <span dangerouslySetInnerHTML={{ __html: "&#128149;" }} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span
                    className={cn(
                      "inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-1",
                      categoryColors[idea.category] || categoryColors.general
                    )}
                  >
                    {categoryLabels[idea.category] || idea.category}
                  </span>
                  <h4 className="font-bold text-gray-900 text-sm">{idea.title}</h4>
                  {idea.description && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                      {idea.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
