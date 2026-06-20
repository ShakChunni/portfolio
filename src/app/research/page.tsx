import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { research, publication } from "@/lib/content";
import { StatusChip } from "@/components/site/chips";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Research",
  description:
    "My active and published research — BdSL emergency-triage translation, post-quantum cryptography over MQTT, AI-assisted phishing detection, and a peer-reviewed IEEE paper on federated-metaverse authentication.",
  alternates: { canonical: "/research" },
};

const ordered = [...research].sort((a, b) => a.order - b.order);

export default function ResearchPage() {
  return (
    <main id="main">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <p className="section-marker">§02 — My research notebook</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl">
            Active investigations,{" "}
            <span className="font-display-italic">documented in progress.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft">
            I control status manually — published, experimenting, data
            collection, writing, or research note — and never infer it from
            commit activity. Where my evidence is incomplete, I say so rather
            than inventing results.
          </p>
        </Reveal>

        <div className="rule-h mt-10" />

        <Stagger className="mt-8 flex flex-col">
          {ordered.map((r, i) => (
            <StaggerItem key={r.slug}>
              <Link
                href={`/research/${r.slug}`}
                className="group grid grid-cols-1 gap-6 rounded-xl border-b border-rule py-8 transition-colors hover:bg-accent-soft/20 md:grid-cols-12 md:gap-8 md:px-4"
              >
                <div className="md:col-span-2">
                  <p className="label-mono text-ink-soft">{String(i + 1).padStart(2, "0")}</p>
                  <p className={cn("label-mono mt-2", r.accent === "accent-warm" ? "text-accent-warm" : "text-accent")}>{r.updated}</p>
                </div>

                <div className="md:col-span-7">
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusChip status={r.status} />
                    <span className="label-mono text-ink-soft">{r.area}</span>
                  </div>
                  <h2 className="mt-4 font-display text-2xl leading-snug text-ink sm:text-3xl">{r.shortTitle}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">{r.summary}</p>
                  <p className="mt-4 max-w-2xl border-l-2 border-accent/40 pl-4 text-sm italic leading-relaxed text-ink">
                    “{r.question}”
                  </p>
                </div>

                <div className="flex items-end md:col-span-3 md:flex-col md:items-end md:justify-center md:gap-3">
                  <span className="inline-flex items-center gap-1.5 text-sm text-ink transition-colors group-hover:text-accent">
                    Open entry
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                  </span>
                  <span className="label-mono mt-3 text-ink-soft md:mt-0">
                    {r.method.length > 60 ? "Method ↗" : r.method}
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-14">
          <article className="rounded-2xl border border-rule bg-card p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="label-mono text-ink-soft">My verified publication record</p>
              <StatusChip status="Published" />
            </div>
            <h2 className="mt-5 max-w-3xl font-display text-2xl leading-snug text-ink sm:text-3xl">{publication.title}</h2>
            <p className="label-mono mt-4 text-ink-soft">{publication.venue} · pp. {publication.pages} · {publication.date}</p>
            <p className="label-mono mt-2 text-ink-soft">{publication.authors.join(" · ")}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-rule pt-5">
              <a href={publication.doiUrl} target="_blank" rel="noreferrer noopener" className="group inline-flex items-center gap-1.5 text-sm text-ink transition-colors hover:text-accent">
                <span className="link-quiet">DOI {publication.doi}</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={1.5} />
              </a>
              <a href="https://scholar.google.com/citations?user=-tP7SxwAAAAJ&hl=en" target="_blank" rel="noreferrer noopener" className="group inline-flex items-center gap-1.5 text-sm text-ink transition-colors hover:text-accent">
                <span className="link-quiet">My Google Scholar</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={1.5} />
              </a>
              <Link href="/research/federated-metaverse-authentication" className="text-sm text-ink-soft transition-colors hover:text-ink">
                Case study →
              </Link>
            </div>
          </article>
        </Reveal>
      </div>
    </main>
  );
}
