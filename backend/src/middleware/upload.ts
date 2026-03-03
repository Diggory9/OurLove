import multer from "multer";
import { AppError } from "./errorHandler";

const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/aac",
  "audio/m4a",
  "audio/x-m4a",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_AUDIO_SIZE = 20 * 1024 * 1024; // 20MB

function imageFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  if (IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Chỉ cho phép JPEG, PNG, WebP, AVIF", 400));
  }
}

function audioFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  if (AUDIO_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Chỉ cho phép MP3, WAV, OGG, AAC, M4A", 400));
  }
}

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFilter,
  limits: { fileSize: MAX_IMAGE_SIZE },
});

export const uploadAudio = multer({
  storage: multer.memoryStorage(),
  fileFilter: audioFilter,
  limits: { fileSize: MAX_AUDIO_SIZE },
});
