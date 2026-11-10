import { useState, lazy, Suspense } from "react";
import Quiz from "./components/Quiz";
import Review from "./components/Review";
import Stats from "./components/Stats";
import WordList from "./components/WordList";
import GrammarList from "./components/GrammarList";
import { CodeIcon, ExternalLinkIcon } from "./components/icons";
import "./App.css";

// Q&A は結果画面と同じく Astryx の部品で描くので、開いたときに読み込む。
const QA = lazy(() => import("./components/QA"));

const pages = [
  { key: "quiz", label: "クイズ" },
  { key: "review", label: "復習" },
  { key: "words", label: "単語一覧" },
  { key: "grammar", label: "文法" },
  { key: "stats", label: "統計" },
  { key: "qa", label: "Q&A" },
];

export default function App() {
  const [page, setPage] = useState("quiz");
  // 復習を開くたびに作り直し、最新の記録から出題する
  const [reviewKey, setReviewKey] = useState(0);

  const handleNav = (key) => {
    if (key === "review") setReviewKey((k) => k + 1);
    setPage(key);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">道</span>
          <span className="brand-name">英単語道場</span>
        </div>

        {/* 839px 以下では画面の下に固定するタブになる (App.css) */}
        <nav className="app-nav" aria-label="メニュー">
          {pages.map((p) => (
            <button
              key={p.key}
              className={`nav-btn ${page === p.key ? "active" : ""}`}
              aria-current={page === p.key ? "page" : undefined}
              onClick={() => handleNav(p.key)}
            >
              {p.label}
            </button>
          ))}
        </nav>

        <a
          className="repo-link"
          href="https://github.com/maco165/english-vocab-app"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHubリポジトリを開く（新しいタブ）"
        >
          <CodeIcon size={18} />
          <span className="repo-link__label">GitHub</span>
          <ExternalLinkIcon size={14} className="repo-link__ext" />
        </a>
      </header>

      <main className="app-main">
        {page === "quiz" && <Quiz key={page} />}
        {page === "review" && <Review key={reviewKey} />}
        {page === "words" && <WordList />}
        {page === "grammar" && <GrammarList />}
        {page === "stats" && <Stats onReview={() => handleNav("review")} />}
        {page === "qa" && (
          <Suspense fallback={null}>
            <QA />
          </Suspense>
        )}
      </main>
    </div>
  );
}
