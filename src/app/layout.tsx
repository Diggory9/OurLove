import type { Metadata } from "next";
import { Be_Vietnam_Pro, Dancing_Script } from "next/font/google";
import "./globals.css";
import { getSiteConfig } from "@/lib/data";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();

  return {
    title: {
      default: `${site.siteName} - ${site.person1Name} & ${site.person2Name}`,
      template: `%s | ${site.siteName}`,
    },
    description: site.heroMessage,
    openGraph: {
      title: site.siteName,
      description: site.heroMessage,
      locale: "vi_VN",
      type: "website",
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.variable} ${dancingScript.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
