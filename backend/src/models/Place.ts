import mongoose, { Schema, Document } from "mongoose";

export interface IPlace extends Document {
  title: string;
  description: string;
  lat: number;
  lng: number;
  image: string;
  date: Date;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const placeSchema = new Schema<IPlace>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    image: { type: String, default: "" },
    date: { type: Date },
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

placeSchema.index({ order: 1 });

export const Place = mongoose.model<IPlace>("Place", placeSchema);
