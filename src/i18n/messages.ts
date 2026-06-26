// UI文言の多言語辞書。ja は既存実装と完全一致、en は "Image Map Generator" 軸の英語コピー。
// SEO（metadata / JSON-LD）は site-meta.ts に分離。

export type Lang = "ja" | "en";

export type Dict = {
  readonly header: {
    readonly title: string;
    readonly subtitle: string;
    readonly switchLabel: string;
  };
  readonly intro: {
    readonly title: string;
    readonly subtitle: string;
    readonly steps: readonly { readonly title: string; readonly desc: string }[];
  };
  readonly uploader: {
    readonly dropping: string;
    readonly idle: string;
    readonly hint: string;
    readonly choose: string;
  };
  readonly toolbar: {
    readonly rect: string;
    readonly circle: string;
    readonly changeImage: string;
    readonly imageSize: string;
    readonly resizeHandle: string;
  };
  readonly areaList: {
    readonly title: string;
    readonly delete: string;
    readonly urlPlaceholder: string;
    readonly altPlaceholder: string;
    readonly empty: string;
  };
  readonly codeOutput: {
    readonly cssMode: string;
    readonly mapMode: string;
  };
  readonly footer: {
    readonly howtoLink: string;
    readonly seoLink: string;
    readonly generatorsLink: string;
  };
};

export const messages: Record<Lang, Dict> = {
  ja: {
    header: {
      title: "Clickable Area Generator",
      subtitle: "画像にクリッカブルエリアを設定してHTMLコードを生成",
      switchLabel: "English →",
    },
    intro: {
      title: "画像マップを作成",
      subtitle: "画像をアップロードして、クリッカブルなエリアを描画しましょう",
      steps: [
        { title: "画像をアップロード", desc: "PNG, JPG, SVG など" },
        { title: "エリアを描画", desc: "矩形・円形で指定" },
        { title: "コードを取得", desc: "コピーして貼り付け" },
      ],
    },
    uploader: {
      dropping: "ここにドロップ",
      idle: "画像をアップロード",
      hint: "ドラッグ&ドロップ、または",
      choose: " ファイルを選択",
    },
    toolbar: {
      rect: "矩形",
      circle: "円形",
      changeImage: "画像を変更",
      imageSize: "画像サイズ",
      resizeHandle: "ドラッグでリサイズ",
    },
    areaList: {
      title: "エリア一覧",
      delete: "削除",
      urlPlaceholder: "URL を入力...",
      altPlaceholder: "Alt テキスト...",
      empty: "画像上でドラッグしてエリアを作成",
    },
    codeOutput: {
      cssMode: "CSS（レスポンシブ）",
      mapMode: "HTML Map",
    },
    footer: {
      howtoLink: "📖 使い方・FAQ",
      seoLink: "CodeQuest.work SEO",
      generatorsLink: "その他のジェネレーター →",
    },
  },
  en: {
    header: {
      title: "Image Map Generator",
      subtitle: "Draw clickable areas on your image and generate responsive HTML",
      switchLabel: "日本語 →",
    },
    intro: {
      title: "Create an image map",
      subtitle: "Upload an image and draw clickable areas on it",
      steps: [
        { title: "Upload an image", desc: "PNG, JPG, SVG, etc." },
        { title: "Draw the areas", desc: "Rectangle or circle" },
        { title: "Get the code", desc: "Copy and paste" },
      ],
    },
    uploader: {
      dropping: "Drop it here",
      idle: "Upload an image",
      hint: "Drag & drop, or",
      choose: " choose a file",
    },
    toolbar: {
      rect: "Rectangle",
      circle: "Circle",
      changeImage: "Change image",
      imageSize: "Image size",
      resizeHandle: "Drag to resize",
    },
    areaList: {
      title: "Areas",
      delete: "Delete",
      urlPlaceholder: "Enter URL...",
      altPlaceholder: "Alt text...",
      empty: "Drag on the image to create an area",
    },
    codeOutput: {
      cssMode: "CSS (responsive)",
      mapMode: "HTML Map",
    },
    footer: {
      howtoLink: "📖 How to use & FAQ",
      seoLink: "CodeQuest.work SEO",
      generatorsLink: "More generators →",
    },
  },
};
