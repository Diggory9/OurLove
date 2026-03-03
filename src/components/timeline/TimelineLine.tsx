"use client";

import { useState } from "react";
import Image from "next/image";
import type { TimelineEvent } from "@/types";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { formatDateLong } from "@/lib/utils";

interface TimelineLineProps {
  events: TimelineEvent[];
}

export default function TimelineLine({ events }: TimelineLineProps) {
  const [filterYear, setFilterYear] = useState<string>("all");

  const years = [...new Set(events.map((e) => new Date(e.date).getFullYear().toString()))].sort(
    (a, b) => Number(b) - Number(a)
  );

  const filtered =
    filterYear === "all"
      ? events
      : events.filter((e) => new Date(e.date).getFullYear().toString() === filterYear);

  return (
    <div>
      {/* Year filter */}
      {years.length > 1 && (
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          <button
            onClick={() => setFilterYear("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filterYear === "all"
                ? "bg-primary-600 text-white"
                : "bg-primary-100 text-primary-700 hover:bg-primary-200"
            }`}
          >
            Tất cả
          </button>
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setFilterYear(year)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterYear === year
                  ? "bg-primary-600 text-white"
                  : "bg-primary-100 text-primary-700 hover:bg-primary-200"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary-200 -translate-x-1/2 hidden md:block" />
        {/* Mobile left line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary-200 md:hidden" />

        <div className="space-y-12">
          {filtered.map((event, i) => {
            const isLeft = i % 2 === 0;

            return (
              <AnimatedSection
                key={event.id}
                delay={i * 0.1}
                direction={isLeft ? "left" : "right"}
              >
                <div className="relative flex items-start gap-4 md:gap-0">
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-primary-600 border-4 border-primary-100 -translate-x-1/2 z-10 mt-1" />

                  {/* Content */}
                  <div
                    className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${
                      isLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
                    }`}
                  >
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary-100">
                      <div className="flex items-center gap-2 mb-2">
                        {event.icon && (
                          <span className="text-lg">{event.icon}</span>
                        )}
                        <span className="text-xs font-medium text-primary-500">
                          {formatDateLong(event.date)}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                          {event.description}
                        </p>
                      )}
                      {event.image && (
                        <div className="mt-4 relative rounded-xl overflow-hidden aspect-video">
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </div>
  );
}
