import { useState } from "react";
import words from "../data/words";
import { getStats, resetResults } from "../utils/storage";
import { ArrowIcon, CircleIcon, RefreshIcon, XIcon } from "./icons";
import "./Stats.css";

export default function Stats({ onReview }) {
  const [stats, setStats] = useState(() => getStats());

  const handleReset = () => {
    if (window.confirm("学習記録をすべてリセットしますか？")) {
      resetResults();
      setStats(getStats());
    }
  };

  const refresh = () => setStats(getStats());

  // 全回答済み単語リスト（連続正解数・不正解数付き）
  const answeredWords = Object.entries(stats.wordStats)
    .map(([wordId, s]) => {
      const word = words.find((w) => w.id === Number(wordId));
      return { ...word, ...s };
    })
    .sort((a, b) => b.incorrect - a.incorrect);

  const mistakeWords = answeredWords.filter((w) => w.incorrect > 0);
  const reviewCount = mistakeWords.filter((w) => w.streak === 0).length;

  return (
    <div className="stats">
      <div className="page-header stats-header">
        <h1>学習統計</h1>
        <button className="btn-secondary refresh-btn" onClick={refresh}>
          <RefreshIcon size={16} />
          更新
        </button>
      </div>

      <section className="summary-card">
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">総回答数</span>
            <span className="summary-value">{stats.total}</span>
          </div>
          <div className="summary-item correct">
            <span className="summary-label">正解数</span>
            <span className="summary-value">{stats.correct}</span>
          </div>
          <div className="summary-item incorrect">
            <span className="summary-label">不正解数</span>
            <span className="summary-value">{stats.incorrect}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">正解率</span>
            <span className="summary-value">
              {stats.rate}
              <span className="unit">%</span>
            </span>
          </div>
        </div>

        {/* 正解率バー */}
        {stats.total > 0 && (
          <div className="rate">
            <div className="rate-bar">
              <div
                className="rate-bar-fill"
                style={{ width: `${stats.rate}%` }}
              />
            </div>
            <div className="rate-legend">
              <span className="rate-legend-ok">正解 {stats.rate}%</span>
              <span className="rate-legend-ng">不正解 {100 - stats.rate}%</span>
            </div>
          </div>
        )}
      </section>

      {/* 間違えた単語一覧 */}
      {mistakeWords.length > 0 && (
        <div className="mistakes-section">
          <div className="mistakes-header">
            <h2>
              間違えた単語
              <span className="badge badge-ng badge-num">{mistakeWords.length}</span>
            </h2>
            {reviewCount > 0 && (
              <button className="btn-warn" onClick={onReview}>
                この {reviewCount} 語を復習する
                <ArrowIcon size={16} />
              </button>
            )}
          </div>
          <ul className="mistakes-list">
            {mistakeWords.map((w) => (
              <li key={w.id} className="word-card mistake-item">
                <div className="mistake-body">
                  <div className="word-head">
                    <span className="word-en">{w.english}</span>
                    <span className="word-ja">{w.japanese}</span>
                  </div>
                  <p className="word-example">{w.example}</p>
                  {w.exampleJa && <p className="word-example-ja">{w.exampleJa}</p>}
                </div>
                <div className="mistake-info">
                  <span className="badge badge-ok badge-num">
                    <CircleIcon size={14} />
                    {w.correct}
                  </span>
                  <span className="badge badge-ng badge-num">
                    <XIcon size={14} />
                    {w.incorrect}
                  </span>
                  {w.streak > 0 && (
                    <span className="badge badge-ok">{w.streak}連続正解</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {stats.total === 0 && (
        <p className="stats-empty">まだ回答記録がありません。クイズを始めましょう！</p>
      )}

      {stats.total > 0 && (
        <button className="btn-danger reset-btn" onClick={handleReset}>
          記録をリセット
        </button>
      )}
    </div>
  );
}
