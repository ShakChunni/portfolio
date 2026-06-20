import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { StatusChip, DisclosureLabel, CategoryTag } from "@/components/site/chips";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function CaseStudyHeader({
  eyebrow,
  title,
  tagline,
  date,
  role,
  status,
  disclosure,
  categories,
  capabilities,
  repo,
  external,
  accent = "accent",
}: {
  eyebrow: string;
  title: string;
  tagline: string;
  date: string;
  role: string;
  status?: import("@/lib/content").ResearchStatus;
  disclosure?: import("@/lib/content").Disclosure;
  categories: import("@/lib/content").WorkCategory[];
  capabilities: string[];
  repo?: string;
  external?: string;
  accent?: "accent" | "accent-warm";
}) {
  const dot = accent === "accent-warm" ? "bg-accent-warm" : "bg-accent";
  return (
    <header className="mx-auto max-w-6xl px-5 pb-10 pt-12 sm:px-8 sm:pt-20">
      <Reveal>
        <Link
          href={eyebrow.includes("Research") ? "/research" : "/work"}
          className="label-mono inline-flex items-center gap-1.5 text-ink-soft transition-colors hover:text-signal"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          {eyebrow.includes("Research") ? "Research index" : "Work index"}
        </Link>
      </Reveal>

      <Reveal delay={0.05}>
        <p className="label-mono mt-8 flex items-center gap-2 text-ink-soft">
          <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
          {eyebrow}
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <h1 className="mt-5 max-w-4xl font-display text-4xl leading-[1.08] text-ink sm:text-5xl lg:text-6xl">
          {title}
        </h1>
      </Reveal>

      <Reveal delay={0.12}>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
          {tagline}
        </p>
      </Reveal>

      <Reveal delay={0.16}>
        <div className="mt-8 flex flex-wrap items-center gap-3 border-y border-rule py-4">
          <span className="label-mono text-ink-soft">{date}</span>
          <span className="rule-v h-4" />
          <span className="label-mono text-ink">{role}</span>
          {status && (
            <>
              <span className="rule-v h-4" />
              <StatusChip status={status} />
            </>
          )}
          {disclosure && (
            <>
              <span className="rule-v h-4" />
              <DisclosureLabel disclosure={disclosure} />
            </>
          )}
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <CategoryTag key={c} category={c} />
            ))}
            {capabilities.map((c) => (
              <span
                key={c}
                className="label-mono rounded-xs border border-rule px-2 py-0.5 text-ink-soft"
              >
                {c}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {repo && (
              <a
                href={repo}
                target="_blank"
                rel="noreferrer noopener"
                className="label-mono inline-flex items-center gap-1 text-ink-soft transition-colors hover:text-signal"
              >
                Repository <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </a>
            )}
            {external && (
              <a
                href={external}
                target="_blank"
                rel="noreferrer noopener"
                className="label-mono inline-flex items-center gap-1 text-ink-soft transition-colors hover:text-signal"
              >
                View <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </a>
            )}
          </div>
        </div>
      </Reveal>
    </header>
  );
}

export function CaseSection({
  index,
  label,
  title,
  children,
}: {
  index: string;
  label: string;
  title?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="grid grid-cols-1 gap-y-6 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-3 lg:col-span-2">
          <p className="section-marker">{index}</p>
          <p className="label-mono mt-2 text-ink">{label}</p>
        </div>
        <div className="md:col-span-9 lg:col-span-10">
          {title && (
            <h2 className="font-display text-2xl leading-snug text-ink sm:text-3xl lg:text-4xl">
              {title}
            </h2>
          )}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "max-w-2xl text-[15px] leading-relaxed text-ink-soft [&_p]:mt-4 [&_p:first-child]:mt-0 [&_strong]:text-ink [&_code]:rounded-xs [&_code]:border [&_code]:border-rule [&_code]:bg-paper-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Callout({
  tone = "accent",
  label,
  children,
}: {
  tone?: "accent" | "accent-warm" | "ink";
  label: string;
  children: ReactNode;
}) {
  const styles: Record<string, string> = {
    accent: "border-accent/30 bg-accent-soft/40",
    "accent-warm": "border-accent-warm/30 bg-accent-warm-soft/40",
    ink: "border-rule bg-ink text-paper",
  };
  const labelColor = tone === "ink" ? "text-paper/60" : "text-ink-soft";
  return (
    <aside className={cn("rounded-xl border p-5 sm:p-6", styles[tone])}>
      <p className={cn("label-mono mb-2", labelColor)}>{label}</p>
      <div className={cn("text-sm leading-relaxed", tone === "ink" ? "text-paper/85" : "text-ink")}>
        {children}
      </div>
    </aside>
  );
}

export function KeyValue({ items }: { items: { k: string; v: ReactNode }[] }) {
  return (
    <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.k} className="bg-paper p-4">
          <dt className="label-mono mb-1.5 text-ink-soft">{item.k}</dt>
          <dd className="text-sm text-ink">{item.v}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Architecture diagram — a styled pre block for ASCII system diagrams.
 * Renders on a dark surface with mono text, giving a "systems console" feel.
 */
export function ArchitectureDiagram({
  caption,
  children,
}: {
  caption?: string;
  children: string;
}) {
  return (
    <figure className="my-6 overflow-hidden rounded-2xl border border-rule">
      <div className="overflow-x-auto bg-ink p-5 sm:p-6">
        <pre className="font-mono text-xs leading-relaxed text-paper/90 sm:text-[13px]">
{children}
        </pre>
      </div>
      {caption && (
        <figcaption className="bg-paper-2 px-5 py-3">
          <span className="label-mono text-ink-soft">{caption}</span>
        </figcaption>
      )}
    </figure>
  );
}

/**
 * A layered architecture block — shows system layers as stacked cards.
 * Used to visualise how I structured a system from edge to database.
 */
export function LayerStack({
  layers,
}: {
  layers: { name: string; detail: string; tone?: "accent" | "accent-warm" | "neutral" }[];
}) {
  return (
    <div className="my-6 flex flex-col gap-2">
      {layers.map((layer, i) => {
        const toneBorder =
          layer.tone === "accent"
            ? "border-l-accent"
            : layer.tone === "accent-warm"
              ? "border-l-accent-warm"
              : "border-l-ink-soft/30";
        return (
          <div
            key={layer.name}
            className={cn(
              "rounded-r-xl border border-l-2 border-rule bg-card p-4 pl-5",
              toneBorder,
            )}
            style={{ marginLeft: `${i * 12}px` }}
          >
            <p className="label-mono text-ink">{layer.name}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
              {layer.detail}
            </p>
          </div>
        );
      })}
    </div>
  );
}
