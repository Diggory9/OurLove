import type { Metadata } from "next";
import Image from "next/image";
import { getSiteConfig } from "@/lib/data";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/shared/AnimatedSection";
import LoveDayCounter from "@/components/home/LoveDayCounter";

export const metadata: Metadata = {
  title: "Về chúng tôi",
  description: "Câu chuyện tình yêu của chúng mình",
};

export default async function AboutPage() {
  const site = await getSiteConfig();

  return (
    <>
      <section className="py-20">
        <Container>
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-[var(--font-script)] text-4xl sm:text-5xl text-gray-900 mb-6">
                {site.person1Name} & {site.person2Name}
              </h1>

              {site.couplePhoto && (
                <div className="relative w-64 h-64 mx-auto mb-8 rounded-full overflow-hidden border-4 border-primary-200 shadow-xl">
                  <Image
                    src={site.couplePhoto}
                    alt={`${site.person1Name} & ${site.person2Name}`}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                {site.heroMessage}
              </p>

              <p className="text-gray-500">
                Trang web này là nơi chúng mình lưu giữ những kỷ niệm đẹp nhất
                - những bức ảnh, những mốc thời gian, và những khoảnh khắc
                không bao giờ quên. Mỗi ngày bên nhau đều là một điều tuyệt vời.
              </p>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      <LoveDayCounter
        startDate={site.startDate}
        person1={site.person1Name}
        person2={site.person2Name}
      />
    </>
  );
}
