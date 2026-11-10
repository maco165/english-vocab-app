import { Stack } from "@astryxdesign/core/Stack";
import { Heading, Text } from "@astryxdesign/core/Text";
import { Collapsible, CollapsibleGroup } from "@astryxdesign/core/Collapsible";
import { Link } from "@astryxdesign/core/Link";
import words from "../data/words";
import grammar from "../data/grammar";
import AstryxScope from "./AstryxScope";

const REPO = "https://github.com/maco165/english-vocab-app";

// 答えはコードの動きに合わせる。動きを変えたらここも直す。
const items = [
  {
    id: "about",
    q: "どんなアプリですか？",
    a: `英単語の意味を 4 択で答えるクイズで、英単語を覚えるための Web アプリです。収録しているのは英単語 ${words.length} 語と、英文法 ${grammar.length} 項目です。`,
  },
  {
    id: "account",
    q: "登録やログインは必要ですか？",
    a: "必要ありません。サーバーを持たないアプリなので、ページを開けばすぐに使えます。",
  },
  {
    id: "count",
    q: "1 回のクイズで何問出ますか？",
    a: `30 問、100 問、全 ${words.length} 問から選べます。「カスタム」では 1〜${words.length} 問の好きな数を指定できます。`,
  },
  {
    id: "choices",
    q: "選択肢はどう作られていますか？",
    a: "正解の意味 1 つと、ほかの単語から無作為に選んだ意味 3 つを、順番を混ぜて並べています。",
  },
  {
    id: "review",
    q: "「復習」にはどの単語が出ますか？",
    a: "間違えたことがあり、いちばん最近の答えも不正解だった単語です。復習で一度正解すると、次からは出なくなります。",
  },
  {
    id: "storage",
    q: "学習の記録はどこに保存されますか？",
    a: "使っているブラウザの中 (localStorage) にだけ保存され、外部には送られません。そのため、別の端末や別のブラウザとは共有されず、ブラウザのサイトデータを消すと記録も消えます。",
  },
  {
    id: "reset",
    q: "記録を消すには？",
    a: "「統計」の画面の「記録をリセット」を押すと、すべての記録を消せます。消した記録は戻せません。",
  },
  {
    id: "phone",
    q: "スマホでも使えますか？",
    a: "使えます。画面の幅が狭いときは、メニューが画面の下に並びます。",
  },
];

export default function QA() {
  return (
    <AstryxScope>
      <Stack gap={6}>
        <Heading level={1}>Q&amp;A</Heading>
        <CollapsibleGroup type="single" hasDividers defaultValue="about">
          {items.map((item) => (
            <Collapsible key={item.id} value={item.id} trigger={item.q}>
              <Text as="p" display="block">
                {item.a}
              </Text>
            </Collapsible>
          ))}
        </CollapsibleGroup>
        <Text as="p" display="block" type="supporting">
          ほかの質問や不具合の報告は、
          <Link href={`${REPO}/issues`} isExternalLink>
            GitHub の Issues
          </Link>
          で受け付けています。
        </Text>
      </Stack>
    </AstryxScope>
  );
}
