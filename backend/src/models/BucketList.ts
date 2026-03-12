import mongoose, { Schema, Document } from "mongoose";

export interface IBucketList extends Document {
  title: string;
  description: string;
  completed: boolean;
  completedDate: Date | null;
  completedImage: string;
  category: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const bucketListSchema = new Schema<IBucketList>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    completed: { type: Boolean, default: false },
    completedDate: { type: Date, default: null },
    completedImage: { type: String, default: "" },
    category: { type: String, default: "" },
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

bucketListSchema.index({ completed: 1, order: 1 });
bucketListSchema.index({ category: 1 });

export const BucketList = mongoose.model<IBucketList>(
  "BucketList",
  bucketListSchema
);
