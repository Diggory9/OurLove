import type { Album, Photo, TimelineEvent, SiteConfig, Music } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const REVALIDATE = 60;

import siteJson from "@/data/site.json";

const fallbackSiteConfig = siteJson as SiteConfig;

async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: REVALIDATE },
    });
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

// --- Music ---

export async function getAllMusic(): Promise<Music[]> {
  const data = await apiFetch<Music[]>("/api/music");
  return data || [];
}
