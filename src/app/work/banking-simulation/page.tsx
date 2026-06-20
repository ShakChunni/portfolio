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

const p = projects.find((x) => x.slug === "banking-simulation")!;

export const metadata: Metadata = {
  title: "Online Banking Simulation",
  description:
    "Online Banking Simulation — my Curtin coursework. A server-rendered MVC banking system with Node, Express, MongoDB, Passport, bcrypt, ownership middleware and tests. All banking operations are explicitly simulated.",
  alternates: { canonical: "/work/banking-simulation" },
};

export default function BankingPage() {
  return (
    <main id="main">
      <CaseStudyHeader
        eyebrow="My Curtin coursework · server-rendered MVC"
        title="Server-rendered MVC banking with ownership middleware and tests"
        tagline={p.tagline}
        date={p.date}
        role={p.role}
        disclosure={p.disclosure}
        categories={p.categories}
        capabilities={p.capabilities}
        repo={p.repo}
        accent="accent-warm"
      />

      <CaseSection index="§01" label="Evidence" title="Authorization, validation, and tests.">
        <Prose>
          <p>
            My Curtin coursework using Node, Express, MongoDB/Mongoose, Pug,
            Bootstrap, Joi, Passport Local, sessions and bcrypt —
            registration/login, owned accounts, simulated credit/debit/
            transfers, search, admin controls, validation, ownership
            middleware, and tests covering validation, auth middleware,
            utilities and template compilation.
          </p>
        </Prose>
        <Reveal className="mt-8">
          <KeyValue
            items={[
              { k: "Server", v: "Node · Express · MongoDB/Mongoose" },
              { k: "Views", v: "Pug · Bootstrap" },
              { k: "Auth", v: "Passport Local · sessions · bcrypt" },
              { k: "Validation", v: "Joi · ownership middleware" },
              { k: "Operations", v: "Simulated credit / debit / transfers · search · admin" },
              { k: "Tests", v: "Validation · auth middleware · utilities · template compilation" },
            ]}
          />
        </Reveal>
      </CaseSection>

      <CaseSection index="§02" label="Limitations" title="Everything I simulate is simulated.">
        <Reveal>
          <Callout tone="accent-warm" label="My honest scope">
            <p>
              All banking operations are explicitly <strong>simulated</strong>.
              This is evidence of server-rendered MVC patterns, authorization,
              validation and tests — not a financial product.
            </p>
          </Callout>
        </Reveal>
      </CaseSection>
    </main>
  );
}
