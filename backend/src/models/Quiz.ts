import mongoose, { Schema, Document } from "mongoose";

export interface IQuiz extends Document {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const quizSchema = new Schema<IQuiz>(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true, min: 0 },
    explanation: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

quizSchema.index({ order: 1 });

export const Quiz = mongoose.model<IQuiz>("Quiz", quizSchema);
