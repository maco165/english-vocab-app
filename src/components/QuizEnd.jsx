import { useState, useCallback } from "react";
import words from "../data/words";
import { saveResult } from "../utils/storage";
import Result from "./Result";
import { CircleIcon, RefreshIcon, XIcon } from "./icons";
import { Theme } from "@astryxdesign/core/theme";
import { neutralTheme } from "@astryxdesign/theme-neutral/built";
import { Stack } from "@astryxdesign/core/Stack";
import { Grid } from "@astryxdesign/core/Grid";
import { Card } from "@astryxdesign/core/Card";
import { Heading, Text } from "@astryxdesign/core/Text";
import { ProgressBar } from "@astryxdesign/core/ProgressBar";
import { Button } from "@astryxdesign/core/Button";
import { List, ListItem } from "@astryxdesign/core/List";
import { Banner } from "@astryxdesign/core/Banner";
import "./Quiz.css";
import "./Review.css";

// 結果画面だけを Astryx で描く。アプリにダークモードが無いのでライトに固定する。
// 幅は置き換え前の .quiz-end と同じ最大 720px で中央に置く。
function AstryxScope({ children }) {
  return (
    <Theme theme={neutralTheme} mode="light">
      <Stack hAlign="center">
        <Stack width="100%" maxWidth={720}>
          {children}
        </Stack>
      </Stack>
    </Theme>
  );
}

function Stat({ value, label }) {
  return (
    <Card>
      <Stack gap={1}>
        <Text type="display-2">{value}</Text>
        <Text type="supporting">{label}</Text>
      </Stack>
    </Card>
  );
}

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
        <div className="review-banner">
          <div className="review-banner-main">
            <span className="review-banner-icon">
              <RefreshIcon size={18} />
            </span>
            <div className="review-banner-text">
              <p className="review-banner-title">間違えた問題を復習中</p>
            </div>
          </div>
          <span className="review-remaining">
            残り {remainingMistakes.length} 語
          </span>
        </div>

        <div className="quiz-question">
          <p className="quiz-label">この英単語の意味は？</p>
          <h1 className="quiz-word">{question.correctWord.english}</h1>
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
      <AstryxScope>
        <Stack gap={4}>
          <Banner
            status="success"
            title="復習完了！"
            description="間違えた問題をすべて正解しました"
          />
          <Stack direction="horizontal" gap={2} wrap="wrap">
            <Button variant="primary" label="もう一度挑戦" onClick={onRetry} />
            <Button variant="ghost" label="モード選択へ" onClick={onBack} />
          </Stack>
        </Stack>
      </AstryxScope>
    );
  }

  // 結果画面
  const hasMistakes = mistakes.length > 0;
  return (
    <AstryxScope>
      <Stack gap={6}>
        <Heading level={1}>クイズ終了！</Heading>
        <Grid columns={{ minWidth: 140, max: 2 }} gap={3}>
          <Stat value={correct} label="正解" />
          <Stat value={incorrect} label="不正解" />
        </Grid>
        <ProgressBar
          label="正解率"
          value={rate}
          hasValueLabel
          variant={rate >= 80 ? "success" : "accent"}
        />
        <Stack direction="horizontal" gap={2} wrap="wrap">
          {hasMistakes && (
            <Button
              variant="primary"
              label={`間違えた問題を復習 (${mistakes.length}問)`}
              onClick={startReview}
            />
          )}
          <Button
            variant={hasMistakes ? "secondary" : "primary"}
            label="もう一度挑戦"
            onClick={onRetry}
          />
          <Button variant="ghost" label="モード選択へ" onClick={onBack} />
        </Stack>
        {hasMistakes && (
          <List header={`間違えた単語 (${mistakes.length}問)`} hasDividers>
            {mistakes.map((w) => (
              <ListItem
                key={w.id}
                label={w.english}
                description={
                  <Stack gap={0.5}>
                    <Text>{w.japanese}</Text>
                    <Text type="supporting">{w.example}</Text>
                    {w.exampleJa && <Text type="supporting">{w.exampleJa}</Text>}
                  </Stack>
                }
              />
            ))}
          </List>
        )}
      </Stack>
    </AstryxScope>
  );
}
