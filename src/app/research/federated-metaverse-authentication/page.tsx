import type { Metadata } from "next";
import { research, publication } from "@/lib/content";
import {
  CaseStudyHeader,
  CaseSection,
  Prose,
  Callout,
  KeyValue,
} from "@/components/site/case-study";
import { Reveal } from "@/components/motion/reveal";
import { StatusChip } from "@/components/site/chips";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const r = research.find((x) => x.slug === "federated-metaverse-authentication")!;

export const metadata: Metadata = {
  title: "Federated Metaverse Authentication",
  description:
    "My IEEE conference paper — Dynamic Authentication Scheme for Advanced Security in Federated Metaverse Systems (ICICT 2024). Full citation, DOI and BibTeX.",
  alternates: { canonical: "/research/federated-metaverse-authentication" },
};

export default function MetaverseAuthPage() {
  return (
    <main id="main">
      <CaseStudyHeader
        eyebrow="My published research · IEEE ICICT 2024"
        title="Dynamic Authentication Scheme for Advanced Security in Federated Metaverse Systems"
        tagline={r.summary}
        date={publication.date}
        role="Co-author (group publication)"
        status={r.status}
        categories={["Security"]}
        capabilities={["Authentication", "Distributed systems", "Security analysis"]}
        external={publication.doiUrl}
        accent="accent"
      />

      <CaseSection index="§01" label="Citation" title="The verified record.">
        <Reveal>
          <article className="rounded-2xl border border-rule bg-card p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between">
              <p className="label-mono text-ink-soft">Formal citation</p>
              <StatusChip status="Published" />
            </div>
            <p className="mt-5 text-[15px] leading-relaxed text-ink">
              {publication.authors.join(", ")}. “{publication.title}.” In{" "}
              <em>{publication.venue}</em>, pp. {publication.pages},{" "}
              {publication.date}. DOI:{" "}
              <a href={publication.doiUrl} target="_blank" rel="noreferrer noopener" className="link-quiet text-accent">
                {publication.doi}
              </a>
              .
            </p>
            <div className="mt-6 flex flex-wrap gap-3 border-t border-rule pt-5">
              <a href={publication.doiUrl} target="_blank" rel="noreferrer noopener" className="label-mono inline-flex items-center gap-1 text-ink transition-colors hover:text-accent">
                Open on IEEE Xplore <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </a>
              <a href="https://scholar.google.com/citations?user=-tP7SxwAAAAJ&hl=en" target="_blank" rel="noreferrer noopener" className="label-mono inline-flex items-center gap-1 text-ink transition-colors hover:text-accent">
                My Google Scholar <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </a>
              <a href="https://www.researchgate.net/publication/388244120_Dynamic_Authentication_Scheme_for_Advanced_Security_in_Federated_Metaverse_Systems" target="_blank" rel="noreferrer noopener" className="label-mono inline-flex items-center gap-1 text-ink-soft transition-colors hover:text-accent">
                ResearchGate record <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </a>
            </div>
          </article>
        </Reveal>

        <Reveal className="mt-6">
          <details className="group rounded-2xl border border-rule bg-paper-2/40 p-5">
            <summary className="label-mono cursor-pointer text-ink-soft transition-colors hover:text-accent">
              BibTeX — click to expand
            </summary>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-rule bg-ink p-4 font-mono text-xs leading-relaxed text-paper">
{publication.bibtex}
            </pre>
          </details>
        </Reveal>
      </CaseSection>

      <CaseSection index="§02" label="Problem" title="Identity continuity across federated virtual environments.">
        <Prose>
          <p>
            My paper addresses identity and access security across federated
            metaverse environments. It proposes a dynamic authentication
            framework intended to strengthen secure identity management in
            decentralised virtual environments — where identity must be
            continuous and trustworthy even as users cross between federated
            domains.
          </p>
        </Prose>
      </CaseSection>

      <CaseSection index="§03" label="What the record verifies" title="Author list, venue, pages — and nothing invented beyond it.">
        <Reveal>
          <KeyValue
            items={[
              { k: "Venue", v: publication.venue },
              { k: "Date", v: publication.date },
              { k: "Pages", v: `pp. ${publication.pages}` },
              { k: "DOI", v: publication.doi },
              { k: "Authors", v: publication.authors.length + " (group publication)" },
              { k: "Type", v: "Peer-reviewed conference paper (not a journal)" },
            ]}
          />
        </Reveal>
      </CaseSection>

      <CaseSection index="§04" label="My contribution" title="Second author in a five-author group paper.">
        <Reveal>
          <Callout tone="accent-warm" label="What I did on this paper">
            <p>{publication.note}</p>
          </Callout>
        </Reveal>
      </CaseSection>

      <CaseSection index="§05" label="What I'd revisit" title="From authentication primitives to constrained-network cost.">
        <Prose>
          <p>
            This work taught me a maturation arc — from learning authentication
            primitives toward asking systems-level questions. My natural
            continuation isn't "more metaverse," but the{" "}
            <Link href="/research/pqc-mqtt-degraded-networks" className="link-quiet text-accent">
              post-quantum cryptography over MQTT
            </Link>{" "}
            study: the same instinct for trust and identity, now measured
            against the real cost of cryptographic overhead on lossy, latent
            networks.
          </p>
        </Prose>
      </CaseSection>
    </main>
  );
}
