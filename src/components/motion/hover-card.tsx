"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EASE } from "./reveal";

export function HoverCard({
  children,
  className,
  href,
  accent = "accent",
  lift = 6,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  accent?: "accent" | "accent-warm";
  lift?: number;
}) {
  const reduce = useReducedMotion();
  const accentBar =
    accent === "accent-warm" ? "bg-accent-warm" : "bg-accent";
  const glow =
    accent === "accent-warm" ? "bg-accent-warm-soft" : "bg-accent-soft";

  const inner = (
    <motion.div
      whileHover={reduce ? undefined : { y: -lift }}
      transition={{ duration: 0.4, ease: EASE }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-rule bg-card p-6 transition-colors duration-500 hover:border-ink/20",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-0 h-full w-1 origin-top scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100",
          accentBar,
        )}
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100",
          glow,
        )}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block" prefetch>
        {inner}
      </Link>
    );
  }
  return inner;
}
