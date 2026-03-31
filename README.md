# Clickable Area Generator

画像にクリッカブルエリアを設定して、レスポンシブ対応のHTMLコードを生成するWebツール。

## 機能

- 画像をアップロードしてクリッカブルエリアを視覚的に描画
- 矩形・円形のエリア指定
- ドラッグによるエリアの移動・リサイズ
- 画像サイズの変更（ドラッグ / 数値入力、アスペクト比固定）
- **CSS（レスポンシブ）** / HTML Map の2種類のコード出力
- ワンクリックコピー

## CSS（レスポンシブ）出力

従来の `<map>` タグではなく、`position: absolute` + パーセント指定でクリック領域を配置。  
画像が縮小されてもエリアが追従するため、レスポンシブサイトにそのまま組み込めます。

## 技術スタック

- [Next.js](https://nextjs.org/)（App Router）
- TypeScript
- Tailwind CSS

## セットアップ

```bash
npm install
npm run dev
```

http://localhost:3000 で起動します。

## 関連リンク

- [CodeQuest - その他のジェネレーター](https://codequest.work/tag/generator/)

## ライセンス

MIT
