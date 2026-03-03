import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MusicPlayer from "@/components/layout/MusicPlayer";
import { getAllMusic } from "@/lib/data";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const playlist = await getAllMusic();

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <MusicPlayer playlist={playlist} />
    </>
  );
}
