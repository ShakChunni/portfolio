import type { Metadata } from "next";
import { projects } from "@/lib/content";
import {
  CaseStudyHeader,
  CaseSection,
  Prose,
  KeyValue,
  Callout,
} from "@/components/site/case-study";
import { Reveal } from "@/components/motion/reveal";

const p = projects.find((x) => x.slug === "conference-connect")!;

export const metadata: Metadata = {
  title: "Conference Connect",
  description:
    "Conference Connect — my Curtin coursework. A real-time conference scheduler with LinkedIn OpenID Connect, protected routes, local persistence and Socket.io rooms with live chat, participant lists and join/leave events.",
  alternates: { canonical: "/work/conference-connect" },
};

export default function ConferenceConnectPage() {
  return (
    <main id="main">
      <CaseStudyHeader
        eyebrow="My Curtin coursework · real-time web"
        title="A real-time conference scheduler with OAuth and Socket.io rooms"
        tagline={p.tagline}
        date={p.date}
        role={p.role}
        disclosure={p.disclosure}
        categories={p.categories}
        capabilities={p.capabilities}
        repo={p.repo}
        accent="accent"
      />

      <CaseSection index="§01" label="Evidence" title="What it demonstrates for me.">
        <Prose>
          <p>
            My Curtin coursework — a React SPA with React Router,
            React-Bootstrap, LinkedIn OpenID Connect, protected routes, local
            schedule persistence, and Socket.io rooms with live chat,
            participant lists and counts, history, and join/leave events. It's
            useful evidence of real-time web and OAuth integration.
          </p>
        </Prose>
        <Reveal className="mt-8">
          <KeyValue
            items={[
              { k: "Frontend", v: "React SPA · React Router · React-Bootstrap" },
              { k: "Auth", v: "LinkedIn OpenID Connect · protected routes" },
              { k: "Real-time", v: "Socket.io rooms · live chat · participant lists/counts" },
              { k: "Persistence", v: "Local schedule persistence (client-side)" },
            ]}
          />
        </Reveal>
      </CaseSection>

      <CaseSection index="§02" label="Limitations" title="I label it coursework, not a product.">
        <Reveal>
          <Callout tone="accent-warm" label="My honest scope">
            <p>
              The server stores rooms and chat in memory, so this isn't a
              production scalability or persistence claim. I label it as{" "}
              <strong>Curtin coursework</strong>, not client work or a
              commercial product.
            </p>
          </Callout>
        </Reveal>
      </CaseSection>
    </main>
  );
}
