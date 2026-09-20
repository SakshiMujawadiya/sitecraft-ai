"use client";

import React from "react";
import { Wand2, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { SectionContent, ElementContent } from "@/lib/types";
import { LAYOUT_VARIANTS } from "@/lib/editor-constants";

interface ContentInspectorProps {
  selectedSection: SectionContent | null;
  selectedElementId: string | null;
  selectedElement: ElementContent | null;
  onUpdateSection: (updates: Partial<SectionContent>) => void;
  onUpdateElement: (elementId: string, updates: Partial<ElementContent>) => void;
  onDeselectElement: () => void;
  onRegenerateSectionDesign: () => void;
  onOpenMediaModal: () => void;
}

export default function ContentInspector({
  selectedSection,
  selectedElementId,
  selectedElement,
  onUpdateSection,
  onUpdateElement,
  onDeselectElement,
  onRegenerateSectionDesign,
  onOpenMediaModal,
}: ContentInspectorProps) {
  if (!selectedSection) {
    return (
      <div className="text-center py-12 text-zinc-500">
        Click any section on the canvas to inspect its layout and properties.
      </div>
    );
  }

  /* ELEMENT-LEVEL INSPECTOR CONTROLS */
  if (selectedElementId) {
    return (
      <div className="space-y-4">
        {/* Banner Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800 bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-500/50">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-xs uppercase tracking-wider block">
                {selectedElementId.replace(/-/g, " ")}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white animate-pulse">
                Targeted Element
              </span>
            </div>
            <span className="text-[10px] text-indigo-300 font-mono">
              Section: {selectedSection.type} ({selectedSection.id})
            </span>
          </div>
          <button
            type="button"
            onClick={onDeselectElement}
            className="px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold hover:bg-zinc-700 transition-colors text-[11px]"
          >
            ← Section Controls
          </button>
        </div>

        {/* Content Section */}
        <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
          <span className="font-bold text-zinc-300 block text-[11px]">Element Content</span>
          <div>
            <label className="text-[10px] text-zinc-400 mb-1 block">Text Content</label>
            <textarea
              rows={3}
              value={selectedElement?.text || ""}
              onChange={(e) =>
                onUpdateElement(selectedElementId, {
                  text: e.target.value,
                })
              }
              placeholder="Element text content..."
              className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-white text-xs outline-none focus:border-indigo-500"
            />
          </div>
          {(selectedElementId === "cta" ||
            selectedElementId === "secondaryCta" ||
            selectedElementId.includes("button")) && (
            <div>
              <label className="text-[10px] text-zinc-400 mb-1 block">Link URL</label>
              <input
                type="text"
                value={selectedElement?.link || ""}
                onChange={(e) =>
                  onUpdateElement(selectedElementId, {
                    link: e.target.value,
                  })
                }
                placeholder="#pricing"
                className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-white text-xs outline-none focus:border-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Typography Section */}
        <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
          <span className="font-bold text-zinc-300 block text-[11px]">Typography</span>

          <div>
            <label className="text-[10px] text-zinc-400 mb-1 block">Font Family</label>
            <select
              value={selectedElement?.style?.fontFamily || ""}
              onChange={(e) =>
                onUpdateElement(selectedElementId, {
                  style: { fontFamily: e.target.value },
                })
              }
              className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-white text-xs outline-none focus:border-indigo-500"
            >
              <option value="">(Inherit Theme Font)</option>
              <option value="'Inter', sans-serif">Inter</option>
              <option value="'Outfit', sans-serif">Outfit</option>
              <option value="Georgia, Cambria, serif">Playfair Display (Serif)</option>
              <option value="'Space Grotesk', monospace">Space Grotesk</option>
              <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans</option>
              <option value="'Geist', sans-serif">Geist</option>
              <option value="'Poppins', sans-serif">Poppins</option>
              <option value="'Roboto', sans-serif">Roboto</option>
              <option value="'DM Sans', sans-serif">DM Sans</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] text-zinc-400">Font Size</label>
              <span className="text-[10px] font-mono text-indigo-400">
                {selectedElement?.style?.fontSize || "default"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="10"
                max="96"
                step="1"
                value={parseInt(selectedElement?.style?.fontSize || "16", 10)}
                onChange={(e) =>
                  onUpdateElement(selectedElementId, {
                    style: { fontSize: `${e.target.value}px` },
                  })
                }
                className="flex-1 accent-indigo-500 cursor-pointer"
              />
              <input
                type="text"
                value={selectedElement?.style?.fontSize || ""}
                onChange={(e) =>
                  onUpdateElement(selectedElementId, {
                    style: { fontSize: e.target.value },
                  })
                }
                placeholder="48px"
                className="w-16 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-white text-xs text-center font-mono outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-zinc-400 mb-1 block">Font Weight</label>
            <select
              value={selectedElement?.style?.fontWeight || ""}
              onChange={(e) =>
                onUpdateElement(selectedElementId, {
                  style: { fontWeight: e.target.value },
                })
              }
              className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-white text-xs outline-none focus:border-indigo-500 font-semibold"
            >
              <option value="">(Default Weight)</option>
              <option value="300">300 - Light</option>
              <option value="400">400 - Regular</option>
              <option value="500">500 - Medium</option>
              <option value="600">600 - SemiBold</option>
              <option value="700">700 - Bold</option>
              <option value="800">800 - ExtraBold</option>
              <option value="900">900 - Black</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-zinc-400 mb-1 block">Line Height</label>
              <input
                type="text"
                value={selectedElement?.style?.lineHeight || ""}
                onChange={(e) =>
                  onUpdateElement(selectedElementId, {
                    style: { lineHeight: e.target.value },
                  })
                }
                placeholder="1.2"
                className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-white text-xs outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 mb-1 block">Letter Spacing</label>
              <input
                type="text"
                value={selectedElement?.style?.letterSpacing || ""}
                onChange={(e) =>
                  onUpdateElement(selectedElementId, {
                    style: { letterSpacing: e.target.value },
                  })
                }
                placeholder="-0.02em"
                className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-white text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-zinc-400 mb-1 block">Text Alignment</label>
            <div className="grid grid-cols-4 gap-1">
              {(["left", "center", "right", "justify"] as const).map((a) => {
                const isActive = selectedElement?.style?.textAlign === a;
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() =>
                      onUpdateElement(selectedElementId, {
                        style: { textAlign: a },
                      })
                    }
                    className={`py-1 text-center rounded capitalize font-medium text-[10px] border ${
                      isActive
                        ? "bg-indigo-600/30 border-indigo-500 text-white"
                        : "border-zinc-800 hover:bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-zinc-400 mb-1 block">Text Transform</label>
            <div className="grid grid-cols-4 gap-1">
              {(["none", "uppercase", "lowercase", "capitalize"] as const).map((t) => {
                const isActive = selectedElement?.style?.textTransform === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() =>
                      onUpdateElement(selectedElementId, {
                        style: { textTransform: t },
                      })
                    }
                    className={`py-1 text-center rounded capitalize font-medium text-[9px] border ${
                      isActive
                        ? "bg-indigo-600/30 border-indigo-500 text-white"
                        : "border-zinc-800 hover:bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Colors Section */}
        <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
          <span className="font-bold text-zinc-300 block text-[11px]">Colors</span>

          <div>
            <label className="text-[10px] text-zinc-400 mb-1 block">Text Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={selectedElement?.style?.color || "#ffffff"}
                onChange={(e) =>
                  onUpdateElement(selectedElementId, {
                    style: { color: e.target.value },
                  })
                }
                className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={selectedElement?.style?.color || ""}
                onChange={(e) =>
                  onUpdateElement(selectedElementId, {
                    style: { color: e.target.value },
                  })
                }
                placeholder="#ffffff"
                className="flex-1 px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-white text-xs font-mono outline-none"
              />
            </div>
            <div className="flex items-center space-x-1.5 mt-2 overflow-x-auto pb-1">
              {["#ffffff", "#fafafa", "#a1a1aa", "#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#000000"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    onUpdateElement(selectedElementId, {
                      style: { color: c },
                    })
                  }
                  className="w-5 h-5 rounded-full border border-zinc-700 transition-transform hover:scale-110 shrink-0"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-zinc-400 mb-1 block">Background Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={selectedElement?.style?.backgroundColor || "#6366f1"}
                onChange={(e) =>
                  onUpdateElement(selectedElementId, {
                    style: { backgroundColor: e.target.value },
                  })
                }
                className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={selectedElement?.style?.backgroundColor || ""}
                onChange={(e) =>
                  onUpdateElement(selectedElementId, {
                    style: { backgroundColor: e.target.value },
                  })
                }
                placeholder="transparent or #6366f1"
                className="flex-1 px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-white text-xs font-mono outline-none"
              />
            </div>
          </div>
        </div>

        {/* Spacing & Border Section */}
        <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
          <span className="font-bold text-zinc-300 block text-[11px]">Spacing & Border</span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-zinc-400 mb-1 block">Margin (CSS)</label>
              <input
                type="text"
                value={selectedElement?.style?.margin || ""}
                onChange={(e) =>
                  onUpdateElement(selectedElementId, {
                    style: { margin: e.target.value },
                  })
                }
                placeholder="0px 0px 16px 0px"
                className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-white text-xs outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 mb-1 block">Padding (CSS)</label>
              <input
                type="text"
                value={selectedElement?.style?.padding || ""}
                onChange={(e) =>
                  onUpdateElement(selectedElementId, {
                    style: { padding: e.target.value },
                  })
                }
                placeholder="8px 16px"
                className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-white text-xs outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-zinc-400 mb-1 block">Border Radius</label>
              <input
                type="text"
                value={selectedElement?.style?.borderRadius || ""}
                onChange={(e) =>
                  onUpdateElement(selectedElementId, {
                    style: { borderRadius: e.target.value },
                  })
                }
                placeholder="8px or 9999px"
                className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-white text-xs outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 mb-1 block">Border (CSS)</label>
              <input
                type="text"
                value={selectedElement?.style?.border || ""}
                onChange={(e) =>
                  onUpdateElement(selectedElementId, {
                    style: { border: e.target.value },
                  })
                }
                placeholder="1px solid #374151"
                className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-white text-xs outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* SECTION-LEVEL INSPECTOR CONTROLS */
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800 bg-indigo-950/20 p-2.5 rounded-xl border border-indigo-900/40">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white text-sm uppercase tracking-wider block">
              {selectedSection.type} Section
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white animate-pulse">
              Active
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">ID: {selectedSection.id}</span>
        </div>
        <button
          onClick={onRegenerateSectionDesign}
          className="px-2.5 py-1 rounded bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 font-semibold hover:bg-indigo-900 transition-colors flex items-center space-x-1 text-[11px]"
          title="Cycle to next layout variant"
        >
          <Wand2 className="w-3 h-3" />
          <span>Swap Layout</span>
        </button>
      </div>

      {/* Section Layout Variant Selector */}
      {LAYOUT_VARIANTS[selectedSection.type] && (
        <div>
          <label className="font-semibold text-zinc-300 mb-1.5 block">Layout Variant</label>
          <select
            value={selectedSection.variant || selectedSection.layout || LAYOUT_VARIANTS[selectedSection.type][0]}
            onChange={(e) =>
              onUpdateSection({
                variant: e.target.value,
                layout: e.target.value,
              })
            }
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500 font-semibold"
          >
            {LAYOUT_VARIANTS[selectedSection.type].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Badge Label */}
      <div>
        <label className="font-semibold text-zinc-400 mb-1 block">Badge Text</label>
        <input
          type="text"
          value={selectedSection.badge || ""}
          onChange={(e) => onUpdateSection({ badge: e.target.value })}
          placeholder="e.g. Next-Gen Intelligence"
          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500"
        />
      </div>

      {/* Headline / Title */}
      <div>
        <label className="font-semibold text-zinc-400 mb-1 block">Headline / Title</label>
        <input
          type="text"
          value={selectedSection.title || ""}
          onChange={(e) => onUpdateSection({ title: e.target.value })}
          placeholder="Section title"
          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500"
        />
      </div>

      {/* Subtitle / Description */}
      <div>
        <label className="font-semibold text-zinc-400 mb-1 block">Subtitle / Description</label>
        <textarea
          rows={3}
          value={selectedSection.subtitle || ""}
          onChange={(e) => onUpdateSection({ subtitle: e.target.value })}
          placeholder="Supporting description..."
          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500"
        />
      </div>

      {/* Button Controls */}
      <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
        <span className="font-bold text-zinc-300 block text-[11px]">Primary Button</span>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-zinc-400 mb-1 block">Button Text</label>
            <input
              type="text"
              value={selectedSection.ctaText || ""}
              onChange={(e) => onUpdateSection({ ctaText: e.target.value })}
              placeholder="Get Started"
              className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-white text-xs outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-zinc-400 mb-1 block">Button Link</label>
            <input
              type="text"
              value={selectedSection.ctaLink || ""}
              onChange={(e) => onUpdateSection({ ctaLink: e.target.value })}
              placeholder="#pricing"
              className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-white text-xs outline-none"
            />
          </div>
        </div>
      </div>

      {/* Image Editor */}
      <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
        <span className="font-bold text-zinc-300 block text-[11px]">Image Editor</span>
        <div className="flex items-center space-x-2">
          <img
            src={selectedSection.imageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&auto=format&fit=crop&q=80"}
            alt="preview"
            className="w-12 h-12 rounded-lg object-cover border border-zinc-800 shrink-0"
          />
          <button
            type="button"
            onClick={onOpenMediaModal}
            className="flex-1 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold flex items-center justify-center space-x-1.5 transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Choose Unsplash Image</span>
          </button>
        </div>
        <div>
          <label className="text-[10px] text-zinc-400 mb-1 block">Or Paste Direct Image URL</label>
          <input
            type="text"
            value={selectedSection.imageUrl || ""}
            onChange={(e) => onUpdateSection({ imageUrl: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-white text-xs outline-none"
          />
        </div>
      </div>

      {/* Section Spacing Controls */}
      <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2.5">
        <span className="font-bold text-zinc-300 block text-[11px]">Section Spacing (Padding)</span>
        <div className="grid grid-cols-3 gap-1.5">
          {(["compact", "normal", "spacious"] as const).map((p) => {
            const currentPadding = selectedSection.customStyles?.paddingY || "normal";
            const isActive = currentPadding === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() =>
                  onUpdateSection({
                    customStyles: {
                      ...selectedSection.customStyles,
                      paddingY: p,
                    },
                  })
                }
                className={`py-1.5 text-center rounded capitalize font-medium text-[11px] transition-all border ${
                  isActive
                    ? "bg-indigo-600/30 border-indigo-500 text-white"
                    : "border-zinc-800 hover:bg-zinc-800 text-zinc-400"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Items (Features / Testimonials / Pricing / FAQ) */}
      {selectedSection.items && selectedSection.items.length > 0 && (
        <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-zinc-300 text-[11px]">Structured Items ({selectedSection.items.length})</span>
            <button
              type="button"
              onClick={() => {
                const newItems = [
                  ...selectedSection.items!,
                  {
                    title: `New ${selectedSection.type} Item`,
                    description: "Add a crisp description for this capability.",
                  },
                ];
                onUpdateSection({ items: newItems });
              }}
              className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {selectedSection.items.map((item, iIdx) => (
              <div key={iIdx} className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={item.title || item.question || ""}
                    onChange={(e) => {
                      const nextItems = [...selectedSection.items!];
                      nextItems[iIdx] = { ...item, title: e.target.value, question: e.target.value };
                      onUpdateSection({ items: nextItems });
                    }}
                    placeholder="Item Title"
                    className="w-full bg-transparent font-semibold text-white text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const nextItems = selectedSection.items!.filter((_, idx) => idx !== iIdx);
                      onUpdateSection({ items: nextItems });
                    }}
                    className="text-zinc-500 hover:text-rose-400 p-0.5"
                    title="Delete Item"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={item.description || item.answer || ""}
                  onChange={(e) => {
                    const nextItems = [...selectedSection.items!];
                    nextItems[iIdx] = { ...item, description: e.target.value, answer: e.target.value };
                    onUpdateSection({ items: nextItems });
                  }}
                  placeholder="Item description / answer..."
                  className="w-full bg-zinc-950 p-1.5 rounded border border-zinc-800 text-[11px] text-zinc-300 outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
