"use client";

import type { SiteConfig } from "@/types";
import HeartAnimation from "@/components/shared/HeartAnimation";
import Image from "next/image";

interface HeroSectionProps {
  site: SiteConfig;
}

export default function HeroSection({ site }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary-900 to-primary-800">
      {/* Background image */}
      {site.couplePhoto && (
        <Image
          src={site.couplePhoto}
          alt="Couple photo"
          fill
          className="object-cover opacity-30"
          priority
        />
      )}

      <HeartAnimation />

      <div className="relative z-10 text-center px-6">
        <p className="text-primary-200 text-lg mb-4 tracking-widest uppercase">
          Chuyện tình yêu của
        </p>
        <h1 className="font-[var(--font-script)] text-5xl sm:text-7xl lg:text-8xl text-white mb-6">
          {site.person1Name} & {site.person2Name}
        </h1>
        <p className="text-primary-100 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed">
          {site.heroMessage}
        </p>

        <div className="mt-10">
          <a
            href="#counter"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur text-white px-8 py-4 rounded-full hover:bg-white/30 transition-all"
          >
            <span>Khám phá</span>
            <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
