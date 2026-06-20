"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, FileText } from "lucide-react";
import { GitHubMark, LinkedInMark, MailMark, ScholarMark } from "@/components/site/brand-icons";
import { Section, SectionBare } from "@/components/site/section";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { HoverCard } from "@/components/motion/hover-card";
import { StatusChip, DisclosureLabel } from "@/components/site/chips";
import {
  profile,
  currentFocus,
  howIWork,
  projects,
  research,
  publication,
  timeline,
  skills,
  confidentialWorkNote,
} from "@/lib/content";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const commercial = projects.filter((p) => p.disclosure === "Commercial");
  const fnh = projects.find((p) => p.slug === "fnh-connect")!;
  const filmfave = projects.find((p) => p.slug === "filmfave")!;
  const powerfitness = projects.find((p) => p.slug === "powerfitness")!;
  const pqc = research.find((r) => r.slug === "pqc-mqtt-degraded-networks")!;
  const metaverse = research.find(
    (r) => r.slug === "federated-metaverse-authentication",
  )!;

  return (
    <main id="main">
      {/* ───────────────────────── Hero ───────────────────────── */}
      <SectionBare className="relative overflow-hidden pt-12 pb-6 sm:pt-20">
        <div aria-hidden className="bg-glow drift-slow pointer-events-none absolute inset-0" />
        <div className="relative grid grid-cols-1 items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <p className="label-mono mb-6 flex items-center gap-2 text-ink-soft">
                <span className="pulse-soft h-1.5 w-1.5 rounded-full bg-accent" />
                Perth · Curtin University · Part-time @ CodeXGate · Open to full-time roles
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="font-display text-[2.7rem] leading-[1.04] text-ink sm:text-6xl lg:text-[4.6rem]">
                {profile.headline.split("trust.").map((part, i) =>
                  i === 0 ? (
                    <span key={i}>
                      {part}
                      <span className="font-display-italic text-accent">trust.</span>
                    </span>
                  ) : (
                    <span key={i}>{part}</span>
                  ),
                )}
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
                {profile.tagline}
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/research"
                  className="group inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md hover:shadow-accent/30"
                >
                  Read my research
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
                </Link>
                <Link
                  href="/work"
                  className="group inline-flex items-center gap-2 rounded-xl border border-ink/15 bg-card px-5 py-3 text-sm font-medium text-ink transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                >
                  See my work
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Metadata card */}
          <Reveal delay={0.16} className="md:col-span-5">
            <div className="rounded-2xl border border-rule bg-card p-6 shadow-sm backdrop-blur-sm transition-transform duration-400 hover:-translate-y-1" style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}>
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-rule">
                  <Image
                    src={profile.portrait}
                    alt="Me — F.M. Ashfaq"
                    fill
                    sizes="64px"
                    className="object-cover"
                    priority
                  />
                </div>
                <div>
                  <p className="font-display text-xl text-ink">{profile.name}</p>
                  <p className="label-mono mt-1 text-ink-soft">{profile.role}</p>
                </div>
              </div>
              <div className="rule-h my-5" />
              <dl className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <dt className="label-mono mb-1 text-ink-soft">Now</dt>
                  <dd className="text-ink">Masters @ Curtin</dd>
                </div>
                <div>
                  <dt className="label-mono mb-1 text-ink-soft">Aiming</dt>
                  <dd className="text-ink">PhD — secure systems</dd>
                </div>
                <div>
                  <dt className="label-mono mb-1 text-ink-soft">Part-time</dt>
                  <dd className="text-ink">CodeXGate</dd>
                </div>
                <div>
                  <dt className="label-mono mb-1 text-ink-soft">Seeking</dt>
                  <dd className="text-ink">Full-time roles</dd>
                </div>
              </dl>
              <div className="rule-h my-5" />
              <div className="flex items-center gap-4">
                <a href={profile.links.github.href} target="_blank" rel="noreferrer noopener" aria-label="GitHub" className="text-ink-soft transition-colors hover:text-accent">
                  <GitHubMark className="h-4 w-4" />
                </a>
                <a href={profile.links.linkedin.href} target="_blank" rel="noreferrer noopener" aria-label="LinkedIn" className="text-ink-soft transition-colors hover:text-accent">
                  <LinkedInMark className="h-4 w-4" />
                </a>
                <a href={profile.links.scholar.href} target="_blank" rel="noreferrer noopener" aria-label="Google Scholar" className="text-ink-soft transition-colors hover:text-accent">
                  <ScholarMark className="h-4 w-4" />
                </a>
                <a href={profile.links.doi.href} target="_blank" rel="noreferrer noopener" aria-label="IEEE publication" className="text-ink-soft transition-colors hover:text-accent">
                  <FileText className="h-4 w-4" strokeWidth={1.5} />
                </a>
                <a href={`mailto:${profile.email}`} aria-label="Email" className="text-ink-soft transition-colors hover:text-accent">
                  <MailMark className="h-4 w-4" />
                </a>
                <Link href="/cv" className="label-mono ml-auto text-ink-soft transition-colors hover:text-accent">
                  CV ↗
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </SectionBare>

      {/* ───────────────────────── Current focus strip ───────────────────────── */}
      <SectionBare>
        <div className="overflow-hidden rounded-2xl border border-rule">
          <div className="grid grid-cols-2 divide-x divide-rule md:grid-cols-4">
            {currentFocus.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.05} className="bg-card p-5 transition-colors hover:bg-accent-soft/30 sm:p-6">
                <p className="label-mono text-accent">{item.label}</p>
                <p className="mt-2 text-sm text-ink-soft">{item.status}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </SectionBare>

      {/* ───────────────────────── Commercial work ───────────────────────── */}
      <Section
        index="§01"
        label="What I build at CodeXGate"
        title={
          <>
            Four client platforms I{" "}
            <span className="font-display-italic">ship and maintain.</span>
          </>
        }
      >
        <Stagger className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {commercial.map((p) => (
            <StaggerItem key={p.slug}>
              <HoverCard href={`/work/${p.slug}`} accent={p.accent} className="h-full">
                <div className="flex items-start justify-between gap-4">
                  <span className={cn("label-mono flex items-center gap-2", p.accent === "accent-warm" ? "text-accent-warm" : "text-accent")}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", p.accent === "accent-warm" ? "bg-accent-warm" : "bg-accent")} />
                    {p.client}
                  </span>
                  <DisclosureLabel disclosure={p.disclosure} />
                </div>
                <h3 className="mt-5 font-display text-2xl text-ink sm:text-3xl">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.tagline}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.capabilities.map((c) => (
                    <span key={c} className="label-mono rounded-lg border border-rule px-2 py-1 text-ink-soft">{c}</span>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-rule pt-4">
                  <span className="inline-flex items-center gap-1.5 text-sm text-ink transition-colors group-hover:text-accent">
                    What I did
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                  </span>
                  {p.clientUrl && (
                    <span
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(p.clientUrl, "_blank", "noopener,noreferrer"); }}
                      className="label-mono inline-flex items-center gap-1 text-ink-soft transition-colors group-hover:text-accent"
                    >
                      live <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
                    </span>
                  )}
                </div>
              </HoverCard>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-6">
          <p className="text-xs italic text-ink-soft">{confidentialWorkNote}</p>
        </Reveal>
      </Section>

      {/* ───────────────────────── Two flagships ───────────────────────── */}
      <Section
        index="§02"
        label="Personal flagships"
        title={
          <>
            One system I{" "}
            <span className="font-display-italic">run</span>, one I{" "}
            <span className="font-display-italic">measure.</span>
          </>
        }
      >
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <HoverCard href={`/work/${fnh.slug}`} accent="accent" className="h-full">
            <div className="flex items-center justify-between">
              <span className="label-mono flex items-center gap-2 text-ink-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Engineering
              </span>
              <DisclosureLabel disclosure={fnh.disclosure} />
            </div>
            <h3 className="mt-6 font-display text-2xl leading-tight text-ink sm:text-3xl">{fnh.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{fnh.tagline}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Next.js 15 · React 19", "Prisma · PostgreSQL", "RBAC · Audit"].map((m) => (
                <span key={m} className="label-mono rounded-lg border border-rule px-2 py-1 text-ink-soft">{m}</span>
              ))}
            </div>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm text-ink transition-colors group-hover:text-accent">
              Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </span>
          </HoverCard>

          <HoverCard href={`/research/${pqc.slug}`} accent="accent-warm" className="h-full">
            <div className="flex items-center justify-between">
              <span className="label-mono flex items-center gap-2 text-ink-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-warm" /> Active research
              </span>
              <StatusChip status={pqc.status} />
            </div>
            <h3 className="mt-6 font-display text-2xl leading-tight text-ink sm:text-3xl">{pqc.shortTitle}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{pqc.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["ML-KEM · ML-DSA", "MQTT v5 · tc/netem", "Reliability profile"].map((m) => (
                <span key={m} className="label-mono rounded-lg border border-rule px-2 py-1 text-ink-soft">{m}</span>
              ))}
            </div>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm text-ink transition-colors group-hover:text-accent-warm">
              Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </span>
          </HoverCard>
        </div>
      </Section>

      {/* ───────────────────────── Published research ───────────────────────── */}
      <Section index="§03" label="Verified foundation" title="My peer-reviewed starting point.">
        <Reveal className="mt-8">
          <article className="rounded-2xl border border-rule bg-card p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <StatusChip status={metaverse.status} />
              <span className="label-mono text-ink-soft">ICICT 2024 · pp. {publication.pages}</span>
            </div>
            <h3 className="mt-5 max-w-2xl font-display text-2xl leading-snug text-ink sm:text-3xl">{publication.title}</h3>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">{publication.summary}</p>
            <p className="label-mono mt-5 text-ink-soft">{publication.authors.join(" · ")}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-rule pt-5">
              <a href={publication.doiUrl} target="_blank" rel="noreferrer noopener" className="group inline-flex items-center gap-1.5 text-sm text-ink transition-colors hover:text-accent">
                <span className="link-quiet">DOI {publication.doi}</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={1.5} />
              </a>
              <Link href={`/research/${metaverse.slug}`} className="text-sm text-ink-soft transition-colors hover:text-ink">
                Read the case study →
              </Link>
            </div>
          </article>
        </Reveal>
      </Section>

      {/* ───────────────────────── Mobile pair ───────────────────────── */}
      <Section
        index="§04"
        label="Mobile breadth"
        title={
          <>
            Two React Native apps I{" "}
            <span className="font-display-italic">shipped to Android.</span>
          </>
        }
      >
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {[filmfave, powerfitness].map((p) => (
            <HoverCard key={p.slug} href={`/work/${p.slug}`} accent={p.accent} className="h-full">
              <span className="label-mono text-ink-soft">Mobile · React Native</span>
              <h3 className="mt-4 font-display text-2xl text-ink">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{p.tagline}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.capabilities.map((m) => (
                  <span key={m} className="label-mono rounded-lg border border-rule px-2 py-1 text-ink-soft">{m}</span>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-rule pt-4">
                <span className="inline-flex items-center gap-1.5 text-sm text-ink transition-colors group-hover:text-accent">
                  Case study <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                </span>
                {p.repo && (
                  <span onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(p.repo, "_blank", "noopener,noreferrer"); }} className="label-mono text-ink-soft transition-colors group-hover:text-accent">
                    repo ↗
                  </span>
                )}
              </div>
            </HoverCard>
          ))}
        </div>
      </Section>

      {/* ───────────────────────── How I work ───────────────────────── */}
      <Section index="§05" label="My method" title="How I actually work.">
        <Stagger className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {howIWork.map((step) => (
            <StaggerItem key={step.step} className="group bg-paper p-6 transition-colors hover:bg-accent-soft/20">
              <p className="font-display text-4xl text-accent">{step.step}</p>
              <p className="mt-4 font-display text-xl text-ink">{step.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{step.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* ───────────────────────── Capabilities ───────────────────────── */}
      <Section index="§06" label="Capabilities" title="Evidence, not a wall of logos.">
        <Stagger className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <StaggerItem key={skill.capability} className="group bg-paper p-6 transition-colors hover:bg-paper-2">
              <p className="font-display text-lg text-ink">{skill.capability}</p>
              <p className="label-mono mt-3 text-ink-soft">{skill.tech}</p>
              <Link href={skill.href} className="mt-4 inline-flex items-center gap-1 text-xs text-accent opacity-0 transition-all duration-300 group-hover:opacity-100">
                {skill.evidence} <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* ───────────────────────── Timeline ───────────────────────── */}
      <Section index="§07" label="My trajectory" title="From building apps to asking harder questions.">
        <Reveal className="mt-10">
          <ol className="relative border-l border-rule pl-6">
            {timeline.map((entry, i) => (
              <li key={entry.year} className="relative pb-8 last:pb-0">
                <span className={cn("absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-paper", i === timeline.length - 1 ? "bg-accent" : "bg-ink-soft/40")} />
                <p className="label-mono text-accent">{entry.year}</p>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink">{entry.label}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      {/* ───────────────────────── Contact ───────────────────────── */}
      <SectionBare className="py-16 sm:py-24">
        <Reveal>
          <div className="overflow-hidden rounded-2xl bg-ink p-8 text-paper shadow-lg sm:p-14">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
              <div className="md:col-span-8">
                <p className="label-mono mb-4 text-paper/60">Get in touch</p>
                <p className="font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
                  Working on something where{" "}
                  <span className="font-display-italic text-accent-warm">trust matters?</span>
                </p>
                <p className="mt-5 max-w-lg text-sm text-paper/70">
                  I'm currently looking for full-time roles alongside my
                  postgraduate studies, and I'm open to research collaboration
                  and secure engineering work. Email is the best way to reach me.
                </p>
              </div>
              <div className="md:col-span-4">
                <a href={`mailto:${profile.email}`} className="group inline-flex w-full items-center justify-between rounded-xl border border-paper/20 px-5 py-4 text-paper transition-colors hover:border-accent-warm hover:text-accent-warm">
                  <span className="text-sm">{profile.email}</span>
                  <MailMark className="h-4 w-4" />
                </a>
                <div className="mt-4 flex flex-wrap gap-3">
                  {[
                    { href: profile.links.github.href, label: "GitHub" },
                    { href: profile.links.linkedin.href, label: "LinkedIn" },
                    { href: profile.links.scholar.href, label: "Scholar" },
                    { href: profile.links.researchgate.href, label: "ResearchGate" },
                  ].map((l) => (
                    <a key={l.label} href={l.href} target="_blank" rel="noreferrer noopener" className="label-mono text-paper/60 transition-colors hover:text-accent-warm">
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </SectionBare>
    </main>
  );
}
