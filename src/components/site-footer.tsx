import type { Dict, Lang } from "@/i18n/messages";

type Props = {
  readonly lang: Lang;
  readonly dict: Dict;
};

// 言語別のフッター。SEO CHECK リンクは lang で出し分け（言語切替リンクはヘッダーに移動）。
export function SiteFooter({ lang, dict }: Props) {
  const seoCheckUrl = lang === "ja" ? "https://seo.codequest.work/ja" : "https://seo.codequest.work/en";

  return (
    <footer className="border-t border-border py-4 mt-auto">
      <div className="max-w-[1440px] mx-auto px-6 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:gap-4 sm:text-left">
        <p className="text-base text-text-tertiary">
          © 2026 Clickable Area Generator | Created by{" "}
          <a href="https://codequest.work/" target="_blank" rel="noopener" className="hover:text-accent transition-colors">
            CodeQuest.work
          </a>
        </p>
        <div className="flex items-center gap-4">
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
