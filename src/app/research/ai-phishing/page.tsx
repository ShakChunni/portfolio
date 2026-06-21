import type { Metadata } from "next";
import { research } from "@/lib/content";
import {
  CaseStudyHeader,
  CaseSection,
  Prose,
  Callout,
} from "@/components/site/case-study";
import { Reveal } from "@/components/motion/reveal";

const r = research.find((x) => x.slug === "ai-phishing")!;

export const metadata: Metadata = {
  title: "AI-assisted phishing research",
  description:
    "My active, early-stage study on how LLMs change the cost, personalisation and scale of phishing, and whether detectors can generalise across human, template, LLM-generated and adversarially perturbed examples. Research note — no fabricated abstract.",
  alternates: { canonical: "/research/ai-phishing" },
};

export default function AIPhishingPage() {
  return (
    <main id="main">
      <CaseStudyHeader
        eyebrow="My active study · research note"
        title="AI-assisted phishing research — work in progress"
        tagline={r.summary}
        date={r.updated}
        role="Active study — early stage"
        status={r.status}
        categories={["Security"]}
        capabilities={["LLMs", "Detection", "Evaluation"]}
        accent="accent-warm"
      />

      <CaseSection index="§01" label="Research note" title="A short note, not a fabricated abstract.">
        <Reveal>
          <Callout tone="accent-warm" label="Why I keep this page intentionally thin">
            <p>
              This is an active, ongoing study. The team is still shaping the
              working title, method, and collaborators, so I'm holding a short
              research note here rather than publishing a premature abstract.
              The framing below is firm; only the formal title, dataset, and
              results are still in motion.
            </p>
          </Callout>
        </Reveal>
      </CaseSection>

      <CaseSection index="§02" label="Possible framing" title="Offensive, defensive, human factors, evaluation.">
        <Prose>
          <p>A rigorous framing — already in motion — spans four angles:</p>
        </Prose>
        <Reveal className="mt-6">
          <ul className="space-y-4">
            {[
              ["Offensive", "How do LLMs change the cost, personalisation, fluency and scale of phishing?"],
              ["Defensive", "Can detectors generalise across human-written, template-based, LLM-generated, multilingual and adversarially perturbed phishing?"],
              ["Human factors", "Are AI-generated explanations useful without creating automation bias?"],
              ["Evaluation", "Out-of-distribution and temporal splits, model-family holdouts, calibration, false-positive costs, adversarial robustness."],
            ].map(([k, v]) => (
              <li key={k} className="grid grid-cols-1 gap-2 border-b border-rule pb-4 sm:grid-cols-12">
                <span className="label-mono text-accent sm:col-span-3">{k}</span>
                <span className="text-sm leading-relaxed text-ink sm:col-span-9">{v}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </CaseSection>

      <CaseSection index="§03" label="Ethics" title="No real-world targeting. No live credential collection.">
        <Reveal>
          <Callout tone="ink" label="My responsible-release boundary">
            <p>
              No real-world targeting, no live credential collection,
              institutional approval where human subjects are involved, and
              controlled release of any harmful artefacts. I use the relevant
              research landscape (LLM spear phishing, LLM-assisted detection and
              explanations, multimodal webpage/brand detection) to identify a
              genuine gap — not to imply I've reproduced others' results.
            </p>
          </Callout>
        </Reveal>
      </CaseSection>

      <CaseSection index="§04" label="What I need" title="Before this becomes a full case study.">
        <Reveal>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-2.5 text-sm text-ink sm:grid-cols-2">
            {[
              "Exact working title",
              "Research question",
              "Co-authors / supervisor",
              "Institution",
              "Status (idea · experiment · manuscript · submitted · review)",
              "Dataset provenance",
              "Method",
              "My role",
              "What I can make public",
              "Safe public summary",
            ].map((c) => (
              <li key={c} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-warm" />
                {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </CaseSection>
    </main>
  );
}
