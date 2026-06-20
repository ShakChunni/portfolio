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

const r = research.find((x) => x.slug === "pqc-mqtt-degraded-networks")!;

export const metadata: Metadata = {
  title: "PQC × MQTT under degraded networks",
  description:
    "My active research — evaluating how post-quantum cryptography affects MQTT-based IoT communication when network conditions are degraded. Comparing classical TLS-secured MQTT with PQC/hybrid TLS under controlled network degradation.",
  alternates: { canonical: "/research/pqc-mqtt-degraded-networks" },
};

export default function PQCPage() {
  return (
    <main id="main">
      <CaseStudyHeader
        eyebrow="My active research · testbed design"
        title="Measuring the operational cost of post-quantum security for MQTT under degraded networks"
        tagline={r.summary}
        date={r.updated}
        role="Ongoing research — testbed in progress"
        status={r.status}
        categories={["Security"]}
        capabilities={["Post-quantum cryptography", "MQTT v5", "Network emulation"]}
        accent="accent-warm"
      />

      {/* The problem */}
      <CaseSection index="§01" label="The problem" title="PQC meets unstable IoT networks.">
        <Prose>
          <p>
            My research focuses on evaluating how post-quantum cryptography
            affects MQTT-based IoT communication when the network conditions are
            degraded. MQTT is widely used in IoT because it is lightweight and
            suitable for devices that may have limited processing power, memory,
            bandwidth, or battery capacity. In practical deployments, MQTT
            communication is usually protected using TLS, which provides
            encryption, integrity, and authentication.
          </p>
          <p>
            However, current TLS deployments often rely on classical public-key
            cryptography such as RSA or elliptic curve cryptography, which may
            become vulnerable to future quantum computers. Post-quantum
            cryptography, particularly NIST-standardised algorithms such as{" "}
            <strong>ML-KEM</strong> and <strong>ML-DSA</strong>, is being
            introduced to address this future risk.
          </p>
        </Prose>
      </CaseSection>

      {/* Why this is specific */}
      <CaseSection index="§02" label="What's new" title="Not a new topic — a more specific question.">
        <Prose>
          <p>
            Existing research has already studied PQC in MQTT, PQC-TLS,
            KEM-based MQTT, and PQC performance in constrained IoT or edge
            environments. Therefore, my work does <strong>not</strong> claim
            that PQC-secured MQTT is a new topic. Instead, the focus is on a
            more specific practical problem:{" "}
            <strong>how reliable PQC-secured MQTT remains when the underlying
            IoT-edge network becomes unstable.</strong>
          </p>
          <p>
            IoT networks often experience packet loss, latency, jitter,
            bandwidth constraints, and intermittent connectivity. Since PQC
            algorithms usually involve larger keys, ciphertexts, signatures, or
            certificates than classical cryptography, the TLS handshake may
            become larger and more sensitive to poor network conditions. This
            can lead to higher connection delay, more retransmissions, packet
            fragmentation, reconnect issues, or handshake failure.
          </p>
        </Prose>
      </CaseSection>

      {/* Research question */}
      <CaseSection index="§03" label="Research question" title={r.question}>
        <Reveal>
          <Callout tone="accent" label="The question I'm answering">
            <p>
              How does PQC-secured MQTT behave when the underlying IoT-edge
              network becomes unstable — and which mitigation strategies restore
              reliability?
            </p>
          </Callout>
        </Reveal>
      </CaseSection>

      {/* Planned study */}
      <CaseSection index="§04" label="Planned study" title="Controlled degradation, repeatable measurement.">
        <Prose>
          <p>
            The planned study will compare classical TLS-secured MQTT with PQC
            or hybrid TLS-secured MQTT under controlled network degradation.
            The proposed testbed will include an MQTT client, a network
            emulator, and an MQTT broker. Tools such as Linux{" "}
            <code>tc/netem</code> can be used to introduce packet loss, delay,
            jitter, and bandwidth limits in a repeatable way.
          </p>
        </Prose>
        <Reveal className="mt-8">
          <KeyValue
            items={[
              { k: "Components", v: "MQTT client · network emulator · MQTT broker" },
              { k: "Emulation", v: "Linux tc/netem — loss, delay, jitter, bandwidth" },
              { k: "Crypto", v: "Classical TLS vs PQC/hybrid TLS (ML-KEM, ML-DSA)" },
              { k: "Standards", v: "NIST FIPS 203 / 204 · OASIS MQTT v5.0" },
            ]}
          />
        </Reveal>
      </CaseSection>

      {/* Metrics */}
      <CaseSection index="§05" label="Metrics" title="What I'll measure.">
        <Reveal>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-2.5 text-sm text-ink sm:grid-cols-2">
            {[
              "Handshake latency",
              "Handshake success rate",
              "Publish latency",
              "Reconnect delay",
              "Packet overhead",
              "Fragmentation behaviour",
              "CPU usage",
              "Memory usage",
              "Failure thresholds",
            ].map((c) => (
              <li key={c} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-warm" />
                {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </CaseSection>

      {/* Mitigation strategies */}
      <CaseSection index="§06" label="Mitigations" title="What might restore reliability.">
        <Reveal>
          <div className="rounded-2xl border border-rule bg-paper-2/50 p-5 sm:p-7">
            <p className="label-mono mb-4 text-ink-soft">Strategies I'll evaluate</p>
            <ul className="space-y-2.5 text-sm text-ink">
              {[
                "Persistent MQTT sessions — preserve subscriptions across reconnects",
                "TLS session resumption — avoid full handshake on reconnect",
                "Timeout tuning — adapt to degraded network characteristics",
                "MQTT QoS adjustments — trade reliability for overhead (QoS 0/1/2)",
              ].map((c) => (
                <li key={c} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </CaseSection>

      {/* Expected contribution */}
      <CaseSection index="§07" label="Expected contribution" title="A practical reliability profile.">
        <Prose>
          <p>
            The expected contribution is a practical performance and reliability
            profile of PQC-secured MQTT under adverse IoT-edge network
            conditions. The goal is to identify when performance begins to
            degrade significantly, where failures occur, and which mitigation
            strategies can improve reliability. This can help guide future
            deployment of quantum-resistant security in real-world IoT systems
            where network stability cannot be assumed.
          </p>
        </Prose>
      </CaseSection>

      {/* Honest status */}
      <CaseSection index="§08" label="Status" title="Where I am right now.">
        <Reveal>
          <Callout tone="accent-warm" label="My honest status">
            <p>
              The testbed design is in progress. The research question,
              metrics, and mitigation strategies are defined. I'm building the
              controlled environment next — the MQTT client/broker setup and
              the tc/netem network emulation layer. No results yet; I won't
              post premature winner/loser conclusions. Standards facts (FIPS
              203/204, MQTT 5.0) are separated from my experimental
              observations.
            </p>
          </Callout>
        </Reveal>
      </CaseSection>
    </main>
  );
}
