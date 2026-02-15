import { useState, useCallback } from "react";
import words from "../data/words";
import { saveResult } from "../utils/storage";
import Result from "./Result";
import "./Quiz.css";
import "./Review.css";

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateQuestionFrom(targetWords) {
  if (targetWords.length === 0) return null;
  const correctWord =
    targetWords[Math.floor(Math.random() * targetWords.length)];
  const others = words.filter((w) => w.id !== correctWord.id);
  const shuffledOthers = shuffleArray(others);
  const wrongChoices = shuffledOthers.slice(0, 3);
  const choices = shuffleArray([correctWord, ...wrongChoices]);
  return { correctWord, choices };
}

export default function QuizEnd({ total, correct, mistakes, onRetry, onBack }) {
  const [reviewMode, setReviewMode] = useState(false);
  const [remainingMistakes, setRemainingMistakes] = useState(mistakes);
  const [question, setQuestion] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const incorrect = total - correct;
  const rate = total > 0 ? Math.round((correct / total) * 100) : 0;
  const rateClass = rate >= 80 ? "high" : rate >= 50 ? "mid" : "low";

  const startReview = () => {
    setReviewMode(true);
    setRemainingMistakes(mistakes);
    setQuestion(generateQuestionFrom(mistakes));
    setSelectedId(null);
    setIsAnswered(false);
  };

  const handleSelect = (choice) => {
    if (isAnswered) return;
    setSelectedId(choice.id);
    setIsAnswered(true);
    const isCorrect = choice.id === question.correctWord.id;
    saveResult(question.correctWord.id, isCorrect);
    if (isCorrect) {
      setRemainingMistakes((prev) =>
        prev.filter((w) => w.id !== question.correctWord.id)
      );
    }
  };

  const handleNext = useCallback(() => {
    const updated = remainingMistakes.filter(
      (w) => w.id !== question.correctWord.id
    );
    if (updated.length === 0) {
      setReviewMode(false);
      setRemainingMistakes([]);
      return;
    }
    setQuestion(generateQuestionFrom(updated));
    setSelectedId(null);
    setIsAnswered(false);
  }, [remainingMistakes, question]);

  // 復習モード中
  if (reviewMode && question) {
    const isCorrect = selectedId === question.correctWord.id;
    return (
      <div className="quiz">
        <div className="review-badge">
          間違えた問題を復習中 — 残り {remainingMistakes.length} 語
        </div>

        <div className="quiz-question">
          <p className="quiz-label">この英単語の意味は？</p>
          <h2 className="quiz-word">{question.correctWord.english}</h2>
        </div>

        <div className="quiz-choices">
          {question.choices.map((choice) => {
            let className = "choice-btn";
            if (isAnswered) {
              if (choice.id === question.correctWord.id) {
                className += " correct";
              } else if (choice.id === selectedId) {
                className += " incorrect";
              }
            }
            return (
              <button
                key={choice.id}
                className={className}
                onClick={() => handleSelect(choice)}
                disabled={isAnswered}
              >
                {choice.japanese}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <Result
            isCorrect={isCorrect}
            correctWord={question.correctWord}
            onNext={handleNext}
          />
        )}
      </div>
    );
  }

  // 復習完了メッセージ
  if (reviewMode && !question) {
    return (
      <div className="quiz-end">
        <div className="quiz-end-header">
          <h2>復習完了！</h2>
          <p style={{ color: "#4ade80", margin: 0 }}>
            間違えた問題をすべて正解しました
          </p>
        </div>
        <div className="end-actions">
          <button className="end-btn primary" onClick={onRetry}>
            もう一度挑戦
          </button>
          <button className="end-btn secondary" onClick={onBack}>
            モード選択へ
          </button>
        </div>
      </div>
    );
  }

  // 結果画面
  return (
    <div className="quiz-end">
      <div className="quiz-end-header">
        <h2>クイズ終了！</h2>
        <div className="end-stats">
          <div className="end-stat">
            <span className="end-stat-value correct">{correct}</span>
            <span className="end-stat-label">正解</span>
          </div>
          <div className="end-stat">
            <span className="end-stat-value incorrect">{incorrect}</span>
            <span className="end-stat-label">不正解</span>
          </div>
          <div className="end-stat">
            <span className="end-stat-value rate">{rate}%</span>
            <span className="end-stat-label">正解率</span>
          </div>
        </div>
        <div className="end-rate-bar">
          <div
            className={`end-rate-fill ${rateClass}`}
            style={{ width: `${rate}%` }}
          />
        </div>
      </div>

      <div className="end-actions">
        <button className="end-btn primary" onClick={onRetry}>
          もう一度挑戦
        </button>
        {mistakes.length > 0 && (
          <button className="end-btn review" onClick={startReview}>
            間違えた問題を復習 ({mistakes.length}問)
          </button>
        )}
        <button className="end-btn secondary" onClick={onBack}>
          モード選択へ
        </button>
      </div>

      {mistakes.length > 0 && (
        <div className="end-mistakes">
          <h3>間違えた単語 ({mistakes.length}問)</h3>
          {mistakes.map((w) => (
            <div key={w.id} className="end-mistake-item">
              <div className="end-mistake-main">
                <strong>{w.english}</strong>
                <span>{w.japanese}</span>
              </div>
              <p className="end-mistake-example">{w.example}</p>
              {w.exampleJa && <p className="end-mistake-example-ja">{w.exampleJa}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
