import mongoose, { Schema, Document } from "mongoose";

export interface ITimelineEvent extends Document {
  title: string;
  slug: string;
  date: Date;
  description: string;
  icon: string;
  image: string;
  images: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const timelineEventSchema = new Schema<ITimelineEvent>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
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

timelineEventSchema.index({ slug: 1 });
timelineEventSchema.index({ date: -1 });

export const TimelineEvent = mongoose.model<ITimelineEvent>(
  "TimelineEvent",
  timelineEventSchema
);
