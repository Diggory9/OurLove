import mongoose, { Schema, Document } from "mongoose";

export interface ISpecialDay extends Document {
  title: string;
  date: Date;
  type: "birthday" | "anniversary" | "valentine" | "custom";
  recurring: boolean;
  description: string;
  icon: string;
  notifyBefore: number;
  createdAt: Date;
  updatedAt: Date;
}

const specialDaySchema = new Schema<ISpecialDay>(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    type: {
      type: String,
      enum: ["birthday", "anniversary", "valentine", "custom"],
      default: "custom",
    },
    recurring: { type: Boolean, default: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    notifyBefore: { type: Number, default: 7 },
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

specialDaySchema.index({ date: 1 });
specialDaySchema.index({ type: 1 });

export const SpecialDay = mongoose.model<ISpecialDay>(
  "SpecialDay",
  specialDaySchema
);
