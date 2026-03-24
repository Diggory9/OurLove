import { Request, Response, NextFunction } from "express";
import { Quiz } from "../models/Quiz";
import { AppError } from "../middleware/errorHandler";

export async function getAllQuizzes(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const quizzes = await Quiz.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: quizzes });
  } catch (err) {
    next(err);
  }
}

export async function getQuizById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      throw new AppError("Không tìm thấy câu hỏi", 404);
    }
    res.json({ success: true, data: quiz });
  } catch (err) {
    next(err);
  }
}

export async function createQuiz(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { question, options, correctAnswer, explanation, order } = req.body;
    if (!question || !options || options.length < 2 || correctAnswer === undefined) {
      throw new AppError("Câu hỏi, đáp án (ít nhất 2) và đáp án đúng là bắt buộc", 400);
    }
    if (correctAnswer < 0 || correctAnswer >= options.length) {
      throw new AppError("Đáp án đúng không hợp lệ", 400);
    }

    const quiz = await Quiz.create({
      question,
      options,
      correctAnswer,
      explanation: explanation || "",
      order: order || 0,
    });

    res.status(201).json({ success: true, data: quiz });
  } catch (err) {
    next(err);
  }
}

export async function updateQuiz(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!quiz) {
      throw new AppError("Không tìm thấy câu hỏi", 404);
    }
    res.json({ success: true, data: quiz });
  } catch (err) {
    next(err);
  }
}

export async function deleteQuiz(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      throw new AppError("Không tìm thấy câu hỏi", 404);
    }
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
