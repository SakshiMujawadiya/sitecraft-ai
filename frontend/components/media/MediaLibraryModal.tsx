"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, Trash2, Check, Sparkles, Image as ImageIcon, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/api-client";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
}

const CURATED_STOCK = [
  {
    title: "Modern SaaS Dashboard",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80",
  },
  {
    title: "AI Neural Network",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80",
  },
  {
    title: "Cloud Infrastructure",
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&auto=format&fit=crop&q=80",
  },
  {
    title: "Collaborative Team",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80",
  },
  {
    title: "Creative Art Studio",
    url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=900&auto=format&fit=crop&q=80",
  },
  {
    title: "Gourmet Bistro Dish",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=80",
  },
  {
    title: "Minimalist Workspace",
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&auto=format&fit=crop&q=80",
  },
  {
    title: "Modern Architecture",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80",
  },
];

export default function MediaLibraryModal({
  isOpen,
  onClose,
  onSelectImage,
}: MediaLibraryModalProps) {
  const [tab, setTab] = useState<"stock" | "uploads">("stock");
  const [uploads, setUploads] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchUploads();
    }
  }, [isOpen]);

  const fetchUploads = async () => {
    try {
      setLoading(true);
      const res = await apiRequest<{ success: boolean; media: MediaItem[] }>("/api/media");
      if (res.success) {
        setUploads(res.media);
      }
    } catch {
      // User might be viewing unauthenticated/demo
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, WebP, SVG)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size exceeds the 5MB limit");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        const res = await apiRequest<{ success: boolean; media: MediaItem }>("/api/media/upload", {
          method: "POST",
          data: {
            name: file.name,
            dataUrl,
            size: file.size,
            type: file.type,
          },
        });

        if (res.success && res.media) {
          setUploads((prev) => [res.media, ...prev]);
          setSelectedUrl(res.media.url);
          setTab("uploads");
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await apiRequest(`/api/media/${id}`, { method: "DELETE" });
      setUploads((prev) => prev.filter((m) => m.id !== id));
      if (selectedUrl === uploads.find((m) => m.id === id)?.url) {
        setSelectedUrl(null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete image");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Media Library</h3>
              <p className="text-xs text-zinc-400">Select or upload high-resolution images for your landing page</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs & Upload Button */}
        <div className="px-6 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/40">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTab("stock")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === "stock"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              Curated Stock
            </button>
            <button
              onClick={() => setTab("uploads")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === "uploads"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              My Uploads ({uploads.length})
            </button>
          </div>

          <label className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold cursor-pointer transition-all border border-zinc-700">
            {uploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            ) : (
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
            )}
            <span>{uploading ? "Uploading..." : "Upload New"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {error && (
          <div className="px-6 py-2 bg-rose-500/10 border-b border-rose-500/20 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Grid content */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {tab === "stock" ? (
            CURATED_STOCK.map((item, idx) => {
              const isSelected = selectedUrl === item.url;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedUrl(item.url)}
                  className={`relative group rounded-xl overflow-hidden border cursor-pointer aspect-video transition-all ${
                    isSelected
                      ? "ring-2 ring-indigo-500 border-indigo-500 shadow-xl"
                      : "border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                    <span className="text-[11px] text-white font-medium truncate">{item.title}</span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })
          ) : uploads.length === 0 ? (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-center text-zinc-500">
              <Upload className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm font-medium">No uploaded images yet</p>
              <p className="text-xs mt-1">Upload a PNG, JPG or WebP image up to 5MB</p>
            </div>
          ) : (
            uploads.map((item) => {
              const isSelected = selectedUrl === item.url;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedUrl(item.url)}
                  className={`relative group rounded-xl overflow-hidden border cursor-pointer aspect-video transition-all ${
                    isSelected
                      ? "ring-2 ring-indigo-500 border-indigo-500 shadow-xl"
                      : "border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5">
                    <span className="text-[11px] text-white font-medium truncate max-w-[80%]">{item.name}</span>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1 rounded bg-rose-600/80 hover:bg-rose-600 text-white transition-colors"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="text-xs text-zinc-500 truncate max-w-sm">
            {selectedUrl ? `Selected: ${selectedUrl.slice(0, 45)}...` : "Choose an image to apply"}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!selectedUrl}
              onClick={() => {
                if (selectedUrl) {
                  onSelectImage(selectedUrl);
                  onClose();
                }
              }}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
            >
              Apply Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
