import { useState } from "react";
import words from "../data/words";
import { getStats, resetResults } from "../utils/storage";
import "./Stats.css";

export default function Stats() {
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

  return (
    <div className="stats">
      <div className="stats-header">
        <h2>学習統計</h2>
        <button className="refresh-btn" onClick={refresh}>
          更新
        </button>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">総回答数</span>
        </div>
        <div className="stat-card correct">
          <span className="stat-value">{stats.correct}</span>
          <span className="stat-label">正解数</span>
        </div>
        <div className="stat-card incorrect">
          <span className="stat-value">{stats.incorrect}</span>
          <span className="stat-label">不正解数</span>
        </div>
        <div className="stat-card rate">
          <span className="stat-value">{stats.rate}%</span>
          <span className="stat-label">正解率</span>
        </div>
      </div>

      {/* 正解率バー */}
      {stats.total > 0 && (
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${stats.rate}%` }}
          />
        </div>
      )}

      {/* 間違えた単語一覧 */}
      {mistakeWords.length > 0 && (
        <div className="mistakes-section">
          <h3>間違えた単語</h3>
          <div className="mistakes-list">
            {mistakeWords.map((w) => (
              <div key={w.id} className="mistake-item">
                <div className="mistake-top">
                  <div className="mistake-word">
                    <strong>{w.english}</strong>
                    <span>{w.japanese}</span>
                  </div>
                  <div className="mistake-info">
                    <div className="mistake-counts">
                      <span className="count-correct">○ {w.correct}</span>
                      <span className="count-incorrect">× {w.incorrect}</span>
                    </div>
                    {w.streak > 0 ? (
                      <span className="streak-badge mastered">
                        {w.streak}連続正解
                      </span>
                    ) : (
                      <span className="streak-badge needs-review">
                        要復習
                      </span>
                    )}
                  </div>
                </div>
                <p className="mistake-example">{w.example}</p>
                {w.exampleJa && <p className="mistake-example-ja">{w.exampleJa}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.total === 0 && (
        <p className="stats-empty">まだ回答記録がありません。クイズを始めましょう！</p>
      )}

      {stats.total > 0 && (
        <button className="reset-btn" onClick={handleReset}>
          記録をリセット
        </button>
      )}
    </div>
  );
}
