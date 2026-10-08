import { ArrowIcon, CircleIcon, XIcon } from "./icons";
import "./Result.css";

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Wrap words in the example that start with the target word (case-insensitive).
function highlightWord(sentence, word) {
  if (!sentence || !word) return sentence;
  const pattern = new RegExp(`\\b(${escapeRegExp(word)}[a-zA-Z]*)`, "gi");
  const parts = sentence.split(pattern);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="hl">
        {part}
      </span>
    ) : (
      part
    )
  );
}

export default function Result({ isCorrect, correctWord, onNext }) {
  return (
    <div className={`result ${isCorrect ? "result-correct" : "result-incorrect"}`}>
      <div className="result-head">
        <span className="result-icon">
          {isCorrect ? <CircleIcon size={22} /> : <XIcon size={22} />}
        </span>
        <div className="result-head-text">
          <p className="result-title">
            {isCorrect ? "正解！" : "おしい、不正解"}
          </p>
          <p className="result-answer">
            正解は <strong>{correctWord.english}</strong> ＝ {correctWord.japanese}
          </p>
        </div>
      </div>
      <div className="example-box">
        <p className="example-label">例文</p>
        <p className="example-en">
          {highlightWord(correctWord.example, correctWord.english)}
        </p>
        {correctWord.exampleJa && (
          <p className="example-ja">{correctWord.exampleJa}</p>
        )}
      </div>
      <div className="result-actions">
        <button className="btn-primary next-btn" onClick={onNext}>
          次の問題へ
          <ArrowIcon size={18} />
        </button>
      </div>
    </div>
  );
}
