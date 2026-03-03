import mongoose, { Schema, Document } from "mongoose";

export interface ISiteConfig extends Document {
  siteName: string;
  person1Name: string;
  person2Name: string;
  startDate: Date;
  couplePhoto: string;
  heroMessage: string;
  footerMessage: string;
  backgroundMusicUrl: string;
  backgroundMusicTitle: string;
  autoplayMusic: boolean;
  primaryColor: string;
  createdAt: Date;
  updatedAt: Date;
}

const siteConfigSchema = new Schema<ISiteConfig>(
  {
    siteName: { type: String, default: "Our Love" },
    person1Name: { type: String, default: "Anh" },
    person2Name: { type: String, default: "Em" },
    startDate: { type: Date, default: new Date() },
    couplePhoto: { type: String, default: "" },
    heroMessage: { type: String, default: "Mãi bên nhau..." },
    footerMessage: { type: String, default: "Made with love" },
    backgroundMusicUrl: { type: String, default: "" },
    backgroundMusicTitle: { type: String, default: "" },
    autoplayMusic: { type: Boolean, default: false },
    primaryColor: { type: String, default: "#f43f5e" },
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

export const SiteConfig = mongoose.model<ISiteConfig>(
  "SiteConfig",
  siteConfigSchema
);
