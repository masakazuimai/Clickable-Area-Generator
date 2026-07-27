import type { Dict, Lang } from "@/i18n/messages";

type Props = {
  readonly lang: Lang;
  readonly dict: Dict;
};

// 言語別のフッター。Direbase リンクは lang で出し分け（言語切替リンクはヘッダーに移動）。
export function SiteFooter({ lang, dict }: Props) {
  const seoCheckUrl = lang === "ja" ? "https://seo.codequest.work/ja" : "https://seo.codequest.work/en";
  // 使い方・FAQ ページは同一ツール内の内部リンク＝同一タブで遷移させる。
  const howtoUrl = lang === "ja" ? "/generator/clickable-area/howto/" : "/generator/clickable-area/en/howto/";

  return (
    <footer className="border-t border-border py-4 mt-auto">
      {/* 右下固定広告とリンクが被らないよう左寄せ（justify-between廃止） */}
      <div className="max-w-[1440px] mx-auto px-6 flex flex-col items-center gap-3 text-center sm:flex-row sm:flex-wrap sm:justify-start sm:gap-4 sm:text-left">
        <p className="text-base text-text-tertiary">
          © {new Date().getFullYear()} Clickable Area Generator | Created by{" "}
          <a href="https://codequest.work/" target="_blank" rel="noopener" className="hover:text-accent transition-colors">
            CodeQuest.work
          </a>
        </p>
        <div className="flex items-center gap-4">
          <a href={howtoUrl} className="text-base text-text-secondary hover:text-accent transition-colors">
            {dict.footer.howtoLink}
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
