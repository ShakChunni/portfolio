import type { Metadata } from "next";
import { projects } from "@/lib/content";
import {
  CaseStudyHeader,
  CaseSection,
  Prose,
  KeyValue,
} from "@/components/site/case-study";
import { Reveal } from "@/components/motion/reveal";

const p = projects.find((x) => x.slug === "filmfave")!;

export const metadata: Metadata = {
  title: "FilmFave",
  description:
    "FilmFave — the React Native movie & TV discovery app I built on the TMDb API. Service abstraction, native-stack navigation, loading and data states, reusable cards, and Android delivery.",
  alternates: { canonical: "/work/filmfave" },
};

export default function FilmFavePage() {
  return (
    <main id="main">
      <CaseStudyHeader
        eyebrow="My mobile engineering · React Native"
        title="Turning a third-party API into a coherent mobile experience"
        tagline={p.tagline}
        date={p.date}
        role={p.role}
        disclosure={p.disclosure}
        categories={p.categories}
        capabilities={p.capabilities}
        repo={p.repo}
        accent="accent-warm"
      />

      <CaseSection index="§01" label="The angle" title="The plumbing is the point.">
        <Prose>
          <p>
            FilmFave is the strongest mobile product in my portfolio not because
            of what it shows, but because of how it gets there. The value is in
            the plumbing — a clean Axios service layer around The Movie Database
            API, native-stack navigation, careful loading and data states, and
            reusable card components that keep the screens consistent.
          </p>
        </Prose>
      </CaseSection>

      <CaseSection index="§02" label="Implementation" title="Verified from my repository.">
        <Reveal>
          <KeyValue
            items={[
              { k: "Framework", v: "React Native 0.71 · Expo 48" },
              { k: "Navigation", v: "Native-stack" },
              { k: "API", v: "The Movie Database (TMDb) via Axios service layer" },
              { k: "Surfaces", v: "Now-playing · upcoming · on-air TV · genres · search · details" },
              { k: "Assets", v: "Posters · video URL construction · custom fonts" },
              { k: "Delivery", v: "Distributed Android APK" },
            ]}
          />
        </Reveal>
      </CaseSection>

      <CaseSection index="§03" label="What it taught me" title="Service abstraction first, UI second.">
        <Prose>
          <p>
            Building FilmFave made the lesson concrete for me: separate the
            network service from the screens, model loading/error/empty states
            explicitly, and reuse a small set of card components instead of
            bespoke layouts per screen. Those habits carried directly into
            PowerFitness and into the service-layer discipline of FNH Connect.
          </p>
        </Prose>
      </CaseSection>

      <CaseSection index="§04" label="Limitations" title="What my evidence does and doesn't support.">
        <Prose>
          <p>
            FilmFave is a client-side app — not a community product, and there
            is no backend, user system, or live data. The project ships as a
            public repository and a distributable Android APK; the public
            repository is the source of truth for what was actually built, and
            the README describes a broader scope than the implementation
            delivers. I haven't audited the TMDb API configuration for
            committed keys, so I won't direct portfolio traffic through the
            live TMDb integration.
          </p>
        </Prose>
      </CaseSection>
    </main>
  );
}
