import type { Album, Photo, TimelineEvent, SiteConfig, Music, LoveLetter, BucketItem, SpecialDay, SearchResult, Place, QuizQuestion, DateIdea } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const REVALIDATE = 60;

import siteJson from "@/data/site.json";

const fallbackSiteConfig = siteJson as SiteConfig;

async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: REVALIDATE },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as T;
  } catch {
    return null;
  }
}

// --- Site Config ---

export async function getSiteConfig(): Promise<SiteConfig> {
  const data = await apiFetch<SiteConfig>("/api/site-config");
  return data || fallbackSiteConfig;
}

// --- Albums ---

export async function getAllAlbums(): Promise<Album[]> {
  const data = await apiFetch<Album[]>("/api/albums");
  return data || [];
}

export async function getAlbumBySlug(slug: string): Promise<Album | undefined> {
  const data = await apiFetch<Album>(`/api/albums/${slug}`);
  return data || undefined;
}

// --- Photos ---

export async function getFeaturedPhotos(): Promise<Photo[]> {
  const data = await apiFetch<Photo[]>("/api/photos/featured");
  return data || [];
}

export async function getPhotosByAlbumSlug(slug: string): Promise<Photo[]> {
  const data = await apiFetch<Photo[]>(`/api/photos/album/${slug}`);
  return data || [];
}

// --- Timeline ---

export async function getAllTimelineEvents(): Promise<TimelineEvent[]> {
  const data = await apiFetch<TimelineEvent[]>("/api/timeline");
  return data || [];
}

export async function getLatestTimelineEvents(): Promise<TimelineEvent[]> {
  const data = await apiFetch<TimelineEvent[]>("/api/timeline/latest");
  return data || [];
}

export async function getTimelineEventBySlug(slug: string): Promise<TimelineEvent | undefined> {
  const data = await apiFetch<TimelineEvent>(`/api/timeline/${slug}`);
  return data || undefined;
}

// --- Music ---

export async function getAllMusic(): Promise<Music[]> {
  const data = await apiFetch<Music[]>("/api/music");
  return data || [];
}

// --- Love Letters ---

export async function getAllLoveLetters(): Promise<LoveLetter[]> {
  const data = await apiFetch<LoveLetter[]>("/api/love-letters");
  return data || [];
}

export async function getLoveLetterBySlug(slug: string): Promise<LoveLetter | undefined> {
  const data = await apiFetch<LoveLetter>(`/api/love-letters/${slug}`);
  return data || undefined;
}

// --- Bucket List ---

export async function getAllBucketItems(): Promise<BucketItem[]> {
  const data = await apiFetch<BucketItem[]>("/api/bucket-list");
  return data || [];
}

// --- Special Days ---

export async function getAllSpecialDays(): Promise<SpecialDay[]> {
  const data = await apiFetch<SpecialDay[]>("/api/special-days");
  return data || [];
}

export async function getUpcomingSpecialDays(): Promise<SpecialDay[]> {
  const data = await apiFetch<SpecialDay[]>("/api/special-days/upcoming");
  return data || [];
}

// --- Places ---

export async function getAllPlaces(): Promise<Place[]> {
  const data = await apiFetch<Place[]>("/api/places");
  return data || [];
}

// --- Quiz ---

export async function getAllQuizzes(): Promise<QuizQuestion[]> {
  const data = await apiFetch<QuizQuestion[]>("/api/quiz");
  return data || [];
}

// --- Date Ideas ---

export async function getAllDateIdeas(): Promise<DateIdea[]> {
  const data = await apiFetch<DateIdea[]>("/api/date-ideas");
  return data || [];
}

export async function getRandomDateIdea(): Promise<DateIdea | null> {
  const data = await apiFetch<DateIdea>("/api/date-ideas/random");
  return data || null;
}

// --- Search ---

export async function searchContent(query: string): Promise<SearchResult | null> {
  const data = await apiFetch<SearchResult>(`/api/search?q=${encodeURIComponent(query)}`);
  return data || null;
}
