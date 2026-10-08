import { useState, useCallback } from "react";
import words from "../data/words";
import { saveResult, getMistakeWordIds, getStats } from "../utils/storage";
import Result from "./Result";
import { CheckIcon, CircleIcon, RefreshIcon, XIcon } from "./icons";
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

function generateReviewQuestion(reviewWords) {
  if (reviewWords.length === 0) return null;

  const correctWord =
    reviewWords[Math.floor(Math.random() * reviewWords.length)];

  // 正解以外からランダムに3つ選ぶ（全単語から）
  const others = words.filter((w) => w.id !== correctWord.id);
  const shuffledOthers = shuffleArray(others);
  const wrongChoices = shuffledOthers.slice(0, 3);

  const choices = shuffleArray([correctWord, ...wrongChoices]);
  return { correctWord, choices };
}

export default function Review() {
  const [mistakeIds, setMistakeIds] = useState(() => getMistakeWordIds());
  const reviewWords = words.filter((w) => mistakeIds.includes(w.id));

  const [question, setQuestion] = useState(() =>
    generateReviewQuestion(reviewWords)
  );
  const [selectedId, setSelectedId] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (choice) => {
    if (isAnswered) return;
    setSelectedId(choice.id);
    setIsAnswered(true);
    const isCorrect = choice.id === question.correctWord.id;
    saveResult(question.correctWord.id, isCorrect);
  };

  const handleNext = useCallback(() => {
    const updatedIds = getMistakeWordIds();
    setMistakeIds(updatedIds);
    const updatedWords = words.filter((w) => updatedIds.includes(w.id));
    setQuestion(generateReviewQuestion(updatedWords));
    setSelectedId(null);
    setIsAnswered(false);
  }, []);

  if (reviewWords.length === 0 && !isAnswered) {
    return (
      <div className="review-empty">
        <div className="review-empty-icon">
          <CheckIcon size={32} />
        </div>
        <h1>復習する単語がありません</h1>
        <p>
          間違えた単語がないか、すべて連続正解済みです。
          <br />
          クイズモードで新しい問題に挑戦しましょう！
        </p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="review-empty">
        <div className="review-empty-icon">
          <CheckIcon size={32} />
        </div>
        <h1>すべて復習完了！</h1>
        <p>間違えた単語をすべて正解しました。</p>
      </div>
    );
  }

  const isCorrect = selectedId === question.correctWord.id;

  return (
    <div className="quiz">
      <div className="review-banner">
        <div className="review-banner-main">
          <span className="review-banner-icon">
            <RefreshIcon size={18} />
          </span>
          <div className="review-banner-text">
            <p className="review-banner-title">復習モード</p>
            <p className="review-banner-desc">
              間違えた単語をもう一度。正解すると復習リストから外れます
            </p>
          </div>
        </div>
        <span className="review-remaining">残り {reviewWords.length} 語</span>
      </div>

      <div className="quiz-question">
        <p className="quiz-label">この英単語の意味は？</p>
        <h1 className="quiz-word">{question.correctWord.english}</h1>
        <span className="badge badge-ng review-last">
          前回 <XIcon size={14} />{" "}
          {(getStats().wordStats[question.correctWord.id]?.incorrect ?? 0) -
            (isAnswered && !isCorrect ? 1 : 0)}
          回
        </span>
      </div>

      <div className="quiz-choices">
        {question.choices.map((choice) => {
          let className = "choice-btn";
          let icon = null;
          if (isAnswered) {
            if (choice.id === question.correctWord.id) {
              className += " correct";
              icon = <CircleIcon size={22} />;
            } else if (choice.id === selectedId) {
              className += " incorrect";
              icon = <XIcon size={22} />;
            }
          }
          return (
            <button
              key={choice.id}
              className={className}
              onClick={() => handleSelect(choice)}
              disabled={isAnswered}
            >
              {icon}
              {choice.japanese}
            </button>
          );
        })}
      </div>

      <div className="review-dots" aria-hidden="true">
        {reviewWords.map((w) => (
          <span
            key={w.id}
            className={`review-dot ${
              w.id === question.correctWord.id ? "current" : ""
            }`}
          />
        ))}
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
