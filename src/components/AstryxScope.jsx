// Astryx の部品で描く画面 (結果画面と Q&A) の共通の土台。どちらも React.lazy で後から読むので、
// Astryx の部品の CSS とテーマもこの部品と一緒に後から読み込まれ、最初の読み込みには入らない。
// どの CSS も @layer の中に入るので、層の外にある index.css などの既存の指定のほうが常に勝つ。
// reset.css は全体には読み込まない。行の高さ・見出し・余白・color-scheme をアプリ全体で変え、
// Astryx を使っていない画面の見た目が変わるため。部品が前提にする指定だけを、Astryx の画面の中に
// 限って astryx-scope-reset.css で効かせる。box-sizing は index.css が持っている。
import "@astryxdesign/core/astryx.css";
import "./astryx-scope-reset.css";
import "../themes/vocab/vocab.css";
import { vocabTheme } from "../themes/vocab/vocab.js";
import { Theme } from "@astryxdesign/core/theme";
import { Stack } from "@astryxdesign/core/Stack";

// テーマは neutral の字体を丸ゴシックにしたもの (themes/vocab)。アプリにダークモードが無いので
// ライトに固定する。幅は既存の画面と同じ最大 720px で中央に置く。
export default function AstryxScope({ children }) {
  return (
    <Theme theme={vocabTheme} mode="light">
      <Stack hAlign="center">
        <Stack width="100%" maxWidth={720}>
          {children}
        </Stack>
      </Stack>
    </Theme>
  );
}
