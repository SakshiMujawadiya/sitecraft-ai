import { ColorTheme, WebsiteStyle } from "@/lib/types";

export interface ThemePreset {
  name: string;
  colorTheme: ColorTheme;
  style: WebsiteStyle;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    name: "Modern",
    colorTheme: "Electric Indigo",
    style: "Modern",
    primary: "#6366f1",
    secondary: "#4f46e5",
    accent: "#a855f7",
    bg: "#09090b",
    surface: "#18181b",
    text: "#fafafa",
    muted: "#a1a1aa",
    border: "#27272a",
  },
  {
    name: "Minimal",
    colorTheme: "Monochrome Minimal",
    style: "Minimal",
    primary: "#ffffff",
    secondary: "#e2e8f0",
    accent: "#71717a",
    bg: "#000000",
    surface: "#111111",
    text: "#ffffff",
    muted: "#a1a1aa",
    border: "#27272a",
  },
  {
    name: "Premium",
    colorTheme: "Sunset Amber",
    style: "Luxury",
    primary: "#f59e0b",
    secondary: "#d97706",
    accent: "#ef4444",
    bg: "#0c0a09",
    surface: "#1c1917",
    text: "#fafaf9",
    muted: "#a8a29e",
    border: "#292524",
  },
  {
    name: "Dark",
    colorTheme: "Cyberpunk Neon",
    style: "Dark",
    primary: "#06b6d4",
    secondary: "#0891b2",
    accent: "#ec4899",
    bg: "#050814",
    surface: "#0e1529",
    text: "#f0fdf4",
    muted: "#94a3b8",
    border: "#1e293b",
  },
  {
    name: "Startup",
    colorTheme: "Electric Indigo",
    style: "Modern",
    primary: "#3b82f6",
    secondary: "#2563eb",
    accent: "#10b981",
    bg: "#090d16",
    surface: "#111827",
    text: "#f9fafb",
    muted: "#9ca3af",
    border: "#1f2937",
  },
  {
    name: "Corporate",
    colorTheme: "Ocean Azure",
    style: "Corporate",
    primary: "#0284c7",
    secondary: "#0369a1",
    accent: "#38bdf8",
    bg: "#081325",
    surface: "#0f1f38",
    text: "#f0f9ff",
    muted: "#7dd3fc",
    border: "#1e3a5f",
  },
  {
    name: "Creative",
    colorTheme: "Rose Quartz",
    style: "Glassmorphism",
    primary: "#f43f5e",
    secondary: "#e11d48",
    accent: "#fb7185",
    bg: "#0f0d11",
    surface: "#1f1b24",
    text: "#fff1f2",
    muted: "#fda4af",
    border: "#362e3d",
  },
  {
    name: "Elegant",
    colorTheme: "Royal Purple",
    style: "Luxury",
    primary: "#9333ea",
    secondary: "#7e22ce",
    accent: "#c084fc",
    bg: "#0b0616",
    surface: "#170e2c",
    text: "#faf5ff",
    muted: "#d8b4fe",
    border: "#2c1d4d",
  },
  {
    name: "Futuristic",
    colorTheme: "Emerald Slate",
    style: "Neon",
    primary: "#10b981",
    secondary: "#059669",
    accent: "#06b6d4",
    bg: "#022c22",
    surface: "#064e3b",
    text: "#ecfdf5",
    muted: "#a7f3d0",
    border: "#047857",
  },
];

export const LAYOUT_VARIANTS: Record<string, string[]> = {
  Hero: ["Centered", "Split", "Image Left", "Image Right", "Full Width", "Asymmetric", "Product Preview"],
  Features: ["Grid", "Bento", "Horizontal", "Vertical", "Numbered", "Showcase"],
  Testimonials: ["Cards", "Featured", "Quote", "Grid"],
  Pricing: ["3 Columns", "2 Columns", "4 Columns", "Featured Plan", "Horizontal"],
  FAQ: ["Accordion", "Grid", "Columns"],
  CTA: ["Centered", "Split", "Card", "Minimal"],
};
