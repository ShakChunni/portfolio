import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-5 py-24 sm:px-8">
      <Reveal>
        <p className="section-marker">404 — not found</p>
        <h1 className="mt-6 font-display text-5xl leading-tight text-ink sm:text-7xl">
          This page is{" "}
          <span className="font-display-italic text-accent">still under research.</span>
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft">
          The route you followed doesn't exist — or my evidence for it wasn't
          strong enough to publish. Either way, the rest of my site is here.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md hover:shadow-accent/30">
            Back to my index
          </Link>
          <Link href="/research" className="inline-flex items-center gap-2 rounded-xl border border-ink/15 bg-card px-5 py-3 text-sm font-medium text-ink transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent">
            Read my research
          </Link>
        </div>
      </Reveal>
    </main>
  );
}
