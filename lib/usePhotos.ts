"use client";
import { useEffect, useState } from "react";
import { loadPhoto, photoKey } from "./photos";

/** Object URLs for the given cells' photos, keyed by cell id. */
export function usePhotos(areaId: string, cellIds: string[]): Record<string, string | null> {
  const [urls, setUrls] = useState<Record<string, string | null>>({});
  const key = cellIds.join(",");
  useEffect(() => {
    let alive = true;
    const made: string[] = [];
    Promise.all(cellIds.map(async (id) => [id, await loadPhoto(photoKey(areaId, id))] as const)).then((pairs) => {
      pairs.forEach(([, u]) => u && made.push(u));
      if (alive) setUrls(Object.fromEntries(pairs));
      else made.forEach(URL.revokeObjectURL);
    });
    return () => { alive = false; made.forEach(URL.revokeObjectURL); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaId, key]);
  return urls;
}
