"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { OnThisDayData } from "@/types";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/shared/AnimatedSection";

interface OnThisDayProps {
  data: OnThisDayData | null;
}

export default function OnThisDay({ data: initialData }: OnThisDayProps) {
  const [data, setData] = useState(initialData);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Client-side fallback
    if (!initialData || !initialData.hasMemories) {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      fetch(`${API_URL}/api/on-this-day`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data?.hasMemories) {
            setData(json.data);
          }
        })
        .catch(() => {});
    }
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, [initialData]);

  if (!data || !data.hasMemories) return null;

  const totalMemories =
    data.photos.length + data.events.length + data.letters.length + data.bucketItems.length;

  return (
    <section className="py-16 bg-gradient-to-b from-transparent via-primary-50/30 to-transparent">
      <Container>
        <AnimatedSection>
          <div
            className={`max-w-2xl mx-auto transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-3">
                <span dangerouslySetInnerHTML={{ __html: "&#128197;" }} />
                Ngày này năm trước
              </div>
              <p className="text-gray-500 text-sm">
                {totalMemories} kỷ niệm vào ngày {data.date.day}/{data.date.month}
              </p>
            </div>

            <div className="space-y-4">
              {/* Photos */}
              {data.photos.length > 0 && (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-primary-100">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                    <span dangerouslySetInnerHTML={{ __html: "&#128247;" }} />
                    Ảnh kỷ niệm ({data.photos.length})
                  </h3>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {data.photos.slice(0, 6).map((photo) => (
                      <div
                        key={photo.id}
                        className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0"
                      >
                        <Image
                          src={photo.src}
                          alt={photo.alt || "Ảnh kỷ niệm"}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline events */}
              {data.events.length > 0 &&
                data.events.map((event) => (
                  <Link
                    key={event.id}
                    href={`/dong-thoi-gian/${event.slug}`}
                    className="block bg-white rounded-2xl p-5 shadow-sm border border-primary-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      {event.image && (
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      )}
                      <div>
                        <span className="text-xs text-primary-500 font-semibold">
                          {new Date(event.date).getFullYear()}
                        </span>
                        <h3 className="font-bold text-gray-900 text-sm">
                          {event.icon && (
                            <span className="mr-1">{event.icon}</span>
                          )}
                          {event.title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}

              {/* Letters */}
              {data.letters.length > 0 &&
                data.letters.map((letter) => (
                  <Link
                    key={letter.id}
                    href={`/loi-nhan/${letter.slug}`}
                    className="block bg-white rounded-2xl p-5 shadow-sm border border-primary-100 hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-sm font-semibold text-gray-500 mb-1 flex items-center gap-2">
                      <span dangerouslySetInnerHTML={{ __html: "&#128140;" }} />
                      Lời nhắn
                    </h3>
                    <p className="font-bold text-gray-900 text-sm">{letter.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Từ {letter.author} &bull; {new Date(letter.createdAt).getFullYear()}
                    </p>
                  </Link>
                ))}

              {/* Bucket items */}
              {data.bucketItems.length > 0 &&
                data.bucketItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-primary-100"
                  >
                    <h3 className="text-sm font-semibold text-gray-500 mb-1 flex items-center gap-2">
                      <span dangerouslySetInnerHTML={{ __html: "&#9989;" }} />
                      Kế hoạch đã hoàn thành
                    </h3>
                    <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                  </div>
                ))}
            </div>
          </div>
        </AnimatedSection>
      </Container>
    </section>
  );
}
