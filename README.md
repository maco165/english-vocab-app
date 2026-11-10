[https://maco165.github.io/english-vocab-app/](https://maco165.github.io/english-vocab-app/)
# 英単語道場

4択クイズ形式の英単語学習Webアプリ。1000語の英単語を繰り返し学習し、正誤記録をもとに効率的に復習できます。TOEIC・大学受験対策にも。

## 機能

### クイズモード
- **30問 / 100問 / 全問 / カスタム** から問題数を選択してスタート
- 英単語に対して4択から日本語の意味を選ぶ
- 回答後に正誤フィードバックと例文（英語・日本語）を表示
- プログレスバーで進捗を確認
- 終了時の結果画面に、正解・不正解の数、正解率のバー、間違えた単語の一覧を表示
- 間違えた問題だけをその場で復習可能。全問に正解すると「復習完了！」を表示

### 復習モード
- 過去に間違えた単語のうち、最後の回答が不正解のものだけを出題
- 一度正解すると復習リストから自動で除外（詳しくは「[データ](#データ)」）

### 単語一覧
- 全1000語を一覧表示
- 英語・日本語の意味・例文（英語・日本語訳）を確認
- 検索機能で単語を絞り込み

### 文法一覧
- 50項目の英文法をカテゴリ別に整理
- 時制、助動詞、受動態、不定詞・動名詞、関係詞、比較、仮定法など18カテゴリ
- 各項目に説明・構文パターン・例文3つ付き
- カテゴリフィルターと検索機能
- アコーディオン形式で開閉表示

### 統計
- 総回答数・正解数・不正解数・正解率を表示
- 間違えた単語の一覧（連続正解数バッジ・「この N 語を復習する」ボタン付き）
- 記録リセット機能

### Q&A
- アプリの使い方の質問 8 つと答え（登録の要否、問題数、復習に出る単語、記録の保存先と消し方など）
- 質問を押すと答えが開く。開くのは一度に 1 つ

## 技術構成

| 項目 | 技術 |
|------|------|
| フレームワーク | React 19 |
| ビルドツール | Vite 7 |
| スタイル | CSS（CSS カスタムプロパティによるデザイントークン） |
| UI 部品（一部） | [Astryx](https://github.com/meta/astryx) 0.7.11。結果画面と Q&A だけで使い、開いたときに読み込む（[Astryx の使い方](#astryx-の使い方)） |
| データ保存 | localStorage |
| 単語データ | 固定データ（1000語、例文・日本語訳付き） |
| 文法データ | 固定データ（50項目） |
| API | 不使用（完全オフライン動作） |

## セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/<your-username>/english-vocab-app.git
cd english-vocab-app

# 依存パッケージをインストール
npm install

# 開発サーバーを起動
npm run dev

# プロダクションビルド
npm run build

# ビルド結果をプレビュー
npm run preview
```

## プロジェクト構成

```
english-vocab-app/
├── index.html               # HTMLエントリーポイント
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # Reactエントリーポイント
    ├── App.jsx               # メインアプリ（ナビゲーション）
    ├── App.css               # ヘッダー・ナビ・レイアウト
    ├── index.css             # グローバルリセット・デザイントークン・共通部品
    ├── data/
    │   ├── words.js          # 英単語データ（1000語）
    │   └── grammar.js        # 文法データ（50項目）
    ├── themes/
    │   └── vocab/            # Astryx のテーマ（neutral の字体を丸ゴシックにしたもの）
    │       ├── vocabTheme.ts       # テーマの元（defineTheme）
    │       ├── vocabTheme.doc.mjs  # テーマの説明（CLI が読む）
    │       └── vocab.js / vocab.css / *.d.ts  # theme build の出力（手で直さない）
    ├── components/
    │   ├── icons.jsx         # インライン SVG アイコン
    │   ├── AstryxScope.jsx   # Astryx の画面の土台（テーマ・CSS の読み込み・幅）
    │   ├── astryx-scope-reset.css  # Astryx の画面の中だけに効かせる reset
    │   ├── Quiz.jsx          # クイズ画面（モード選択・出題）
    │   ├── Quiz.css
    │   ├── QuizEnd.jsx       # クイズ終了画面（結果・セッション復習。Astryx）
    │   ├── QA.jsx            # Q&A（Astryx）
    │   ├── Result.jsx        # 1問ごとの正誤フィードバック
    │   ├── Result.css
    │   ├── Review.jsx        # 復習モード（間違えた単語のみ）
    │   ├── Review.css
    │   ├── Stats.jsx         # 統計画面
    │   ├── Stats.css
    │   ├── WordList.jsx      # 単語一覧（検索付き）
    │   ├── WordList.css
    │   ├── GrammarList.jsx   # 文法一覧（カテゴリ・検索付き）
    │   └── GrammarList.css
    └── utils/
        └── storage.js        # localStorage操作ユーティリティ
```

`.claude/CLAUDE.md` は Claude Code などの AI 向けの説明です。Astryx の部品の一覧と使い方を `astryx init` が書き込み、版を上げたときは `npm run astryx -- upgrade` で直します。

## 設計

### 構成

サーバーを持たない静的なアプリです。GitHub Pages が配る HTML・JS・CSS がブラウザの中だけで動き、単語と文法のデータは JS に同梱されています。回答の記録はブラウザの localStorage に保存するので、外部との通信はページの読み込みだけです。結果画面と Q&A は Astryx の部品で描き、その JS と CSS は画面を開いたときに読み込みます（`React.lazy`）。

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/architecture-dark.png">
  <img src="docs/architecture.png" alt="構成図: 利用者がブラウザの React アプリを操作し、正誤を localStorage に保存する。main への push で GitHub Actions が Vite でビルドし、GitHub Pages に公開する">
</picture>

図の元は [`docs/architecture.html`](docs/architecture.html) です（stack-diagram で作成）。

### 画面遷移

ページはナビで切り替えます。ナビは、幅が 840px 以上ではヘッダーの中に、839px 以下では画面の下に固定したタブとして並びます。URL は変わらず、`App.jsx` の `page` の状態だけで表示を切り替えます。ナビからはどのページにも直接移れます。図には、ナビ以外の移り方だけを矢印で描いています。復習のページは開くたびに作り直し、最新の記録から出題します（`reviewKey` を 1 つ増やして `key` に渡す）。

```mermaid
stateDiagram-v2
  direction LR
  state "クイズ (Quiz)" as quiz
  state "復習 (Review)" as review
  state "単語一覧 (WordList)" as words
  state "文法 (GrammarList)" as grammar
  state "統計 (Stats)" as stats
  state "Q&A (QA)" as qa
  [*] --> quiz: 起動時
  stats --> review: 「この N 語を復習する」
```

クイズのページの中では、次の順に状態が移ります。`Quiz.jsx` の `phase`（`start` / `playing` / `end`）と、`QuizEnd.jsx` の `reviewMode` で管理しています。

```mermaid
stateDiagram-v2
  state "問題数の選択 (phase=start)" as select
  state "出題 (phase=playing)" as ask
  state "回答済み" as answered
  state "結果 (phase=end)" as result
  state "結果画面からの復習 (reviewMode)" as rask
  state "復習の回答済み" as ranswered
  state "復習完了 (reviewMode で問題なし)" as rdone
  [*] --> select
  select --> ask: 30問 / 100問 / 全問 / カスタムで開始
  ask --> answered: 選択肢を押す（正誤を保存）
  answered --> ask: 次の問題へ（残りがある）
  answered --> result: 次の問題へ（最後の問題）
  result --> ask: もう一度挑戦（同じ問題数）
  result --> select: モード選択へ
  result --> rask: 間違えた問題を復習
  rask --> ranswered: 選択肢を押す（正誤を保存）
  ranswered --> rask: 次へ（未正解の語が残る）
  ranswered --> rdone: 次へ（全部正解した）
  rdone --> ask: もう一度挑戦
  rdone --> select: モード選択へ
```

結果画面からの復習では、正解した語を残りから外します。間違えた語は残し、次はできるだけ別の語を出します。残りが無くなったら「復習完了！」を出します（`QuizEnd.jsx` の `handleNext`）。

### コンポーネント構成

実線は描画の親子、太い線は開いたときに読み込む部品（`React.lazy`）、点線はデータと保存処理の参照です。アイコン（`icons.jsx`）はほぼすべての画面が使うので省いています。

```mermaid
flowchart TD
  main["main.jsx"] --> App["App.jsx<br/>ヘッダー・ナビ・page の状態"]
  App --> Quiz["Quiz.jsx"]
  App --> Review["Review.jsx"]
  App --> WordList["WordList.jsx"]
  App --> GrammarList["GrammarList.jsx"]
  App --> Stats["Stats.jsx"]
  App ==> QA["QA.jsx<br/>Q&A"]
  Quiz --> QuizStart["QuizStart<br/>（Quiz.jsx の中）"]
  Quiz --> Result["Result.jsx<br/>1 問ごとの正誤"]
  Quiz ==> QuizEnd["QuizEnd.jsx<br/>結果と復習"]
  QuizEnd --> Result
  QuizEnd --> Scope["AstryxScope.jsx<br/>テーマ・CSS・幅"]
  QA --> Scope
  Scope -.-> theme[("themes/vocab")]
  Review --> Result
  words[("data/words.js")] -.-> Quiz
  words -.-> QuizEnd
  words -.-> Review
  words -.-> WordList
  words -.-> Stats
  grammar[("data/grammar.js")] -.-> GrammarList
  storage[["utils/storage.js"]] -.-> Quiz
  storage -.-> QuizEnd
  storage -.-> Review
  storage -.-> Stats
```

### データ

単語と文法は JS の配列として同梱しています。回答の記録だけが localStorage に入ります。

```mermaid
erDiagram
  WORD ||--o{ RESULT : "wordId で参照"
  WORD {
    number id "1〜1000"
    string english
    string japanese
    string example "英語の例文"
    string exampleJa "例文の日本語訳"
  }
  RESULT {
    number wordId
    boolean isCorrect
    number timestamp "Date.now() のミリ秒"
  }
  GRAMMAR {
    number id "1〜50"
    string category "18 種類"
    string title
    string explanation
    string structure "構文のパターン"
    array examples "en と ja の組を 3 つ"
  }
```

| 置き場所 | 中身 | 件数 |
|---|---|---|
| `src/data/words.js` | `WORD` の配列 | 1000 語 |
| `src/data/grammar.js` | `GRAMMAR` の配列 | 50 項目（18 カテゴリ） |
| localStorage の `vocab-quiz-results` | `RESULT` の配列を JSON にしたもの。回答するたびに末尾に 1 件足す | 回答した数だけ増える。上限は無い |

統計と復習の対象は、保存した `RESULT` をその都度読み直して計算します（`utils/storage.js`）。

- `getStats()`: 総回答数・正解数・不正解数・正解率と、単語ごとの正解数・不正解数・連続正解数（`streak`）を出す。`streak` は正解で 1 増え、不正解で 0 に戻る
- `getMistakeWordIds()`: 一度でも間違え（`incorrect > 0`）、かつ最後の回答が不正解（`streak === 0`）の単語を復習の対象にする。そのため、一度正解すると対象から外れる
- `resetResults()`: 統計の画面の「記録をリセット」で、キーごと消す

### Astryx の使い方

結果画面と Q&A は、Meta の OSS のデザインシステム Astryx の部品で描いています。ほかの画面は今までどおり自前の CSS です。2 つの作り方が同じ画面に混ざらないよう、次のように分けています。

| 決めたこと | 理由 |
|---|---|
| Astryx の画面は `React.lazy` で開いたときに読み込む | Astryx の JS と CSS は gzip で約 120 kB ある。最初の読み込み（gzip で JS 129 kB・CSS 3.6 kB）を変えないため |
| Astryx の `reset.css` は全体に読み込まない。部品が前提にする指定だけを `astryx-scope-reset.css` に写し、`@scope ([data-astryx-theme])` で Astryx の画面の中に限る | 全体に読み込むと、行の高さ・見出し・余白・`color-scheme` が変わり、Astryx を使っていない画面の見た目が変わる |
| テーマは neutral を受け継ぎ、字体だけを丸ゴシックにした `themes/vocab` | 他の画面と字体をそろえるため。`tokens` で字体を上書きしても反映されないので `typography` で指定している |
| テーマは `mode="light"` に固定する | アプリにダークモードが無く、端末がダーク設定のときに Astryx の画面だけ暗くなるのを防ぐ |
| Astryx の CSS はすべて `@layer` の中に入る | 層の外にある `index.css` などの既存の指定が常に勝つので、既存の画面に影響しない |

テーマを変えたときと、Astryx の版を上げたときは、次を実行します。

```bash
npm run astryx -- theme build src/themes/vocab/vocabTheme.ts   # テーマを組み立て直す（出力もコミットする）
npm run astryx -- upgrade --from <前の版> --apply                # 版を上げたあと、.claude/CLAUDE.md などを直す
npm run build && npm run astryx -- doctor --built dist          # 納品前の検査
```

版を上げたら、`astryx-scope-reset.css` と写し元の `@astryxdesign/core/src/reset.css` の差分も見直します。CLI（`@astryxdesign/cli`）は Node 22.13 以上が要ります。GitHub Actions のビルドは Node 20 ですが、CLI を使わないので影響しません。

### ビルドと公開

`main` に push すると、GitHub Actions（`.github/workflows/deploy.yml`）がビルドして GitHub Pages に公開します。公開先は `https://maco165.github.io/english-vocab-app/` で、`vite.config.js` の `base` を `/english-vocab-app/` にしてパスを合わせています。

```mermaid
flowchart LR
  push["main に push"] --> build
  subgraph build["build ジョブ"]
    direction TB
    co["checkout"] --> node["setup-node（Node 20, npm のキャッシュ）"] --> ci["npm ci"] --> vb["npm run build<br/>（vite build → dist/）"] --> up["upload-pages-artifact<br/>（dist）"]
  end
  build --> deploy["deploy ジョブ<br/>deploy-pages"]
  deploy --> site["GitHub Pages"]
```

同じグループ（`pages`）の実行が重なったときは、古いほうを取り消します（`concurrency.cancel-in-progress`）。PR の段階で動くチェックはありません。

### 既知の課題

| 課題 | 場所 | 中身 |
|---|---|---|
| Astryx の画面を初めて開くとき、一瞬だけ何も出ない | `Quiz.jsx` と `App.jsx` の `Suspense` | 読み込みのあいだの表示（`fallback`）を `null` にしている |
| `@scope` に対応していないブラウザでは、Q&A の質問の行がブラウザ標準のボタンの見た目になる | `src/components/astryx-scope-reset.css` | 操作はできる。主なブラウザは対応済み |

## レスポンシブ対応

- 中身の段組みはブレークポイントを設けず、`flex-wrap` と `repeat(auto-fit, minmax(min(Npx, 100%), 1fr))` で折り返す
- ヘッダーとナビだけ 839px 以下で組み方を変える（`App.css` の `@media (max-width: 839px)`）。ヘッダーにはロゴと GitHub のアイコンだけを置き、ナビは画面の下に固定したタブにする。6 つのタブは 320px まで 1 段に収まる。下のタブに本文の最後が隠れないよう、`.app-main` の下の余白を広げる。GitHub のリンクは文字を消してアイコンだけにする
- スマホ幅ではカード・選択肢が 1 列になる

## デザイン

- 明るく親しみやすいテーマ（生成りの地色＋白カード＋朱色アクセント）
- 背景: `#FBF8F2`（生成り）/ カード: `#FFFFFF`
- アクセント: `#C9461F`（朱）/ 復習: `#B7791F`（琥珀）
- 正解: `#1E7F6E`（ティール）/ 不正解: `#C9461F`（朱）。赤／緑の対比は使わない
- フォント: Zen Maru Gothic（日本語）＋ Nunito（英単語・数字）
- Astryx の画面（結果画面・Q&A）は、Astryx の neutral テーマの配色に、字体だけ Zen Maru Gothic を合わせている。数字は色を付けず、主なボタンは黒

## ライセンス

[MIT](./LICENSE)
