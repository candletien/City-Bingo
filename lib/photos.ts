"use client";
// Player photos live in IndexedDB on the device (Phase 1). Keyed "<areaId>/<cellId>".

const DB = "city-bingo";
const STORE = "photos";

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const req = fn(db.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const photoKey = (areaId: string, cellId: string) => `${areaId}/${cellId}`;

export async function savePhoto(key: string, blob: Blob): Promise<void> {
  try { await tx("readwrite", (s) => s.put(blob, key)); } catch { /* private mode: photo just isn't kept */ }
}

export async function loadPhoto(key: string): Promise<string | null> {
  try {
    const blob = (await tx<Blob | undefined>("readonly", (s) => s.get(key))) ?? null;
    return blob ? URL.createObjectURL(blob) : null;
  } catch {
    return null;
  }
}

export async function deleteAllPhotos(): Promise<void> {
  try { await tx("readwrite", (s) => s.clear()); } catch { /* nothing stored */ }
}

/** Downscale to keep storage small and uploads fast later. */
export async function downscale(file: Blob, maxSide = 1280, quality = 0.82): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    return await new Promise((r) => canvas.toBlob((b) => r(b ?? file), "image/jpeg", quality));
  } catch {
    return file;
  }
}
