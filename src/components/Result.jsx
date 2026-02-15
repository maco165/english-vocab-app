import "./Result.css";

export default function Result({ isCorrect, correctWord, onNext }) {
  return (
    <div className={`result ${isCorrect ? "result-correct" : "result-incorrect"}`}>
      <div className="result-icon">{isCorrect ? "○" : "×"}</div>
      <p className="result-text">
        {isCorrect ? "正解！" : "不正解..."}
      </p>
      {!isCorrect && (
        <p className="result-answer">
          正解: <strong>{correctWord.english}</strong> = {correctWord.japanese}
        </p>
      )}
      <p className="result-example">
        <span className="example-label">例文:</span> {correctWord.example}
      </p>
      {correctWord.exampleJa && (
        <p className="result-example-ja">{correctWord.exampleJa}</p>
      )}
      <button className="next-btn" onClick={onNext}>
        次の問題へ
      </button>
    </div>
  );
}
