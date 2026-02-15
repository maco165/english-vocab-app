import { useState, useCallback } from "react";
import words from "../data/words";
import { saveResult, getMistakeWordIds } from "../utils/storage";
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
        <div className="review-empty-icon">&#10003;</div>
        <h2>復習する単語がありません</h2>
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
        <div className="review-empty-icon">&#10003;</div>
        <h2>すべて復習完了！</h2>
        <p>間違えた単語をすべて正解しました。</p>
      </div>
    );
  }

  const isCorrect = selectedId === question.correctWord.id;

  return (
    <div className="quiz">
      <div className="review-badge">
        復習モード — 残り {reviewWords.length} 語
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
