"use client";

import { useState } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { projects, confidentialWorkNote, type WorkCategory } from "@/lib/content";
import { DisclosureLabel, CategoryTag } from "@/components/site/chips";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { HoverCard } from "@/components/motion/hover-card";
import { cn } from "@/lib/utils";

const filters: ("All" | WorkCategory)[] = [
  "All",
  "Commercial",
  "Systems",
  "Mobile",
  "Security",
  "Healthcare",
  "Coursework",
];

export function WorkIndex() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");

  const visible = projects.filter((p) =>
    active === "All" ? true : p.categories.includes(active),
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <Reveal>
        <p className="section-marker">§01 — My work</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl">
          What I've built,{" "}
          <span className="font-display-italic">labelled honestly.</span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft">
          Every card carries a disclosure — commercial, public repo, research
          prototype, or coursework — so you can see the evidence behind each
          claim. I filter by capability, not by language.
        </p>
      </Reveal>

      <div className="rule-h mt-10" />

      <Reveal>
        <div
          className="mt-6 flex flex-wrap items-center gap-2"
          role="tablist"
          aria-label="Filter work by capability"
        >
          {filters.map((f) => {
            const isActive = active === f;
            return (
              <button
                key={f}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(f)}
                className={cn(
                  "label-mono rounded-full border px-3.5 py-1.5 transition-all",
                  isActive
                    ? "border-ink bg-ink text-paper"
                    : "border-rule text-ink-soft hover:border-accent hover:text-accent",
                )}
              >
                {f}
              </button>
            );
          })}
          <span className="label-mono ml-auto text-ink-soft">
            {visible.length} {visible.length === 1 ? "entry" : "entries"}
          </span>
        </div>
      </Reveal>

      <Stagger className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
        {visible.map((p) => (
          <StaggerItem key={p.slug}>
            <HoverCard href={`/work/${p.slug}`} accent={p.accent} className="h-full">
              <div className="flex items-start justify-between gap-4">
                <span className={cn("label-mono flex items-center gap-2", p.accent === "accent-warm" ? "text-accent-warm" : "text-accent")}>
                  <span className={cn("h-1.5 w-1.5 rounded-full", p.accent === "accent-warm" ? "bg-accent-warm" : "bg-accent")} />
                  {p.date}
                </span>
                <DisclosureLabel disclosure={p.disclosure} />
              </div>

              <h2 className="mt-5 font-display text-2xl text-ink sm:text-3xl">{p.title}</h2>
              {p.client && <p className="label-mono mt-1 text-ink-soft">{p.client}</p>}
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{p.tagline}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {p.capabilities.map((c) => (
                  <span key={c} className="label-mono rounded-lg border border-rule px-2 py-1 text-ink-soft">{c}</span>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-rule pt-4">
                {p.categories.map((c) => (
                  <CategoryTag key={c} category={c} />
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-sm text-ink transition-colors group-hover:text-accent">
                  Case study
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                </span>
                {p.clientUrl && (
                  <span
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(p.clientUrl, "_blank", "noopener,noreferrer"); }}
                    className="label-mono inline-flex items-center gap-1 text-ink-soft transition-colors group-hover:text-accent-warm"
                  >
                    live <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
                  </span>
                )}
                {p.repo && !p.clientUrl && (
                  <span
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(p.repo, "_blank", "noopener,noreferrer"); }}
                    className="label-mono inline-flex items-center gap-1 text-ink-soft transition-colors group-hover:text-accent"
                  >
                    repo <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
                  </span>
                )}
              </div>
            </HoverCard>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="mt-10">
        <p className="max-w-2xl text-xs italic text-ink-soft">{confidentialWorkNote}</p>
      </Reveal>
    </div>
  );
}
