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
      headers: { "x-revalidate-secret": "ourlove-revalidate" },
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
