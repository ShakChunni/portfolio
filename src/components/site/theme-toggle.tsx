"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot() {
  return "dark";
}

/**
 * Smooth theme toggle using the View Transitions API.
 * Falls back to an instant toggle when VTA is unsupported.
 * The crossfade is driven by CSS in globals.css (::view-transition-*).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";

    const applyTheme = () => {
      try {
        localStorage.setItem("theme", next);
      } catch {
        // ignore
      }
      document.documentElement.classList.toggle("dark", next === "dark");
    };

    const supportsVT =
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (supportsVT) {
      (document as Document & {
        startViewTransition: (cb: () => void) => void;
      }).startViewTransition(() => {
        applyTheme();
      });
    } else {
      applyTheme();
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={cn(
        "label-mono group relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rule text-ink-soft transition-colors hover:border-accent hover:text-accent",
        className,
      )}
    >
      <Sun
        className={cn(
          "absolute h-4 w-4 transition-all duration-300",
          theme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0",
        )}
        strokeWidth={1.5}
      />
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-all duration-300",
          theme === "light"
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0",
        )}
        strokeWidth={1.5}
      />
    </button>
  );
}
