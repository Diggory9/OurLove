import { Request, Response, NextFunction } from "express";
import { Photo } from "../models/Photo";
import { TimelineEvent } from "../models/TimelineEvent";
import { LoveLetter } from "../models/LoveLetter";
import { BucketList } from "../models/BucketList";

export async function getOnThisDay(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const now = new Date();
    const month = now.getMonth(); // 0-11
    const day = now.getDate();

    // Query photos taken on this day in previous years
    const photos = await Photo.find().populate("albumId", "title slug");
    const matchedPhotos = photos.filter((p) => {
      if (!p.dateTaken) return false;
      const d = new Date(p.dateTaken);
      return d.getMonth() === month && d.getDate() === day && d.getFullYear() < now.getFullYear();
    });

    // Query timeline events on this day
    const events = await TimelineEvent.find();
    const matchedEvents = events.filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getDate() === day && d.getFullYear() < now.getFullYear();
    });

    // Query love letters created on this day
    const letters = await LoveLetter.find({ isVisible: true });
    const matchedLetters = letters.filter((l) => {
      const d = new Date(l.createdAt);
      return d.getMonth() === month && d.getDate() === day && d.getFullYear() < now.getFullYear();
    });

    // Query bucket list items completed on this day
    const bucketItems = await BucketList.find({ completed: true });
    const matchedBucket = bucketItems.filter((b) => {
      if (!b.completedDate) return false;
      const d = new Date(b.completedDate);
      return d.getMonth() === month && d.getDate() === day && d.getFullYear() < now.getFullYear();
    });

    const hasMemories =
      matchedPhotos.length > 0 ||
      matchedEvents.length > 0 ||
      matchedLetters.length > 0 ||
      matchedBucket.length > 0;

    res.json({
      success: true,
      data: {
        date: { month: month + 1, day },
        photos: matchedPhotos,
        events: matchedEvents,
        letters: matchedLetters,
        bucketItems: matchedBucket,
        hasMemories,
      },
    });
  } catch (err) {
    next(err);
  }
}
