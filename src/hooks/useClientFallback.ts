"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export function useClientFallback<T>(
  initialData: T[],
  apiPath: string
): { data: T[]; loading: boolean } {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(initialData.length === 0);

  useEffect(() => {
    if (initialData.length > 0) return;

    fetch(`${API_URL}${apiPath}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setData(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [apiPath, initialData.length]);

  return { data, loading };
}
