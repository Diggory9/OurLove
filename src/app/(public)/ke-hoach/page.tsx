import type { Metadata } from "next";
import { getAllBucketItems, getSiteConfig } from "@/lib/data";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import BucketListView from "@/components/bucket-list/BucketListView";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return {
    title: "Kế hoạch cùng nhau",
    description: `Những điều ${site.person1Name} & ${site.person2Name} muốn làm cùng nhau`,
    openGraph: {
      title: `Kế hoạch cùng nhau | ${site.siteName}`,
      description: `Bucket list của ${site.person1Name} & ${site.person2Name}`,
      locale: "vi_VN",
    },
  };
}

export default async function BucketListPage() {
  const [items, site] = await Promise.all([
    getAllBucketItems(),
    getSiteConfig(),
  ]);

  const completed = items.filter((item) => item.completed);
  const pending = items.filter((item) => !item.completed);

  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          title="Kế hoạch cùng nhau"
          subtitle={`Những điều ${site.person1Name} & ${site.person2Name} muốn trải nghiệm`}
        />

        {items.length > 0 && (
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-4 bg-primary-50 px-6 py-3 rounded-full">
              <span className="text-sm text-gray-600">
                Đã hoàn thành{" "}
                <strong className="text-primary-600">
                  {completed.length}/{items.length}
                </strong>
              </span>
              <div className="w-32 h-2 bg-primary-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all"
                  style={{
                    width: `${(completed.length / items.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <BucketListView completed={completed} pending={pending} />

        {!items.length && (
          <p className="text-center text-gray-500 py-20">
            Chưa có kế hoạch nào. Hãy thêm qua trang quản trị!
          </p>
        )}
      </Container>
    </section>
  );
}
