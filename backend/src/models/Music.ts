import mongoose, { Schema, Document } from "mongoose";

export interface IMusic extends Document {
  title: string;
  artist: string;
  url: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const musicSchema = new Schema<IMusic>(
  {
    title: { type: String, required: true },
    artist: { type: String, default: "" },
    url: { type: String, required: true },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
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

musicSchema.index({ order: 1 });
musicSchema.index({ active: 1 });

export const Music = mongoose.model<IMusic>("Music", musicSchema);
