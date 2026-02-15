import { useState, useCallback } from "react";
import words from "../data/words";
import { saveResult } from "../utils/storage";
import Result from "./Result";
import QuizEnd from "./QuizEnd";
import "./Quiz.css";

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateQuestion(usedIds) {
  const available = words.filter((w) => !usedIds.has(w.id));
  if (available.length === 0) return null;

  const correctWord = available[Math.floor(Math.random() * available.length)];
  const others = words.filter((w) => w.id !== correctWord.id);
  const shuffledOthers = shuffleArray(others);
  const wrongChoices = shuffledOthers.slice(0, 3);
  const choices = shuffleArray([correctWord, ...wrongChoices]);

  return { correctWord, choices };
}

// モード選択画面
function QuizStart({ onStart }) {
  const [customCount, setCustomCount] = useState(50);

  return (
    <div className="quiz-start">
      <h2>クイズモード選択</h2>
      <p className="quiz-start-desc">問題数を選んでスタートしましょう</p>

      <div className="mode-buttons">
        <button className="mode-btn" onClick={() => onStart(30)}>
          <span className="mode-count">30</span>
          <span className="mode-label">問モード</span>
        </button>
        <button className="mode-btn" onClick={() => onStart(100)}>
          <span className="mode-count">100</span>
          <span className="mode-label">問モード</span>
        </button>
        <button className="mode-btn full" onClick={() => onStart(words.length)}>
          <span className="mode-count">{words.length}</span>
          <span className="mode-label">全問モード</span>
        </button>
      </div>

      <div className="mode-custom">
        <label className="custom-label">カスタム</label>
        <div className="custom-input-row">
          <input
            type="number"
            className="custom-input"
            min={1}
            max={words.length}
            value={customCount}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v)) setCustomCount(Math.min(Math.max(v, 1), words.length));
            }}
          />
          <span className="custom-suffix">問</span>
          <button
            className="custom-start-btn"
            onClick={() => onStart(customCount)}
          >
            スタート
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Quiz() {
  const [phase, setPhase] = useState("start"); // "start" | "playing" | "end"
  const [totalCount, setTotalCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [usedIds, setUsedIds] = useState(new Set());
  const [question, setQuestion] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [sessionMistakes, setSessionMistakes] = useState([]);
  const [sessionCorrect, setSessionCorrect] = useState(0);

  const handleStart = (count) => {
    const newUsed = new Set();
    const q = generateQuestion(newUsed);
    setTotalCount(count);
    setCurrentIndex(0);
    setUsedIds(newUsed);
    setQuestion(q);
    setSelectedId(null);
    setIsAnswered(false);
    setSessionMistakes([]);
    setSessionCorrect(0);
    setPhase("playing");
  };

  const handleSelect = (choice) => {
    if (isAnswered) return;
    setSelectedId(choice.id);
    setIsAnswered(true);
    const isCorrect = choice.id === question.correctWord.id;
    saveResult(question.correctWord.id, isCorrect);
    if (isCorrect) {
      setSessionCorrect((c) => c + 1);
    } else {
      setSessionMistakes((m) => [...m, question.correctWord]);
    }
  };

  const handleNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= totalCount) {
      setPhase("end");
      return;
    }
    const newUsed = new Set(usedIds);
    newUsed.add(question.correctWord.id);
    setUsedIds(newUsed);
    setQuestion(generateQuestion(newUsed));
    setCurrentIndex(nextIndex);
    setSelectedId(null);
    setIsAnswered(false);
  }, [currentIndex, totalCount, usedIds, question]);

  if (phase === "start") {
    return <QuizStart onStart={handleStart} />;
  }

  if (phase === "end") {
    return (
      <QuizEnd
        total={totalCount}
        correct={sessionCorrect}
        mistakes={sessionMistakes}
        onRetry={() => handleStart(totalCount)}
        onBack={() => setPhase("start")}
      />
    );
  }

  const isCorrect = selectedId === question?.correctWord.id;

  return (
    <div className="quiz">
      <div className="quiz-progress">
        <span>
          {currentIndex + 1} / {totalCount}
        </span>
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
          />
        </div>
      </div>

      <div className="quiz-question">
        <p className="quiz-label">この英単語の意味は？</p>
        <h2 className="quiz-word">{question?.correctWord.english}</h2>
      </div>

      <div className="quiz-choices">
        {question?.choices.map((choice) => {
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
