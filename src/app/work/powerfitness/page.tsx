import type { Metadata } from "next";
import { projects } from "@/lib/content";
import {
  CaseStudyHeader,
  CaseSection,
  Prose,
  KeyValue,
} from "@/components/site/case-study";
import { Reveal } from "@/components/motion/reveal";

const p = projects.find((x) => x.slug === "powerfitness")!;

export const metadata: Metadata = {
  title: "PowerFitness",
  description:
    "PowerFitness — the React Native workout companion I built with explicit state separation and component-level tests. Home, workout, exercise and rest views with shared context and a downloadable Android APK.",
  alternates: { canonical: "/work/powerfitness" },
};

export default function PowerFitnessPage() {
  return (
    <main id="main">
      <CaseStudyHeader
        eyebrow="My mobile coursework · React Native"
        title="A workout companion with explicit state separation and tests"
        tagline={p.tagline}
        date={p.date}
        role={p.role}
        disclosure={p.disclosure}
        categories={p.categories}
        capabilities={p.capabilities}
        repo={p.repo}
        accent="accent"
      />

      <CaseSection index="§01" label="Why it's here" title="My most test-evidenced mobile project.">
        <Prose>
          <p>
            PowerFitness earns its place for one reason: it's the mobile project
            with the clearest evidence of testing in my portfolio. Four Testing
            Library / Jest files cover component behaviour, and the architecture
            separates navigation/controllers from model/state folders in an
            MVC-style split. That discipline is what makes it credible to me
            rather than just another workout app.
          </p>
        </Prose>
      </CaseSection>

      <CaseSection index="§02" label="Implementation" title="My verified surfaces and state.">
        <Reveal>
          <KeyValue
            items={[
              { k: "Framework", v: "React Native · Expo" },
              { k: "Views", v: "Home · workout · exercise · rest" },
              { k: "Architecture", v: "Navigation/controller + model/state separation (MVC-style)" },
              { k: "Shared state", v: "Context: completed exercises · workouts · calories · minutes" },
              { k: "Tests", v: "4 Jest / Testing Library files" },
              { k: "Delivery", v: "Downloadable Android APK in the repository" },
            ]}
          />
        </Reveal>
      </CaseSection>

      <CaseSection index="§03" label="Limitations" title="I describe what I built, not what was promised.">
        <Prose>
          <p>
            The project ships as a public repository and a distributable
            Android APK. I describe the implemented screens and state flows
            I've personally reviewed, and treat the README's broader promises
            (goals, analytics, personalised plans) as scope that would still
            need a full code audit before I claim it as built.
          </p>
        </Prose>
      </CaseSection>
    </main>
  );
}
