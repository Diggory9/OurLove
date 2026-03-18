"use client";

import Link from "next/link";
import type { LoveLetter } from "@/types";
import AnimatedSection from "@/components/shared/AnimatedSection";
import Card from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import { useClientFallback } from "@/hooks/useClientFallback";

interface LoveLetterListProps {
  letters: LoveLetter[];
}

export default function LoveLetterList({ letters: initialLetters }: LoveLetterListProps) {
  const { data: letters, loading } = useClientFallback(initialLetters, "/api/love-letters");

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!letters.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {letters.map((letter, i) => {
        const isScheduledFuture =
          letter.scheduledAt && new Date(letter.scheduledAt) > new Date();

        return (
          <AnimatedSection key={letter.id} delay={i * 0.1}>
            {isScheduledFuture ? (
              <Card>
                <div className="p-6 text-center">
                  <span className="text-4xl mb-3 block">🔒</span>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    Thư bí mật
                  </h3>
                  <p className="text-sm text-gray-500">
                    Mở vào {formatDate(letter.scheduledAt!)}
                  </p>
                </div>
              </Card>
            ) : (
              <Link href={`/loi-nhan/${letter.slug}`}>
                <Card>
                  <div className="p-6">
                    <span className="text-2xl mb-3 block">💌</span>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                      {letter.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
                      {letter.content}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-xs text-gray-400">
                        {letter.author && `Từ ${letter.author}`}
                      </p>
                      <p className="text-xs text-primary-500 font-medium">
                        Đọc thêm &rarr;
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            )}
          </AnimatedSection>
        );
      })}
    </div>
  );
}
