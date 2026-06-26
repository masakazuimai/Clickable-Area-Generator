// 「使い方・FAQ」ページ（howto）の可視コンテンツ。ja/en で同じ HowtoArticle が描画する。
// SEO（metadata / JSON-LD）は howto-meta.ts に分離。
import type { Lang } from "./messages";

export type Step = { readonly title: string; readonly desc: string };
export type Row = readonly string[];
export type Faq = { readonly q: string; readonly a: string };

export type HowtoContent = {
  readonly toolHref: string;
  readonly switchHref: string;
  readonly switchLabel: string;
  readonly backToTool: string;
  readonly breadcrumb: readonly { readonly name: string; readonly href?: string }[];
  readonly h1: string;
  readonly lead: string;
  readonly definition: { readonly heading: string; readonly body: string };
  readonly steps: { readonly heading: string; readonly items: readonly Step[] };
  readonly shapes: {
    readonly heading: string;
    readonly intro: string;
    readonly columns: readonly string[];
    readonly rows: readonly Row[];
  };
  readonly responsive: {
    readonly heading: string;
    readonly body: string;
    readonly columns: readonly string[];
    readonly rows: readonly Row[];
  };
  readonly mistakes: { readonly heading: string; readonly items: readonly string[] };
  readonly faq: { readonly heading: string; readonly items: readonly Faq[] };
  readonly cta: { readonly heading: string; readonly body: string; readonly button: string };
};

export const howtoContent: Record<Lang, HowtoContent> = {
  ja: {
    toolHref: "/generator/clickable-area/",
    switchHref: "/generator/clickable-area/en/howto/",
    switchLabel: "English →",
    backToTool: "← ツールに戻る",
    breadcrumb: [
      { name: "CodeQuest", href: "https://codequest.work/" },
      { name: "ジェネレーター", href: "https://codequest.work/category/generator/" },
      { name: "Clickable Area Generator", href: "/generator/clickable-area/" },
      { name: "使い方・FAQ" },
    ],
    h1: "クリッカブルエリアの作り方・使い方",
    lead:
      "Clickable Area Generator は、画像をアップロードして矩形・円形のエリアをドラッグで描くだけで、レスポンシブ対応の HTML/CSS コードを生成できる無料ツールです。HTML の知識がなくても、コピー&ペーストでクリッカブルな画像を実装できます。",
    definition: {
      heading: "クリッカブルエリア（イメージマップ）とは",
      body:
        "クリッカブルエリアとは、1 枚の画像の中に複数のクリック可能なリンク領域を設定する仕組みです。バナーや地図、図解の一部分だけをリンクにしたいときに使います。従来は HTML の <map> / <area> 要素で実装しましたが、ピクセル座標が固定でレスポンシブに弱いため、現在は CSS でパーセント配置する方式が主流です。",
    },
    steps: {
      heading: "使い方（5 ステップ）",
      items: [
        { title: "画像をアップロード", desc: "PNG・JPG・SVG・WebP をドラッグ&ドロップ、またはファイル選択で読み込みます。" },
        { title: "形状を選んでエリアを描画", desc: "ツールバーで矩形 / 円形を選び、画像上をドラッグしてリンク領域を作成します。" },
        { title: "リンクを設定", desc: "各エリアにリンク先 URL と alt テキストを入力します。" },
        { title: "位置を微調整", desc: "作成済みのエリアはドラッグで移動、ハンドルでリサイズできます。必要なら画像サイズも変更できます（アスペクト比は固定）。" },
        { title: "コードをコピー", desc: "「CSS（レスポンシブ）」または「HTML Map」形式を選び、ワンクリックでコピーして貼り付けます。" },
      ],
    },
    shapes: {
      heading: "矩形と円形の使い分け",
      intro: "エリアの形状は矩形（rect）と円形（circle）の 2 種類です。対象の形に合わせて選びます。",
      columns: ["形状", "向いている対象", "例"],
      rows: [
        ["矩形（rect）", "ボタン・カード・テキスト帯など四角い領域", "バナー内の CTA ボタン"],
        ["円形（circle）", "アイコン・丸い要素・人物の顔など", "地図上のピン、丸アイコン"],
      ],
    },
    responsive: {
      heading: "レスポンシブ対応の仕組み",
      body:
        "従来の <map> / <area> はピクセル座標が固定のため、画像を縮小するとクリック位置がずれます。本ツールの「CSS（レスポンシブ）」出力は position: absolute とパーセント指定で領域を配置するため、画像がどんな幅に縮んでもクリック領域が追従します。スマホ対応サイトでは CSS 方式を選んでください。",
      columns: ["方式", "レスポンシブ", "仕組み", "向いている用途"],
      rows: [
        ["CSS 方式", "◯ 対応", "position: absolute + %", "スマホ対応サイト（推奨）"],
        ["HTML Map 方式", "△ 固定", "<map><area> ピクセル座標", "固定幅・レガシー用途"],
      ],
    },
    mistakes: {
      heading: "よくある失敗と対処",
      items: [
        "画像を CSS で拡大縮小しているのに HTML Map 方式を使い、クリック位置がずれる → CSS 方式を選ぶ。",
        "エリアに URL を入れ忘れてリンクが効かない → 各エリアの URL 欄を確認する。",
        "出力コードのラッパー要素の幅を固定してしまう → ラッパーは width: 100% + max-width で可変にする。",
        "alt を未設定にしてアクセシビリティが低下する → 各エリアに alt テキストを設定する。",
      ],
    },
    faq: {
      heading: "よくある質問",
      items: [
        {
          q: "クリッカブルエリアジェネレーターとは？",
          a: "画像上にクリック可能な領域（リンクエリア）を視覚的に設定し、レスポンシブ対応の HTML コードを自動生成する無料 Web ツールです。",
        },
        {
          q: "レスポンシブ対応のクリッカブルエリアはどう実装しますか？",
          a: "従来の HTML map 要素はピクセル固定のためレスポンシブ非対応です。本ツールでは position: absolute とパーセント指定の CSS 方式でコードを出力するため、画像が縮小されてもクリック領域が追従します。",
        },
        {
          q: "対応している画像形式は？",
          a: "PNG、JPG、SVG、WebP など、ブラウザが表示可能なすべての画像形式に対応しています。",
        },
        {
          q: "エリアの形状は何が使えますか？",
          a: "矩形（rect）と円形（circle）の 2 種類に対応しています。ドラッグで描画し、作成後も移動・リサイズが可能です。",
        },
        {
          q: "生成したコードはどこに貼ればいいですか？",
          a: "HTML ファイルや WordPress のカスタム HTML ブロック、記事本文にそのまま貼り付けられます。CSS 方式は画像を囲むラッパーごとコピーしてください。",
        },
        {
          q: "登録や費用は必要ですか？",
          a: "登録不要・無料で、生成したコードは商用サイトでも利用できます。画像自体の著作権はご自身でご確認ください。",
        },
      ],
    },
    cta: {
      heading: "さっそく作ってみる",
      body: "画像をアップロードして、クリッカブルエリアを描いてみましょう。",
      button: "ツールを開く",
    },
  },
  en: {
    toolHref: "/generator/clickable-area/en/",
    switchHref: "/generator/clickable-area/howto/",
    switchLabel: "日本語 →",
    backToTool: "← Back to the tool",
    breadcrumb: [
      { name: "CodeQuest", href: "https://codequest.work/" },
      { name: "Generators", href: "https://codequest.work/category/generator/" },
      { name: "Image Map Generator", href: "/generator/clickable-area/en/" },
      { name: "How to use" },
    ],
    h1: "How to create a clickable image map",
    lead:
      "Image Map Generator is a free tool that turns any image into a clickable image map. Upload an image, draw rectangle or circle areas by dragging, and copy responsive HTML/CSS — no coding required.",
    definition: {
      heading: "What is a clickable area (image map)?",
      body:
        "A clickable area lets you place several clickable link regions on a single image — useful when only part of a banner, map, or diagram should be a link. It was traditionally built with the HTML <map> / <area> elements, but those use fixed pixel coordinates and scale poorly, so CSS-based percentage positioning is now the common approach.",
    },
    steps: {
      heading: "How to use it (5 steps)",
      items: [
        { title: "Upload an image", desc: "Drag & drop or pick a PNG, JPG, SVG, or WebP file." },
        { title: "Pick a shape and draw", desc: "Choose rectangle or circle in the toolbar, then drag on the image to create a link area." },
        { title: "Set the link", desc: "Enter a destination URL and alt text for each area." },
        { title: "Fine-tune the position", desc: "Move existing areas by dragging and resize them with the handles. You can also resize the image (aspect ratio stays locked)." },
        { title: "Copy the code", desc: "Choose “CSS (responsive)” or “HTML Map” and copy it with one click." },
      ],
    },
    shapes: {
      heading: "Rectangle vs. circle",
      intro: "Areas come in two shapes — rectangle (rect) and circle. Pick the one that matches the target.",
      columns: ["Shape", "Best for", "Example"],
      rows: [
        ["Rectangle (rect)", "Buttons, cards, text bars and other boxy regions", "A CTA button inside a banner"],
        ["Circle (circle)", "Icons, round elements, faces", "A pin on a map, a round avatar"],
      ],
    },
    responsive: {
      heading: "How responsive mode works",
      body:
        "Traditional <map> / <area> elements use fixed pixel coordinates, so the clickable spots drift when the image scales down. The “CSS (responsive)” output places areas with position: absolute and percentage values, so the clickable regions follow the image at any width. Choose CSS mode for mobile-friendly sites.",
      columns: ["Mode", "Responsive", "How it works", "Best for"],
      rows: [
        ["CSS mode", "Yes", "position: absolute + %", "Mobile-friendly sites (recommended)"],
        ["HTML Map mode", "Fixed", "<map><area> pixel coordinates", "Fixed-width or legacy use"],
      ],
    },
    mistakes: {
      heading: "Common mistakes",
      items: [
        "Using HTML Map mode while the image is scaled with CSS, so clicks land in the wrong spot → use CSS mode.",
        "Forgetting to enter a URL, so the link does nothing → check the URL field of each area.",
        "Fixing the wrapper width on the output code → make the wrapper fluid with width: 100% + max-width.",
        "Leaving alt empty and hurting accessibility → set alt text for each area.",
      ],
    },
    faq: {
      heading: "FAQ",
      items: [
        {
          q: "What is an image map generator?",
          a: "An image map generator is a free web tool that lets you visually draw clickable areas (links) on an image and exports the responsive HTML code automatically.",
        },
        {
          q: "How do I make a responsive image map?",
          a: "Traditional HTML <map> elements use fixed pixel coordinates and are not responsive. This tool outputs CSS-based code using position: absolute and percentage values, so the clickable areas follow the image as it scales down.",
        },
        {
          q: "Which image formats are supported?",
          a: "PNG, JPG, SVG, WebP and any other image format your browser can display.",
        },
        {
          q: "What area shapes can I use?",
          a: "Rectangle (rect) and circle. Draw them by dragging, and you can move or resize them after they are created.",
        },
        {
          q: "Where do I paste the generated code?",
          a: "Into an HTML file, a WordPress custom HTML block, or your article body. For CSS mode, copy the whole wrapper that surrounds the image.",
        },
        {
          q: "Is sign-up or payment required?",
          a: "No. It is free and needs no account, and the generated code can be used on commercial sites. Please check the copyright of the image itself yourself.",
        },
      ],
    },
    cta: {
      heading: "Try it now",
      body: "Upload an image and start drawing clickable areas.",
      button: "Open the tool",
    },
  },
};
