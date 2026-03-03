import { getSiteConfig } from "@/lib/data";

export default async function Footer() {
  const site = await getSiteConfig();

  return (
    <footer className="bg-primary-900 text-white py-12">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-16 text-center">
        <p className="font-[var(--font-script)] text-2xl text-primary-200 mb-2">
          {site.person1Name} & {site.person2Name}
        </p>
        <p className="text-primary-300 text-sm">{site.footerMessage}</p>
        <div className="mt-6 h-px bg-primary-800 max-w-xs mx-auto" />
        <p className="mt-4 text-primary-400 text-xs">
          {site.siteName}
        </p>
      </div>
    </footer>
  );
}
