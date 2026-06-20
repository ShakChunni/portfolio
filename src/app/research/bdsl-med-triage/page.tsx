import type { Metadata } from "next";
import { research } from "@/lib/content";
import {
  CaseStudyHeader,
  CaseSection,
  Prose,
  Callout,
  KeyValue,
} from "@/components/site/case-study";
import { Reveal } from "@/components/motion/reveal";

const r = research.find((x) => x.slug === "bdsl-med-triage")!;

export const metadata: Metadata = {
  title: "BdSL Emergency Triage Translation",
  description:
    "An offline, bidirectional Bengali Sign Language translation system I'm building for emergency medical triage. MediaPipe Holistic landmarks, a two-layer LSTM baseline, and held-out evaluation — pipeline first, claims after.",
  alternates: { canonical: "/research/bdsl-med-triage" },
};

export default function BdSLPage() {
  return (
    <main id="main">
      <CaseStudyHeader
        eyebrow="My research pilot · accessibility"
        title="BdSL Emergency Triage Translation"
        tagline={r.summary}
        date={r.updated}
        role="Early-stage research — pipeline complete, results pending"
        status={r.status}
        categories={["Healthcare", "Security"]}
        capabilities={["Python · TensorFlow/Keras", "MediaPipe Holistic", "scikit-learn"]}
        accent="accent"
      />

      <CaseSection index="§01" label="Research question" title={r.question}>
        <Prose>
          <p>
            Deaf sign-language users face communication barriers in emergency
            medical settings. BdSL remains a comparatively low-resource
            language, and the literature repeatedly names limited data, signer
            variability, viewpoint variation and weak real-world generalisation
            as the central problems. A triage-specific pilot narrows my scope to
            the small, high-value vocabulary where offline access and latency
            can matter most.
          </p>
        </Prose>
      </CaseSection>

      <CaseSection index="§02" label="Pipeline" title="I built stages 1–5. TFLite export is deferred on purpose.">
        <Prose>
          <p>
            My current implementation covers data collection, raw-video audit,
            keypoint extraction, dataset assembly, baseline training and
            held-out evaluation. I intentionally deferred TFLite export for
            mobile deployment until the six-class pilot shows believable
            evaluation — deploying an unvalidated model in a safety-sensitive
            setting would be the wrong order of operations.
          </p>
        </Prose>
        <Reveal className="mt-8">
          <div className="rounded-2xl border border-rule bg-paper-2/50 p-5 sm:p-7">
            <p className="label-mono mb-4 text-ink-soft">My verified pipeline stages</p>
            <ol className="space-y-3 text-sm text-ink">
              {[
                ["Stage 0", "Automated class-wise webcam capture (OpenCV)"],
                ["Stage 1", "Raw-video audit — flags corrupt, too-short, too-dark clips"],
                ["Stage 2", "MediaPipe Holistic landmark extraction → (60, 1692) per clip"],
                ["Stage 3", "Deterministic dataset assembly with validation + provenance manifests"],
                ["Stage 4", "Two-layer LSTM baseline, stratified split, all seeds locked"],
                ["Stage 5", "Held-out evaluation, per-class metrics, confusion matrix, curves"],
              ].map(([stage, desc]) => (
                <li key={stage} className="flex gap-4">
                  <span className="label-mono w-20 shrink-0 text-accent">{stage}</span>
                  <span>{desc}</span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
        <Reveal className="mt-6">
          <KeyValue
            items={[
              { k: "Sequence length", v: "60 frames" },
              { k: "Features / frame", v: "1,692 (face 478 + pose 33 + L/R hand 21+21)" },
              { k: "Baseline model", v: "LSTM(64) → LSTM(64) → Dense(64) → Dropout → Softmax" },
              { k: "Splits", v: "Stratified train / val / test, fixed seeds" },
              { k: "Callbacks", v: "ModelCheckpoint · EarlyStopping · ReduceLROnPlateau · CSVLogger" },
              { k: "Guards", v: "Refuses to train on <2 classes; refuses eval without model/test" },
            ]}
          />
        </Reveal>
      </CaseSection>

      <CaseSection index="§03" label="Why now" title="The discipline is my portfolio piece, not a result.">
        <Prose>
          <p>
            What makes this project worth showing now is the research discipline,
            not an accuracy number. My audit trail, shape validation,
            missing-landmark handling, deterministic labels, leakage-aware
            splits and my refusal to report a single-class "accuracy" are all
            choices that make a future result credible. A one-class model can
            tell me nothing — and my pipeline says so out loud rather than
            hiding it.
          </p>
        </Prose>
      </CaseSection>

      <CaseSection index="§04" label="Open questions" title="Five questions my pilot is designed to answer.">
        <Reveal>
          <ol className="space-y-4">
            {[
              "Can a compact landmark-based sequence model recognise a small emergency-triage vocabulary offline with acceptable latency?",
              "How well does it generalise across signers, lighting, camera position, handedness, and signing speed?",
              "Which landmark groups provide the best accuracy/latency trade-off?",
              "How should I surface uncertainty and abstention in a safety-sensitive interface?",
              "What's required for bidirectional text-to-sign output without reducing BdSL to word-for-word animation?",
            ].map((q, i) => (
              <li key={i} className="flex gap-4 border-b border-rule pb-4 text-sm text-ink">
                <span className="label-mono text-accent">Q{i + 1}</span>
                <span className="leading-relaxed">{q}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </CaseSection>

      <CaseSection index="§05" label="Dataset & limits" title="Enough for a pipeline smoke test, not a claim.">
        <Reveal>
          <Callout tone="accent-warm" label="My current dataset status — confirm before publishing numbers">
            <p>
              My supplied description reports one collected class with 50 clips.
              That's enough to validate the data plumbing end-to-end — it's{" "}
              <strong>not</strong> enough for meaningful classification. I make
              no accuracy, F1, or generalisation claim here. The one-class smoke
              test verifies that audit, extraction and tensor assembly work; it
              never trains a model.
            </p>
          </Callout>
        </Reveal>
      </CaseSection>

      <CaseSection index="§06" label="Evaluation required" title="What must hold before I make stronger claims.">
        <Reveal>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-2.5 text-sm text-ink sm:grid-cols-2">
            {[
              "Multiple fluent BdSL signers + signer-independent splits",
              "Class balance + collection-protocol documentation",
              "Accuracy, macro-F1, per-class recall, confusion matrix, calibration",
              "False-positive / false-negative analysis for medical phrases",
              "Latency, model size, and offline-device benchmarks",
              "Accessibility review with Deaf/BdSL users + triage-staff domain review",
              "Consent, governance, retention and representativeness docs",
              "A visible 'not medical advice / not an interpreter' boundary",
            ].map((c) => (
              <li key={c} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </CaseSection>

      <CaseSection index="§07" label="Ethics" title="Accessibility, not just a technical problem.">
        <Reveal>
          <Callout tone="ink" label="My responsible framing">
            <p>
              I describe limitations and community involvement. I don't frame
              Deaf users only as a technical problem. This system is a research
              prototype under active development — it's <strong>not</strong> a
              medical device and shouldn't be used for clinical decision-making
              in its current state.
            </p>
          </Callout>
        </Reveal>
      </CaseSection>
    </main>
  );
}
