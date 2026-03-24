"use client";

import { useEffect, useState } from "react";
import { fetchQuizzes, createQuiz, updateQuiz, deleteQuiz } from "@/lib/admin-api";
import type { QuizQuestion } from "@/types";

export default function AdminQuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadQuestions() {
    try {
      const data = await fetchQuizzes();
      setQuestions(data as QuizQuestion[]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadQuestions(); }, []);

  function resetForm() {
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
    setExplanation("");
    setEditingId(null);
    setShowForm(false);
    setError("");
  }

  function startEdit(q: QuizQuestion) {
    setEditingId(q.id);
    setQuestion(q.question);
    setOptions([...q.options, "", "", "", ""].slice(0, 4));
    setCorrectAnswer(q.correctAnswer);
    setExplanation(q.explanation);
    setShowForm(true);
  }

  async function handleSave() {
    const validOptions = options.filter((o) => o.trim());
    if (!question || validOptions.length < 2) {
      setError("Câu hỏi và ít nhất 2 đáp án là bắt buộc");
      return;
    }
    if (correctAnswer >= validOptions.length) {
      setError("Đáp án đúng không hợp lệ");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const data = {
        question,
        options: validOptions,
        correctAnswer,
        explanation,
        order: questions.length,
      };

      if (editingId) {
        await updateQuiz(editingId, data);
      } else {
        await createQuiz(data);
      }
      resetForm();
      loadQuestions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi lưu câu hỏi");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Xóa câu hỏi này?")) return;
    try {
      await deleteQuiz(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi xóa");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quiz tình yêu</h1>
        <button
          onClick={() => { showForm ? resetForm() : setShowForm(true); }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          {showForm ? "Đóng" : "+ Thêm câu hỏi"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Câu hỏi *</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="VD: Món ăn yêu thích của bạn gái là gì?"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Đáp án (ít nhất 2) *</label>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={correctAnswer === i}
                    onChange={() => setCorrectAnswer(i)}
                    className="w-4 h-4 text-primary-600"
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newOptions = [...options];
                      newOptions[i] = e.target.value;
                      setOptions(newOptions);
                    }}
                    placeholder={`Đáp án ${String.fromCharCode(65 + i)}`}
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">Chọn radio để đánh dấu đáp án đúng</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Giải thích (hiển thị sau khi trả lời)</label>
            <input
              type="text"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="VD: Vì bạn gái rất thích phở bò!"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Thêm câu hỏi"}
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-20" />
          ))}
        </div>
      ) : !questions.length ? (
        <p className="text-gray-500 text-center py-12">Chưa có câu hỏi nào.</p>
      ) : (
        <div className="space-y-3">
          {questions.map((q, index) => (
            <div key={q.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm">{q.question}</h3>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {q.options.map((opt, i) => (
                      <span
                        key={i}
                        className={`text-xs px-2 py-0.5 rounded ${
                          i === q.correctAnswer
                            ? "bg-green-100 text-green-700 font-semibold"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(q)}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
