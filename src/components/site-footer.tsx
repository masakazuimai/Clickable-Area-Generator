import type { Dict, Lang } from "@/i18n/messages";
import { switchHref } from "@/i18n/site-meta";

type Props = {
  readonly lang: Lang;
  readonly dict: Dict;
};

// 言語別のフッター。SEO CHECK リンクと言語切替リンクは lang で出し分け。
export function SiteFooter({ lang, dict }: Props) {
  const seoCheckUrl = lang === "ja" ? "https://seo.codequest.work/ja" : "https://seo.codequest.work/en";

  return (
    <footer className="border-t border-border py-4 mt-auto">
      <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between">
        <p className="text-base text-text-tertiary">
          © 2026 Clickable Area Generator | Created by{" "}
          <a href="https://codequest.work/" target="_blank" rel="noopener" className="hover:text-accent transition-colors">
            CodeQuest.work
          </a>
        </p>
        <div className="flex items-center gap-4">
          <a href={switchHref[lang]} className="text-base text-text-secondary hover:text-accent transition-colors">
            {dict.footer.switchLabel}
          </a>
          <a href={seoCheckUrl} target="_blank" rel="noopener" className="text-base text-text-secondary hover:text-accent transition-colors">
            {dict.footer.seoLink}
          </a>
          <a href="https://codequest.work/category/generator/" target="_blank" rel="noopener" className="text-base text-text-secondary hover:text-accent transition-colors">
            {dict.footer.generatorsLink}
          </a>
        </div>
      </div>
    </footer>
  );
}
