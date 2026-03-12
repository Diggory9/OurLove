import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import SearchBox from "@/components/search/SearchBox";

export const metadata: Metadata = {
  title: "Tìm kiếm",
  description: "Tìm kiếm ảnh, sự kiện và kỷ niệm",
};

export default function SearchPage() {
  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          title="Tìm kiếm"
          subtitle="Tìm lại những kỷ niệm đẹp"
        />
        <SearchBox />
      </Container>
    </section>
  );
}
