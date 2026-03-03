import type { Metadata } from "next";
import { getAllTimelineEvents } from "@/lib/data";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import TimelineLine from "@/components/timeline/TimelineLine";

export const metadata: Metadata = {
  title: "Dòng thời gian",
  description: "Những mốc quan trọng trong tình yêu của chúng mình",
};

export default async function TimelinePage() {
  const events = await getAllTimelineEvents();

  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          title="Dòng thời gian tình yêu"
          subtitle="Mỗi ngày bên nhau đều là một trang đẹp trong cuốn sách tình yêu"
        />
        <TimelineLine events={events} />

        {!events.length && (
          <p className="text-center text-gray-500 py-20">
            Chưa có sự kiện nào. Hãy thêm qua trang quản trị!
          </p>
        )}
      </Container>
    </section>
  );
}
