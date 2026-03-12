import mongoose, { Schema, Document } from "mongoose";

export interface IAlbum extends Document {
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  order: number;
  photoCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const albumSchema = new Schema<IAlbum>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    order: { type: Number, default: 0 },
    photoCount: { type: Number, default: 0 },
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

albumSchema.index({ order: 1 });

export const Album = mongoose.model<IAlbum>("Album", albumSchema);
