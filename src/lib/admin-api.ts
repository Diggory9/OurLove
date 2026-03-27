const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

function getToken(): string {
  return localStorage.getItem("admin_token") || "";
}

function authHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Lỗi không xác định");
  return data.data;
}

async function revalidateFrontend() {
  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "x-revalidate-secret": process.env.NEXT_PUBLIC_REVALIDATE_SECRET || "ourlove-revalidate" },
    });
  } catch {
    // Ignore revalidation errors
  }
}

// --- Albums ---

export async function fetchAlbums() {
  const res = await fetch(`${API_URL}/api/albums`);
  return handleResponse<unknown[]>(res);
}

export async function fetchAlbum(slug: string) {
  const res = await fetch(`${API_URL}/api/albums/${slug}`);
  return handleResponse(res);
}

export async function createAlbum(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/albums`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function updateAlbum(slug: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/albums/${slug}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function deleteAlbum(slug: string) {
  const res = await fetch(`${API_URL}/api/albums/${slug}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

// --- Photos ---

export async function fetchPhotos(albumId?: string) {
  const query = albumId ? `?albumId=${albumId}` : "";
  const res = await fetch(`${API_URL}/api/photos${query}`);
  return handleResponse<unknown[]>(res);
}

export async function createPhoto(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/photos`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function updatePhoto(id: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/photos/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function deletePhoto(id: string) {
  const res = await fetch(`${API_URL}/api/photos/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

// --- Timeline ---

export async function fetchTimelineEvents() {
  const res = await fetch(`${API_URL}/api/timeline`);
  return handleResponse<unknown[]>(res);
}

export async function fetchTimelineEvent(slug: string) {
  const res = await fetch(`${API_URL}/api/timeline/${slug}`);
  return handleResponse(res);
}

export async function createTimelineEvent(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/timeline`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function updateTimelineEvent(slug: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/timeline/${slug}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function deleteTimelineEvent(slug: string) {
  const res = await fetch(`${API_URL}/api/timeline/${slug}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

// --- Site Config ---

export async function fetchSiteConfig() {
  const res = await fetch(`${API_URL}/api/site-config`);
  return handleResponse(res);
}

export async function updateSiteConfig(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/site-config`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

// --- Music ---

export async function fetchMusic() {
  const res = await fetch(`${API_URL}/api/music/admin`, {
    headers: authHeaders(),
  });
  return handleResponse<unknown[]>(res);
}

export async function createMusic(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/music`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function updateMusicTrack(id: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/music/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function deleteMusicTrack(id: string) {
  const res = await fetch(`${API_URL}/api/music/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

// --- Love Letters ---

export async function fetchLoveLetters() {
  const res = await fetch(`${API_URL}/api/love-letters/admin`, {
    headers: authHeaders(),
  });
  return handleResponse<unknown[]>(res);
}

export async function fetchLoveLetter(slug: string) {
  const res = await fetch(`${API_URL}/api/love-letters/${slug}`);
  return handleResponse(res);
}

export async function createLoveLetter(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/love-letters`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function updateLoveLetter(slug: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/love-letters/${slug}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function deleteLoveLetter(slug: string) {
  const res = await fetch(`${API_URL}/api/love-letters/${slug}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

// --- Bucket List ---

export async function fetchBucketItems() {
  const res = await fetch(`${API_URL}/api/bucket-list`);
  return handleResponse<unknown[]>(res);
}

export async function createBucketItem(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/bucket-list`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function updateBucketItem(id: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/bucket-list/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function toggleBucketItem(id: string) {
  const res = await fetch(`${API_URL}/api/bucket-list/${id}/toggle`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function deleteBucketItem(id: string) {
  const res = await fetch(`${API_URL}/api/bucket-list/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

// --- Special Days ---

export async function fetchSpecialDays() {
  const res = await fetch(`${API_URL}/api/special-days`);
  return handleResponse<unknown[]>(res);
}

export async function createSpecialDay(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/special-days`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function updateSpecialDay(id: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/special-days/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function deleteSpecialDay(id: string) {
  const res = await fetch(`${API_URL}/api/special-days/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

// --- Places ---

export async function fetchPlaces() {
  const res = await fetch(`${API_URL}/api/places`);
  return handleResponse<unknown[]>(res);
}

export async function fetchPlace(id: string) {
  const res = await fetch(`${API_URL}/api/places/${id}`);
  return handleResponse(res);
}

export async function createPlace(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/places`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function updatePlace(id: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/places/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function deletePlace(id: string) {
  const res = await fetch(`${API_URL}/api/places/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

// --- Quiz ---

export async function fetchQuizzes() {
  const res = await fetch(`${API_URL}/api/quiz`);
  return handleResponse<unknown[]>(res);
}

export async function createQuiz(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/quiz`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function updateQuiz(id: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/quiz/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function deleteQuiz(id: string) {
  const res = await fetch(`${API_URL}/api/quiz/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

// --- Date Ideas ---

export async function fetchDateIdeas() {
  const res = await fetch(`${API_URL}/api/date-ideas`);
  return handleResponse<unknown[]>(res);
}

export async function createDateIdea(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/date-ideas`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function updateDateIdea(id: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/date-ideas/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function deleteDateIdea(id: string) {
  const res = await fetch(`${API_URL}/api/date-ideas/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

// --- Love Reasons ---

export async function fetchLoveReasons() {
  const res = await fetch(`${API_URL}/api/love-reasons`);
  return handleResponse<unknown[]>(res);
}

export async function createLoveReason(data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/love-reasons`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function updateLoveReason(id: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api/love-reasons/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

export async function deleteLoveReason(id: string) {
  const res = await fetch(`${API_URL}/api/love-reasons/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const result = await handleResponse(res);
  await revalidateFrontend();
  return result;
}

// --- Upload ---

export async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/api/upload/image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  return handleResponse<{ url: string }>(res);
}

export async function uploadImages(files: File[]): Promise<{ url: string }[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const res = await fetch(`${API_URL}/api/upload/images`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  return handleResponse<{ url: string }[]>(res);
}

export async function uploadVideo(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("video", file);

  const res = await fetch(`${API_URL}/api/upload/video`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  return handleResponse<{ url: string }>(res);
}

export async function uploadAudio(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("audio", file);

  const res = await fetch(`${API_URL}/api/upload/audio`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  return handleResponse<{ url: string }>(res);
}
