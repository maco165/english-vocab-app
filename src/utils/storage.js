const STORAGE_KEY = "vocab-quiz-results";

export function getResults() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveResult(wordId, isCorrect) {
  const results = getResults();
  results.push({
    wordId,
    isCorrect,
    timestamp: Date.now(),
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

export function getStats() {
  const results = getResults();
  const total = results.length;
  const correct = results.filter((r) => r.isCorrect).length;
  const incorrect = total - correct;
  const rate = total > 0 ? Math.round((correct / total) * 100) : 0;

  // 単語ごとの統計（連続正解数を含む）
  const wordStats = {};
  results.forEach((r) => {
    if (!wordStats[r.wordId]) {
      wordStats[r.wordId] = { correct: 0, incorrect: 0, streak: 0 };
    }
    if (r.isCorrect) {
      wordStats[r.wordId].correct++;
      wordStats[r.wordId].streak++;
    } else {
      wordStats[r.wordId].incorrect++;
      wordStats[r.wordId].streak = 0;
    }
  });

  return { total, correct, incorrect, rate, wordStats };
}

// 間違えたことがある単語IDのリストを返す（連続正解中のものは除外可能）
export function getMistakeWordIds() {
  const { wordStats } = getStats();
  return Object.entries(wordStats)
    .filter(([, s]) => s.incorrect > 0 && s.streak === 0)
    .map(([id]) => Number(id));
}

export function resetResults() {
  localStorage.removeItem(STORAGE_KEY);
}
