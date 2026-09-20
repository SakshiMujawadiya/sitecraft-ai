"use client";

import React from "react";
import { Keyboard, X, Command } from "lucide-react";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "Ctrl + Z", mac: "⌘ + Z", description: "Undo last editor change" },
    { key: "Ctrl + Shift + Z", mac: "⌘ + Shift + Z", description: "Redo undone change" },
    { key: "Ctrl + S", mac: "⌘ + S", description: "Save project changes" },
    { key: "Ctrl + P", mac: "⌘ + P", description: "Toggle full visitor preview mode" },
    { key: "Esc", mac: "Esc", description: "Deselect element / close modal" },
    { key: "?", mac: "?", description: "Open keyboard shortcuts help" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-400">
            <Keyboard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Keyboard Shortcuts</h3>
            <p className="text-xs text-zinc-400">Speed up your workflow with keyboard shortcuts.</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {shortcuts.map((sc, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between text-xs"
            >
              <span className="text-zinc-300 font-medium">{sc.description}</span>
              <div className="flex items-center space-x-1.5 font-mono">
                <span className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-indigo-300 font-semibold text-[11px]">
                  {sc.key}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-800 text-center text-xs text-zinc-500">
          Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[10px]">Esc</kbd> anytime to dismiss
        </div>
      </div>
    </div>
  );
}
