"use client";

import React from "react";
import { X } from "lucide-react";
import { SectionType } from "@/lib/types";

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSection: (type: SectionType) => void;
}

export default function AddSectionModal({
  isOpen,
  onClose,
  onAddSection,
}: AddSectionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-lg font-bold text-white">Add Section to Page</h3>
            <p className="text-xs text-zinc-400">Choose a component block from our categorized library.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Category 1: Content */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2.5">Content</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(["Hero", "Features", "About", "Services", "Team", "Testimonials", "FAQ"] as SectionType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => onAddSection(type)}
                  className="p-3 rounded-xl border border-zinc-800 hover:border-indigo-500 hover:bg-zinc-800 text-left transition-all group"
                >
                  <span className="font-bold text-sm text-white group-hover:text-indigo-300 block">{type}</span>
                  <span className="text-[10px] text-zinc-500">Insert {type.toLowerCase()} block</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category 2: Business */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2.5">Business</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(["Pricing", "Stats", "Logo Cloud", "Process"] as SectionType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => onAddSection(type)}
                  className="p-3 rounded-xl border border-zinc-800 hover:border-emerald-500 hover:bg-zinc-800 text-left transition-all group"
                >
                  <span className="font-bold text-sm text-white group-hover:text-emerald-300 block">{type}</span>
                  <span className="text-[10px] text-zinc-500">Insert {type.toLowerCase()} block</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category 3: Media & Conversion */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5">Media &amp; Conversion</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(["Product Showcase", "CTA", "Newsletter", "Contact"] as SectionType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => onAddSection(type)}
                  className="p-3 rounded-xl border border-zinc-800 hover:border-amber-500 hover:bg-zinc-800 text-left transition-all group"
                >
                  <span className="font-bold text-sm text-white group-hover:text-amber-300 block">{type}</span>
                  <span className="text-[10px] text-zinc-500">Insert {type.toLowerCase()} block</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
