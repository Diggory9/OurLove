import type { Metadata } from "next";
import { getAllPlaces, getSiteConfig } from "@/lib/data";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import MapView from "@/components/map/MapView";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return {
    title: "Bản đồ kỷ niệm",
    description: `Những nơi ${site.person1Name} & ${site.person2Name} đã cùng nhau đi qua`,
    openGraph: {
      title: `Bản đồ kỷ niệm | ${site.siteName}`,
      description: `Những nơi ${site.person1Name} & ${site.person2Name} đã cùng nhau đi qua`,
      locale: "vi_VN",
    },
  };
}

export default async function MapPage() {
  const places = await getAllPlaces();

  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          title="Bản đồ kỷ niệm"
          subtitle="Những nơi chúng mình đã cùng nhau đi qua"
        />
        <MapView places={places} />
        {places.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {places.map((place) => (
              <div
                key={place.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                {place.image && (
                  <img
                    src={place.image}
                    alt={place.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}
                <h3 className="font-semibold text-gray-900">{place.title}</h3>
                {place.date && (
                  <p className="text-sm text-primary-500 mt-1">
                    {new Date(place.date).toLocaleDateString("vi-VN")}
                  </p>
                )}
                {place.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{place.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
