import type { Metadata } from "next";
import Image from "next/image";
import { profile, education, experience } from "@/lib/content";
import { Section, SectionBare } from "@/components/site/section";
import { Reveal } from "@/components/motion/reveal";
import { GitHubMark, LinkedInMark, MailMark, ScholarMark } from "@/components/site/brand-icons";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "About me — F.M. Ashfaq. My transition from Dhaka to Perth, from general software engineering toward secure, human-centred systems. BRAC graduate, now studying at Curtin and working at CodeXGate.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main id="main">
      <SectionBare className="py-16 sm:py-24">
        <Reveal>
          <p className="section-marker">§03 — About me</p>
        </Reveal>
        <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
          <Reveal delay={0.05} className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-rule">
              <Image
                src={profile.portrait}
                alt="Me — F.M. Ashfaq"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="mt-4 flex items-center gap-4">
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
            </div>
          </Reveal>

          <div className="md:col-span-7">
            <Reveal delay={0.08}>
              <h1 className="font-display text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl">
                From building applications to{" "}
                <span className="font-display-italic">asking harder questions.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mt-6 max-w-xl space-y-4 text-[15px] leading-relaxed text-ink-soft">
                <p>
                  I'm a software engineer based in Perth, currently working with
                  CodeXGate and continuing my studies at Curtin University. My
                  work sits between end-to-end product engineering and applied
                  security research. I'm interested in systems that operate
                  under meaningful constraints: clinical workflows where
                  accountability matters, low-bandwidth networks where
                  cryptographic overhead matters, and accessibility tools where
                  a model's real-world behaviour matters more than a headline
                  accuracy score.
                </p>
                <p>
                  I completed a B.Sc. in Computer Science at BRAC University in
                  2024. My undergraduate research led to an IEEE conference
                  paper on authentication in federated metaverse systems. Since
                  then, my research direction has expanded toward post-quantum
                  cryptography over MQTT in degraded networks and the changing
                  relationship between generative AI and phishing attacks.
                </p>
                <p>
                  I'm an aspiring PhD candidate — pursuing a Masters at Curtin
                  with a research direction toward secure and human-centred
                  systems, and developing an early-stage, offline BdSL
                  emergency-triage translation pipeline. I frame that project
                  as research on purpose: the data pipeline, safety checks,
                  baseline model and held-out evaluation come before any
                  deployment claim.
                </p>
                <p>
                  That approach reflects how I want to work more broadly — build
                  carefully, measure honestly, and make security and
                  accessibility part of the architecture rather than an
                  afterthought.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </SectionBare>

      <Section index="§01" label="Education" title="Two institutions, one trajectory.">
        <Reveal className="mt-8 flex flex-col">
          {education.map((e) => (
            <div key={e.institution} className="grid grid-cols-1 gap-4 border-b border-rule py-7 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-3">
                <p className="label-mono text-accent">{e.period}</p>
              </div>
              <div className="md:col-span-9">
                <h3 className="font-display text-2xl text-ink">{e.institution}</h3>
                <p className="label-mono mt-1 text-ink-soft">
                  {e.programme} · {e.place}
                  {e.cgpa ? ` · CGPA ${e.cgpa}` : ""}
                </p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">{e.note}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </Section>

      <Section index="§02" label="Experience" title="My short, honest record.">
        <Reveal className="mt-8 flex flex-col">
          {experience.map((x) => (
            <div key={x.company} className="grid grid-cols-1 gap-4 border-b border-rule py-7 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-3">
                <p className="label-mono text-accent">{x.period}</p>
                <p className="label-mono mt-1 text-ink-soft">{x.location}</p>
              </div>
              <div className="md:col-span-9">
                <h3 className="font-display text-xl text-ink">{x.role} · {x.company}</h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">{x.summary}</p>
                {x.bullets && (
                  <ul className="mt-4 space-y-1.5 text-sm text-ink-soft">
                    {x.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </Reveal>
      </Section>
    </main>
  );
}
