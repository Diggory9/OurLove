import Link from "next/link";
import { getSiteConfig } from "@/lib/data";

const footerLinks = [
  { href: "/thu-vien", label: "Thư viện ảnh" },
  { href: "/dong-thoi-gian", label: "Dòng thời gian" },
  { href: "/loi-nhan", label: "Lời nhắn" },
  { href: "/ke-hoach", label: "Kế hoạch" },
  { href: "/ngay-dac-biet", label: "Ngày đặc biệt" },
  { href: "/ve-chung-toi", label: "Về chúng tôi" },
];

export default async function Footer() {
  const site = await getSiteConfig();

  return (
    <footer className="bg-primary-900 text-white py-12">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-16 text-center">
        <p className="font-[var(--font-script)] text-2xl text-primary-200 mb-2">
          {site.person1Name} & {site.person2Name}
        </p>
        <p className="text-primary-300 text-sm">{site.footerMessage}</p>

        <nav className="mt-6 flex flex-wrap justify-center gap-4">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-primary-400 hover:text-primary-200 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 h-px bg-primary-800 max-w-xs mx-auto" />
        <p className="mt-4 text-primary-400 text-xs">
          {site.siteName}
        </p>
      </div>
    </footer>
  );
}
