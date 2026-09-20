import type { Language } from "@/data/products";

const BITAPPS_URL = "https://bitappstech.com/";

type SiteCreditProps = {
  lang: Language;
  className?: string;
};

export function SiteCredit({ lang, className }: SiteCreditProps) {
  const link = (
    <a
      href={BITAPPS_URL}
      target="_blank"
      rel="noreferrer"
      className="text-background/70 transition-colors hover:text-gold"
    >
      BitApps Tech
    </a>
  );

  return (
    <span className={className}>
      {lang === "zh" ? <>由 {link} 设计与开发</> : <>Designed and developed by {link}</>}
    </span>
  );
}
