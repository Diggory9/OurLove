import Link from "next/link";
import type { TimelineEvent } from "@/types";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { formatDate } from "@/lib/utils";

interface TimelinePreviewProps {
  events: TimelineEvent[];
}

export default function TimelinePreview({ events }: TimelinePreviewProps) {
  if (!events.length) return null;

  return (
    <section className="py-20 bg-primary-50">
      <Container>
        <SectionHeading
          title="Dòng thời gian"
          subtitle="Những mốc quan trọng trong tình yêu"
        />

        <div className="max-w-2xl mx-auto space-y-6">
          {events.map((event, i) => (
            <AnimatedSection
              key={event.id}
              delay={i * 0.15}
              direction={i % 2 === 0 ? "left" : "right"}
            >
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center text-lg">
                  {event.icon || "&#10084;"}
                </div>
                <div className="flex-1 bg-white rounded-xl p-5 shadow-sm border border-primary-100">
                  <p className="text-xs font-medium text-primary-500 mb-1">
                    {formatDate(event.date)}
                  </p>
                  <h3 className="font-bold text-gray-900">{event.title}</h3>
                  {event.description && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/dong-thoi-gian"
            className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            Xem đầy đủ
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </Container>
    </section>
  );
}
