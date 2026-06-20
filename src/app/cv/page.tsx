import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FileText, Download } from "lucide-react";
import {
  profile,
  education,
  experience,
  skills,
  publication,
  research,
  projects,
} from "@/lib/content";
import { SectionBare } from "@/components/site/section";
import { Reveal } from "@/components/motion/reveal";
import { StatusChip, DisclosureLabel } from "@/components/site/chips";

export const metadata: Metadata = {
  title: "CV",
  description:
    "My curriculum vitae — F.M. Ashfaq, software engineer & applied-security researcher. Generated from the same structured content as the site, with a link to my current PDF CV.",
  alternates: { canonical: "/cv" },
};

export default function CVPage() {
  return (
    <main id="main">
      <SectionBare className="py-16 sm:py-24">
        <Reveal>
          <p className="section-marker">§04 — My CV</p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl">{profile.name}</h1>
          <p className="mt-3 label-mono text-ink-soft">{profile.role} · {profile.location}</p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft">
            I generate this page from the same structured content as the rest
            of my site, so it never drifts from the portfolio. My current PDF
            CV is also available — note that older PDF versions may contain
            outdated labels (for example, an incorrect employer reference I've
            since corrected to CodeXGate).
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={profile.cvUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md hover:shadow-accent/30"
            >
              <FileText className="h-4 w-4" strokeWidth={1.5} />
              Open my PDF CV (Google Drive)
              <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={1.5} />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-xl border border-ink/15 bg-card px-5 py-3 text-sm font-medium text-ink transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              <Download className="h-4 w-4" strokeWidth={1.5} />
              {profile.email}
            </a>
          </div>
        </Reveal>

        <div className="rule-h mt-12" />

        <Reveal className="mt-10">
          <h2 className="label-mono mb-4 text-ink-soft">My contact & links</h2>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-2">
            {Object.values(profile.links).map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer noopener" className="group flex items-center justify-between bg-paper p-4 transition-colors hover:bg-accent-soft/20">
                <span className="label-mono text-ink-soft">{link.label}</span>
                <span className="text-sm text-ink transition-colors group-hover:text-accent">{link.handle} ↗</span>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <h2 className="label-mono mb-4 text-ink-soft">My education</h2>
          <div className="flex flex-col">
            {education.map((e) => (
              <div key={e.institution} className="border-b border-rule py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl text-ink">{e.institution}</h3>
                  <span className="label-mono text-accent">{e.period}</span>
                </div>
                <p className="label-mono mt-1 text-ink-soft">
                  {e.programme} · {e.place}
                  {e.cgpa ? ` · CGPA ${e.cgpa}` : ""}
                </p>
                <p className="mt-2 max-w-xl text-sm text-ink-soft">{e.note}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <h2 className="label-mono mb-4 text-ink-soft">My experience</h2>
          <div className="flex flex-col">
            {experience.map((x) => (
              <div key={x.company} className="border-b border-rule py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl text-ink">{x.role} · {x.company}</h3>
                  <span className="label-mono text-accent">{x.period}</span>
                </div>
                <p className="label-mono mt-1 text-ink-soft">{x.location}</p>
                <p className="mt-2 max-w-xl text-sm text-ink-soft">{x.summary}</p>
                {x.bullets && (
                  <ul className="mt-3 space-y-1 text-sm text-ink-soft">
                    {x.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <h2 className="label-mono mb-4 text-ink-soft">My publication</h2>
          <article className="rounded-2xl border border-rule bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="label-mono text-ink-soft">{publication.venue} · pp. {publication.pages} · {publication.date}</span>
              <StatusChip status="Published" />
            </div>
            <p className="mt-3 font-display text-xl leading-snug text-ink">{publication.title}</p>
            <p className="label-mono mt-3 text-ink-soft">{publication.authors.join(" · ")}</p>
            <a href={publication.doiUrl} target="_blank" rel="noreferrer noopener" className="label-mono mt-3 inline-block text-accent hover:underline">
              DOI {publication.doi} ↗
            </a>
          </article>
        </Reveal>

        <Reveal className="mt-12">
          <h2 className="label-mono mb-4 text-ink-soft">My active research</h2>
          <div className="flex flex-col">
            {[...research].sort((a, b) => a.order - b.order).map((r) => (
              <Link key={r.slug} href={`/research/${r.slug}`} className="group flex items-center justify-between border-b border-rule py-4 transition-colors hover:bg-accent-soft/20">
                <div>
                  <p className="font-display text-lg text-ink">{r.shortTitle}</p>
                  <p className="label-mono mt-1 text-ink-soft">{r.area}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusChip status={r.status} />
                  <ArrowUpRight className="h-4 w-4 text-ink-soft transition-colors group-hover:text-accent" strokeWidth={1.5} />
                </div>
              </Link>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <h2 className="label-mono mb-4 text-ink-soft">My selected work</h2>
          <div className="flex flex-col">
            {projects.map((p) => (
              <Link key={p.slug} href={`/work/${p.slug}`} className="group flex items-center justify-between border-b border-rule py-4 transition-colors hover:bg-accent-soft/20">
                <div>
                  <p className="font-display text-lg text-ink">{p.title}</p>
                  <p className="label-mono mt-1 text-ink-soft">{p.date} · {p.role}</p>
                </div>
                <div className="flex items-center gap-3">
                  <DisclosureLabel disclosure={p.disclosure} />
                  <ArrowUpRight className="h-4 w-4 text-ink-soft transition-colors group-hover:text-accent" strokeWidth={1.5} />
                </div>
              </Link>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <h2 className="label-mono mb-4 text-ink-soft">My capabilities</h2>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-2">
            {skills.map((s) => (
              <div key={s.capability} className="bg-paper p-4">
                <p className="font-display text-base text-ink">{s.capability}</p>
                <p className="label-mono mt-2 text-ink-soft">{s.tech}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <p className="label-mono mt-12 text-ink-soft">
          Last verified against my plan — {new Date().getFullYear()}
        </p>
      </SectionBare>
    </main>
  );
}
