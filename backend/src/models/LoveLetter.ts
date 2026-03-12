import mongoose, { Schema, Document } from "mongoose";

export interface ILoveLetter extends Document {
  title: string;
  slug: string;
  content: string;
  author: string;
  recipient: string;
  scheduledAt: Date | null;
  isVisible: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const loveLetterSchema = new Schema<ILoveLetter>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    author: { type: String, default: "" },
    recipient: { type: String, default: "" },
    scheduledAt: { type: Date, default: null },
    isVisible: { type: Boolean, default: true },
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

loveLetterSchema.index({ slug: 1 });
loveLetterSchema.index({ scheduledAt: 1 });
loveLetterSchema.index({ order: 1 });

export const LoveLetter = mongoose.model<ILoveLetter>(
  "LoveLetter",
  loveLetterSchema
);
