// 英単語道場の Astryx テーマの元。neutral を受け継ぎ、字体だけをアプリの丸ゴシックにそろえる。
// 字体のファイルは index.html が Google Fonts から読み込んでいる (Astryx は字体を読み込まない)。
// 変えたら `npm run astryx -- theme build src/themes/vocab/vocabTheme.ts` で組み立て直し、
// 出力の vocab.js / vocab.css と型定義も一緒にコミットする。
import { defineTheme } from '@astryxdesign/core/theme';
import { neutralTheme } from '@astryxdesign/theme-neutral/built';

const roundGothic = {
  family: 'Zen Maru Gothic',
  fallbacks: "'Hiragino Maru Gothic ProN', 'Hiragino Sans', sans-serif",
};

export const vocabTheme = defineTheme({
  name: 'vocab',
  extends: neutralTheme,
  typography: {
    body: roundGothic,
    heading: roundGothic,
  },
});
