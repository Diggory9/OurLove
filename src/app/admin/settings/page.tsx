"use client";

import { useState, useEffect } from "react";
import { fetchSiteConfig, updateSiteConfig } from "@/lib/admin-api";
import ImageUploader from "@/components/admin/ImageUploader";
import type { SiteConfig } from "@/types";

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchSiteConfig()
      .then((data) => setConfig(data as SiteConfig))
      .catch(() => setError("Không thể tải cấu hình"));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!config) return;

    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const updated = await updateSiteConfig(config as unknown as Record<string, unknown>);
      setConfig(updated as SiteConfig);
      setSuccess("Đã lưu thành công!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi lưu cấu hình");
    } finally {
      setSaving(false);
    }
  }

  function updateField(field: string, value: unknown) {
    setConfig((prev) => prev ? { ...prev, [field]: value } as SiteConfig : prev);
  }

  if (!config && !error) {
    return <div className="text-gray-500">Đang tải...</div>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Cài đặt website</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl p-6 shadow-sm">
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg">{success}</div>}

        {/* Couple info */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Thông tin cặp đôi</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên website</label>
              <input type="text" value={config?.siteName || ""} onChange={(e) => updateField("siteName", e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên người 1</label>
                <input type="text" value={config?.person1Name || ""} onChange={(e) => updateField("person1Name", e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên người 2</label>
                <input type="text" value={config?.person2Name || ""} onChange={(e) => updateField("person2Name", e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ngày bắt đầu yêu</label>
              <input type="date" value={config?.startDate?.split("T")[0] || ""} onChange={(e) => updateField("startDate", e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
            </div>

            <ImageUploader
              value={config?.couplePhoto || ""}
              onChange={(url) => updateField("couplePhoto", url)}
              label="Ảnh cặp đôi"
            />
          </div>
        </div>

        {/* Messages */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Nội dung</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Thông điệp hero</label>
              <textarea value={config?.heroMessage || ""} onChange={(e) => updateField("heroMessage", e.target.value)} rows={3} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Thông điệp footer</label>
              <input type="text" value={config?.footerMessage || ""} onChange={(e) => updateField("footerMessage", e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
            </div>
          </div>
        </div>

        {/* Theme */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Giao diện</h2>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Màu chính</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config?.primaryColor || "#f43f5e"}
                onChange={(e) => updateField("primaryColor", e.target.value)}
                className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={config?.primaryColor || ""}
                onChange={(e) => updateField("primaryColor", e.target.value)}
                className="w-32 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50"
        >
          {saving ? "Đang lưu..." : "Lưu cài đặt"}
        </button>
      </form>
    </div>
  );
}
