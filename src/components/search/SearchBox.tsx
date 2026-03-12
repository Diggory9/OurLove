"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SearchResult } from "@/types";
import { formatDate } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    const q = query.trim();
    if (q.length < 2) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(
        `${API_URL}/api/search?q=${encodeURIComponent(q)}`
      );
      const json = await res.json();
      if (json.success) {
        setResults(json.data);
      }
    } catch {
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Search input */}
      <div className="relative mb-10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Nhập từ khóa tìm kiếm..."
          className="w-full px-6 py-4 pr-14 rounded-2xl border border-primary-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-gray-900 placeholder:text-gray-400 bg-white shadow-sm"
        />
        <button
          onClick={handleSearch}
          disabled={loading || query.trim().length < 2}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </button>
      </div>

      {/* Results */}
      {searched && results && (
        <div className="space-y-8">
          {results.total === 0 && (
            <p className="text-center text-gray-500 py-10">
              Không tìm thấy kết quả nào cho &ldquo;{query}&rdquo;
            </p>
          )}

          {/* Albums */}
          {results.albums.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Album ({results.albums.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.albums.map((album) => (
                  <Link
                    key={album.id}
                    href={`/thu-vien/${album.slug}`}
                    className="flex items-center gap-4 p-4 rounded-xl border border-primary-100 hover:border-primary-200 hover:shadow-sm transition-all bg-white"
                  >
                    {album.coverImage ? (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={album.coverImage}
                          alt={album.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📷</span>
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">{album.title}</h4>
                      <p className="text-sm text-gray-500">{album.photoCount} ảnh</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Timeline events */}
          {results.events.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Sự kiện ({results.events.length})
              </h3>
              <div className="space-y-3">
                {results.events.map((event) => (
                  <Link
                    key={event.id}
                    href={`/dong-thoi-gian/${event.slug}`}
                    className="flex items-center gap-4 p-4 rounded-xl border border-primary-100 hover:border-primary-200 hover:shadow-sm transition-all bg-white"
                  >
                    {event.icon && <span className="text-2xl">{event.icon}</span>}
                    <div>
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Photos */}
          {results.photos.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Ảnh ({results.photos.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {results.photos.map((photo) => (
                  <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden">
                    <Image
                      src={photo.src}
                      alt={photo.alt || photo.caption || "Ảnh"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                    {photo.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-black/50 px-2 py-1">
                        <p className="text-xs text-white truncate">{photo.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
