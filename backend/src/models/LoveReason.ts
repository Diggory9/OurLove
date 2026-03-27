import mongoose, { Schema, Document } from "mongoose";

export interface ILoveReason extends Document {
  content: string;
  author: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const loveReasonSchema = new Schema<ILoveReason>(
  {
    content: { type: String, required: true },
    author: { type: String, default: "" },
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

loveReasonSchema.index({ order: 1 });

export const LoveReason = mongoose.model<ILoveReason>("LoveReason", loveReasonSchema);
