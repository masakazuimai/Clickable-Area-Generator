import type { HowtoContent } from "@/i18n/howto-content";

type Props = {
  readonly content: HowtoContent;
};

// 「使い方・FAQ」ページの可視本文。ja/en で共有し、content で出し分ける。
export function HowtoArticle({ content }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <header className="border-b border-border bg-bg-secondary">
        <div className="relative max-w-3xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <a
            href={content.toolHref}
            className="text-base text-text-secondary hover:text-accent transition-colors"
          >
            {content.backToTool}
          </a>
          <a
            href={content.switchHref}
            className="text-base text-text-secondary hover:text-accent transition-colors"
          >
            {content.switchLabel}
          </a>
        </div>
      </header>

      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-6 py-12">
          {/* パンくず */}
          <nav aria-label="breadcrumb" className="mb-6 text-base text-text-tertiary">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {content.breadcrumb.map((item, i) => (
                <li key={item.name} className="flex items-center gap-2">
                  {item.href ? (
                    <a href={item.href} className="hover:text-accent transition-colors">
                      {item.name}
                    </a>
                  ) : (
                    <span aria-current="page" className="text-text-secondary">
                      {item.name}
                    </span>
                  )}
                  {i < content.breadcrumb.length - 1 && <span aria-hidden>/</span>}
                </li>
              ))}
            </ol>
          </nav>

          <h1 className="text-3xl font-bold text-text mb-4">{content.h1}</h1>
          <p className="text-lg text-text-secondary leading-relaxed mb-12">{content.lead}</p>

          {/* 定義 */}
          <Section heading={content.definition.heading}>
            <p className="text-base text-text leading-relaxed">{content.definition.body}</p>
          </Section>

          {/* 使い方ステップ */}
          <Section heading={content.steps.heading}>
            <ol className="space-y-4">
              {content.steps.items.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent-muted text-accent font-mono font-medium text-base">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-base font-semibold text-text">{step.title}</p>
                    <p className="text-base text-text-secondary leading-relaxed mt-0.5">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          {/* 矩形と円形 */}
          <Section heading={content.shapes.heading}>
            <p className="text-base text-text leading-relaxed mb-4">{content.shapes.intro}</p>
            <DataTable columns={content.shapes.columns} rows={content.shapes.rows} />
          </Section>

          {/* レスポンシブ */}
          <Section heading={content.responsive.heading}>
            <p className="text-base text-text leading-relaxed mb-4">{content.responsive.body}</p>
            <DataTable columns={content.responsive.columns} rows={content.responsive.rows} />
          </Section>

          {/* よくある失敗 */}
          <Section heading={content.mistakes.heading}>
            <ul className="space-y-2 list-disc pl-5">
              {content.mistakes.items.map((item) => (
                <li key={item} className="text-base text-text leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          {/* FAQ */}
          <Section heading={content.faq.heading}>
            <div className="space-y-6">
              {content.faq.items.map(({ q, a }) => (
                <div key={q}>
                  <h3 className="text-base font-semibold text-text mb-1">{q}</h3>
                  <p className="text-base text-text-secondary leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* CTA */}
          <div className="mt-12 rounded-xl border border-border bg-bg-secondary px-6 py-8 text-center">
            <h2 className="text-2xl font-bold text-text mb-2">{content.cta.heading}</h2>
            <p className="text-base text-text-secondary mb-6">{content.cta.body}</p>
            <a
              href={content.toolHref}
              className="inline-block rounded-lg bg-accent px-6 py-3 text-base font-semibold text-surface hover:bg-accent-hover transition-colors"
            >
              {content.cta.button}
            </a>
          </div>
        </article>
      </main>
    </div>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-text mb-4">{heading}</h2>
      {children}
    </section>
  );
}

function DataTable({ columns, rows }: { columns: readonly string[]; rows: readonly (readonly string[])[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-base border-collapse">
        <thead>
          <tr className="bg-bg-secondary">
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 text-left font-semibold text-text border-b border-border">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-border last:border-b-0">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-3 align-top text-text-secondary">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
