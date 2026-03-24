"use client";

import { useState, useCallback } from "react";
import type { QuizQuestion } from "@/types";
import { cn } from "@/lib/utils";

interface QuizGameProps {
  questions: QuizQuestion[];
  person1Name: string;
  person2Name: string;
}

export default function QuizGame({ questions, person1Name, person2Name }: QuizGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const question = questions[currentIndex];

  const handleSelect = useCallback((optionIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIndex);
    setShowResult(true);

    const isCorrect = optionIndex === question.correctAnswer;
    if (isCorrect) {
      setScore((s) => s + 1);
    }
    setAnswers((a) => [...a, isCorrect]);
  }, [selectedAnswer, question]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [currentIndex, questions.length]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
    setAnswers([]);
  }, []);

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    let message = "";
    let emoji = "";
    if (percentage === 100) {
      message = `Tuyệt vời! ${person1Name} & ${person2Name} hiểu nhau hoàn hảo!`;
      emoji = "&#128525;";
    } else if (percentage >= 70) {
      message = `Rất tốt! Hai bạn khá hiểu nhau rồi đó!`;
      emoji = "&#128522;";
    } else if (percentage >= 50) {
      message = `Khá ổn! Còn nhiều điều thú vị để khám phá về nhau!`;
      emoji = "&#128578;";
    } else {
      message = `Hãy dành thêm thời gian tìm hiểu nhau nhé!`;
      emoji = "&#128536;";
    }

    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-6xl mb-4" dangerouslySetInnerHTML={{ __html: emoji }} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Kết quả</h2>
          <div className="mb-6">
            <div className="text-5xl font-bold text-primary-600 mb-2">
              {score}/{questions.length}
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-1000"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-gray-600">{message}</p>
          </div>

          <div className="grid grid-cols-5 gap-2 mb-6">
            {answers.map((correct, i) => (
              <div
                key={i}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold mx-auto",
                  correct ? "bg-green-500" : "bg-red-400"
                )}
              >
                {i + 1}
              </div>
            ))}
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            Chơi lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Câu {currentIndex + 1}/{questions.length}</span>
          <span>Điểm: {score}</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
        <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">
          {question.question}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, i) => {
            let optionStyle = "border-gray-200 hover:border-primary-300 hover:bg-primary-50";
            if (showResult) {
              if (i === question.correctAnswer) {
                optionStyle = "border-green-500 bg-green-50 text-green-800";
              } else if (i === selectedAnswer && i !== question.correctAnswer) {
                optionStyle = "border-red-400 bg-red-50 text-red-800";
              } else {
                optionStyle = "border-gray-200 opacity-50";
              }
            } else if (selectedAnswer === i) {
              optionStyle = "border-primary-500 bg-primary-50";
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={showResult}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium",
                  optionStyle
                )}
              >
                <span className="inline-flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && question.explanation && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
            {question.explanation}
          </div>
        )}
      </div>

      {/* Next button */}
      {showResult && (
        <button
          onClick={handleNext}
          className="w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
        >
          {currentIndex + 1 >= questions.length ? "Xem kết quả" : "Câu tiếp theo"}
        </button>
      )}
    </div>
  );
}
