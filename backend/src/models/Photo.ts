import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPhoto extends Document {
  albumId: Types.ObjectId;
  src: string;
  thumbnail: string;
  alt: string;
  caption: string;
  dateTaken: Date | null;
  order: number;
  featured: boolean;
  width: number;
  height: number;
  mediaType: "image" | "video";
  videoUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const photoSchema = new Schema<IPhoto>(
  {
    albumId: { type: Schema.Types.ObjectId, ref: "Album", required: true },
    src: { type: String, required: true },
    thumbnail: { type: String, default: "" },
    alt: { type: String, default: "" },
    caption: { type: String, default: "" },
    dateTaken: { type: Date, default: null },
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    mediaType: { type: String, enum: ["image", "video"], default: "image" },
    videoUrl: { type: String, default: "" },
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

photoSchema.index({ albumId: 1, order: 1 });
photoSchema.index({ featured: 1 });

export const Photo = mongoose.model<IPhoto>("Photo", photoSchema);
