import type { Metadata } from "next";
import { projects } from "@/lib/content";
import {
  CaseStudyHeader,
  CaseSection,
  Prose,
  Callout,
} from "@/components/site/case-study";
import { Reveal } from "@/components/motion/reveal";
import Link from "next/link";

const p = projects.find((x) => x.slug === "feroza-accounts")!;

export const metadata: Metadata = {
  title: "Feroza Accounts Management",
  description:
    "Feroza Accounts Management — the predecessor to FNH Connect. A working departmental tool I built for patient fees, expenditure, pathology, income, sessions and an admin dashboard. Historical context, not a flagship.",
  alternates: { canonical: "/work/feroza-accounts" },
};

export default function FerozaPage() {
  return (
    <main id="main">
      <CaseStudyHeader
        eyebrow="My historical work · predecessor to FNH Connect"
        title="The first generation — a working departmental tool"
        tagline={p.tagline}
        date={p.date}
        role={p.role}
        disclosure={p.disclosure}
        categories={p.categories}
        capabilities={p.capabilities}
        repo={p.repo}
        accent="accent"
      />

      <CaseSection index="§01" label="Historical value" title="What it delivered, and what it lacked.">
        <Prose>
          <p>
            I present this as the predecessor to FNH Connect, not a separate
            flagship. Its value is historical: my early delivery of patient fee
            calculations, expenditure evidence, pathology selection, income
            views, sessions and an admin dashboard, built with Node.js, SQL,
            HTML, JavaScript and CSS. It did the departmental job — and its
            limits (editable totals, no unified domain model, no consistent
            security boundary) are exactly what motivated my rebuild.
          </p>
        </Prose>
      </CaseSection>

      <CaseSection index="§02" label="The continuation" title="Read my rebuild.">
        <Reveal>
          <Callout tone="accent" label="Where this leads">
            <p>
              The structural lessons from Feroza Accounts became{" "}
              <Link href="/work/fnh-connect" className="link-quiet text-accent">
                FNH Connect
              </Link>{" "}
              — a unified domain model, auditable financial ledgers, and
              defence-in-depth security. This page exists for my trajectory,
              not as a standalone centrepiece.
            </p>
          </Callout>
        </Reveal>
      </CaseSection>

      <CaseSection index="§03" label="Limitations" title="My source hygiene isn't a model here.">
        <Prose>
          <p>
            The repository includes generated, dependency and archive
            artefacts, so its source hygiene isn't a model for my current
            practice. I link it for historical context, not as an example of
            repository maintenance.
          </p>
        </Prose>
      </CaseSection>
    </main>
  );
}
