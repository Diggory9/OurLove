import Link from "next/link";
import type { SpecialDay } from "@/types";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { formatDate } from "@/lib/utils";

interface UpcomingDaysProps {
  days: SpecialDay[];
}

const typeLabels: Record<string, string> = {
  birthday: "Sinh nhật",
  anniversary: "Kỷ niệm",
  valentine: "Valentine",
  custom: "Đặc biệt",
};

export default function UpcomingDays({ days }: UpcomingDaysProps) {
  if (!days.length) return null;

  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          title="Sắp tới"
          subtitle="Những ngày đặc biệt sắp đến"
        />

        <div className="max-w-2xl mx-auto space-y-4">
          {days.map((day, i) => {
            const daysUntil = day.nextOccurrence
              ? Math.ceil(
                  (new Date(day.nextOccurrence).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24)
                )
              : 0;

            return (
              <AnimatedSection key={day.id} delay={i * 0.1}>
                <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-primary-100">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-2xl flex-shrink-0">
                    {day.icon || "📅"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900">{day.title}</h3>
                    <p className="text-xs text-gray-500">
                      {typeLabels[day.type] || "Đặc biệt"} · {formatDate(day.date)}
                    </p>
                  </div>
                  <div className="text-center flex-shrink-0">
                    {daysUntil <= 0 ? (
                      <span className="text-primary-600 font-bold text-sm">Hôm nay!</span>
                    ) : (
                      <>
                        <span className="text-2xl font-bold text-primary-600">{daysUntil}</span>
                        <p className="text-xs text-gray-400">ngày</p>
                      </>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/ngay-dac-biet"
            className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            Xem tất cả
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </Container>
    </section>
  );
}
