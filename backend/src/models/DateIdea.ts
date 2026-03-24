import mongoose, { Schema, Document } from "mongoose";

export interface IDateIdea extends Document {
  title: string;
  description: string;
  category: string;
  image: string;
  estimatedCost: string;
  duration: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const dateIdeaSchema = new Schema<IDateIdea>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "general" },
    image: { type: String, default: "" },
    estimatedCost: { type: String, default: "" },
    duration: { type: String, default: "" },
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

dateIdeaSchema.index({ order: 1, category: 1 });

export const DateIdea = mongoose.model<IDateIdea>("DateIdea", dateIdeaSchema);
