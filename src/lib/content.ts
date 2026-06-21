/**
 * Structured content — first person throughout.
 * I write about my own work as "I", not as a third party.
 * Confidence labels follow the plan's evidence rules.
 */

export type Confidence =
  | "verified"
  | "user-confirmed"
  | "repository-verified"
  | "provisional";

export type ResearchStatus =
  | "Published"
  | "Experimenting"
  | "Data collection"
  | "Writing"
  | "Active study"
  | "Research note";

export type Disclosure =
  | "Public repo"
  | "Research prototype"
  | "Coursework"
  | "Commercial";

export type WorkCategory =
  | "Systems"
  | "Mobile"
  | "Security"
  | "Healthcare"
  | "Coursework"
  | "Commercial";

export const profile = {
  name: "F.M. Ashfaq",
  shortName: "Ashfaq",
  role: "Software engineer & applied-security researcher",
  location: "Perth, Western Australia",
  email: "ashfaq601230@gmail.com",
  cvUrl:
    "https://drive.google.com/file/d/1eGps7LC87C5KBIEMGb0eVCOOYqm-ZL73/view?usp=sharing",
  portrait: "/ashfaq-picture.png",
  headline: "I build systems for the places where software has to earn trust.",
  tagline:
    "I'm a postgraduate student at Curtin University and a part-time software engineer at CodeXGate, currently looking for full-time roles. My work moves between full-stack systems, post-quantum IoT research, AI-assisted threat detection, and accessible health tech.",
  links: {
    github: { label: "GitHub", href: "https://github.com/ShakChunni", handle: "ShakChunni" },
    linkedin: { label: "LinkedIn", href: "https://www.linkedin.com/in/f-m-ashfaq/", handle: "in/f-m-ashfaq" },
    researchgate: { label: "ResearchGate", href: "https://www.researchgate.net/profile/Fm-Ashfaq", handle: "Fm-Ashfaq" },
    scholar: { label: "Google Scholar", href: "https://scholar.google.com/citations?user=-tP7SxwAAAAJ&hl=en", handle: "F.M. Ashfaq" },
    doi: { label: "IEEE publication", href: "https://doi.org/10.1109/ICICT64387.2024.10839681", handle: "10.1109/ICICT64387.2024.10839681" },
  },
} as const;

export const currentFocus = [
  { id: "pqc", label: "PQC × MQTT", status: "Testbed in progress" },
  { id: "bdsl", label: "BdSL pilot", status: "Data collection / pipeline validation" },
  { id: "phishing", label: "AI phishing", status: "Manuscript research" },
  { id: "fnh", label: "FNH Connect", status: "Active engineering" },
] as const;

export const howIWork = [
  {
    step: "01",
    title: "I model the domain first",
    body: "Before I touch an interface, I understand the real workflows and invariants. Patient identity, payment allocation, audit trails — the model shapes every later decision I make.",
  },
  {
    step: "02",
    title: "I define the failure model",
    body: "I ask what can go wrong and what must be trusted. Threat models for authentication, leakage-aware splits for ML, adversarial inputs for detection.",
  },
  {
    step: "03",
    title: "I build the smallest credible system",
    body: "The smallest thing I can still measure honestly. A two-LSTM baseline with held-out evaluation beats one impressive accuracy number.",
  },
  {
    step: "04",
    title: "I measure, then document limits",
    body: "Per-class metrics, confusion matrices, false-positive costs. I admit what the evidence does not prove. Security and accessibility are architecture to me, not an afterthought.",
  },
] as const;

export const education = [
  {
    institution: "Curtin University",
    place: "Perth, Australia",
    programme: "Postgraduate study (Masters)",
    note: "I'm pursuing a Masters here, aspiring toward a PhD, with a research direction toward secure and human-centred systems.",
    period: "2026 — present",
    confidence: "verified" as Confidence,
  },
  {
    institution: "BRAC University",
    place: "Dhaka, Bangladesh",
    programme: "B.Sc. in Computer Science",
    note: "My undergraduate research led to an IEEE conference paper on dynamic authentication for federated metaverse systems.",
    period: "2020 — 2024",
    cgpa: "3.72 / 4.00",
    confidence: "verified" as Confidence,
  },
];

export const experience = [
  {
    company: "CodeXGate",
    role: "Software Engineer (Part-time)",
    period: "Aug 2024 — present",
    location: "Remote / Perth",
    summary:
      "I build full-stack web systems here part-time — product interfaces, backend services, data models, automation, and operational reporting. The work spans several client platforms you can read about below. I'm currently looking for a full-time role alongside my postgraduate studies.",
    bullets: [
      "End-to-end web application development and frontend/backend integration",
      "Database schema and system architecture work",
      "Data visualisation and operational tooling",
      "Maintainable delivery and version-control workflows",
    ],
    confidence: "verified" as Confidence,
  },
  {
    company: "Feroza Nursing Home",
    role: "SDE & Project Lead",
    period: "Apr 2023 — Jun 2024",
    location: "Dhaka, Bangladesh",
    summary:
      "I owned the healthcare operations system that became FNH Connect — patient accounts, pathology and infertility workflows, cash reconciliation, role-based access, and audit trails.",
    confidence: "user-confirmed" as Confidence,
  },
  {
    company: "Worktrooper",
    role: "Backend Engineer",
    period: "Sep 2022 — May 2024",
    location: "Remote",
    summary:
      "I worked as a backend engineer on the LittleBirdie project — optimising backend datasets with complex SQL aggregations and indexing strategies to reduce API latency, and overseeing critical data life-cycles with rigorous data entry and manual cleansing for the automated processing tools. I also collaborated with cross-functional teams to design data-driven React components that translated raw backend analytics into interactive user engagement metrics.",
    confidence: "user-confirmed" as Confidence,
  },
];

export const skills = [
  {
    capability: "Full-stack web",
    tech: "TypeScript, Next.js, React, Node.js, Express",
    evidence: "FNH Connect + client platforms at CodeXGate",
    href: "/work/fnh-connect",
  },
  {
    capability: "Data & domain modelling",
    tech: "PostgreSQL, Prisma, MySQL, MongoDB/Mongoose",
    evidence: "Auditable financial workflows + HR data models",
    href: "/work/tmi-sales-crm",
  },
  {
    capability: "Security engineering",
    tech: "Sessions, JWT, bcrypt, CSRF, RBAC, rate limiting, audit logs",
    evidence: "Middleware-first security across client systems",
    href: "/research/federated-metaverse-authentication",
  },
  {
    capability: "Mobile",
    tech: "React Native, Expo, Capacitor, navigation, Android/iOS builds",
    evidence: "FilmFave, PowerFitness, JD People Hub mobile",
    href: "/work/filmfave",
  },
  {
    capability: "Applied ML / research",
    tech: "Python, TensorFlow/Keras, MediaPipe, scikit-learn",
    evidence: "BdSL Med Triage pilot",
    href: "/research/bdsl-med-triage",
  },
  {
    capability: "Integrations & middleware",
    tech: "Apify, SFTP, OAuth/OpenID Connect, Fastify, BullMQ, webhooks",
    evidence: "MAVN enrichment + ERP middleware bridge",
    href: "/work/erp-middleware-bridge",
  },
];

export const timeline = [
  { year: "2020", label: "I started my B.Sc. in Computer Science at BRAC University, Dhaka." },
  { year: "2022", label: "Backend engineering at Worktrooper; my early mobile projects took shape." },
  { year: "2023", label: "I led healthcare operations software at Feroza Nursing Home." },
  { year: "2024", label: "My IEEE paper was published. I joined CodeXGate. I completed my BRAC degree." },
  { year: "2025", label: "I rebuilt FNH Connect as a structured, auditable platform. The BdSL pilot began." },
  { year: "2026", label: "I started postgraduate study at Curtin, Perth. PQC/MQTT and phishing research went active." },
];

/* ---------- Research ---------- */

export type Research = {
  slug: string;
  title: string;
  shortTitle: string;
  status: ResearchStatus;
  area: string;
  question: string;
  method: string;
  updated: string;
  confidence: Confidence;
  summary: string;
  order: number;
  accent?: "accent" | "accent-warm";
};

export const research: Research[] = [
  {
    slug: "pqc-mqtt-degraded-networks",
    title: "Measuring the Operational Cost of Post-Quantum Security for MQTT Under Degraded Networks",
    shortTitle: "PQC × MQTT",
    status: "Experimenting",
    area: "Post-quantum cryptography · IoT · Networks",
    question:
      "How does PQC-secured MQTT behave when the underlying IoT-edge network becomes unstable — and which mitigation strategies restore reliability?",
    method:
      "Controlled testbed: MQTT client, network emulator (tc/netem), MQTT broker. Classical TLS vs PQC/hybrid TLS (ML-KEM, ML-DSA) under packet loss, delay, jitter, bandwidth limits, and intermittent connectivity.",
    updated: "2026-06",
    confidence: "user-confirmed",
    accent: "accent-warm",
    order: 1,
    summary:
      "My research evaluates how post-quantum cryptography affects MQTT-based IoT communication when network conditions are degraded. MQTT is lightweight and widely used in IoT, but PQC algorithms carry larger keys, ciphertexts, and signatures — making the TLS handshake larger and more sensitive to poor network conditions. I'm measuring exactly when and where that breaks, and what can fix it.",
  },
  {
    slug: "bdsl-med-triage",
    title: "BdSL Emergency Triage Translation",
    shortTitle: "BdSL Med Triage",
    status: "Data collection",
    area: "Accessibility · Health · Low-resource ML",
    question:
      "Can a compact landmark-based sequence model recognise a small emergency-triage Bengali Sign Language vocabulary offline with acceptable latency?",
    method:
      "MediaPipe Holistic landmarks → fixed 60-frame sequences (1,692 features/frame) → two-layer LSTM baseline with stratified, leakage-aware splits.",
    updated: "2026-06",
    confidence: "user-confirmed",
    accent: "accent",
    order: 2,
    summary:
      "I'm building an offline, bidirectional Bengali Sign Language translation system for the small, high-value vocabulary needed during emergency medical triage. I built the pipeline first; the result comes after — that order is deliberate.",
  },
  {
    slug: "ai-phishing",
    title: "AI-assisted phishing research — work in progress",
    shortTitle: "AI & Phishing",
    status: "Active study",
    area: "Applied security · LLMs · Detection",
    question:
      "How do LLMs change the cost, personalisation, fluency and scale of phishing — and can detectors generalise across human, template, LLM-generated and adversarially perturbed examples?",
    method: "Out-of-distribution and temporal splits, model-family holdouts, calibration, and false-positive cost. Title, dataset, and collaborators are still being worked out as the study progresses.",
    updated: "2026-06",
    confidence: "user-confirmed",
    order: 3,
    summary:
      "An active, ongoing study. The team is still shaping the working title, method, and collaborators, so I keep this page a short research note rather than publishing a premature abstract. The framing below is firm; only the formal title, dataset, and results are still in motion.",
  },
  {
    slug: "federated-metaverse-authentication",
    title: "Dynamic Authentication Scheme for Advanced Security in Federated Metaverse Systems",
    shortTitle: "Federated Metaverse Auth",
    status: "Published",
    area: "Authentication · Distributed systems · Security",
    question:
      "How can identity continuity and access control be maintained securely across federated virtual environments?",
    method: "A dynamic authentication framework intended to strengthen secure identity management in decentralised virtual environments.",
    updated: "2024-10",
    confidence: "verified",
    accent: "accent",
    order: 4,
    summary:
      "My peer-reviewed IEEE conference paper (ICICT 2024) on identity and access security across federated metaverse environments. It's the verified foundation of the research trajectory I'm now continuing into PQC and constrained-network work.",
  },
];

/* ---------- Projects / Work ---------- */

export type Project = {
  slug: string;
  title: string;
  client?: string;
  clientUrl?: string;
  tagline: string;
  role: string;
  status: string;
  date: string;
  categories: WorkCategory[];
  capabilities: string[];
  disclosure: Disclosure;
  confidence: Confidence;
  repo?: string;
  external?: string;
  summary: string;
  accent?: "accent" | "accent-warm";
  tier: "A" | "B";
};

export const projects: Project[] = [
  /* ── Commercial / CodeXGate ── */
  {
    slug: "tmi-sales-crm",
    title: "TMI Sales Operations CRM",
    client: "The Moving Image",
    clientUrl: "https://sales.movingimage.my/",
    tagline: "A purpose-built sales-operations CRM with lead lifecycle, goal tracking, and email verification.",
    role: "Full-stack engineer at CodeXGate",
    status: "Live · internal platform",
    date: "2024 — present",
    categories: ["Systems", "Commercial", "Security"],
    capabilities: ["Next.js 15 App Router", "Prisma · PostgreSQL", "JWT · RBAC · Middleware security"],
    disclosure: "Commercial",
    confidence: "user-confirmed",
    external: "https://sales.movingimage.my/",
    accent: "accent",
    tier: "A",
    summary:
      "I built the Sales Operations CRM used by The Moving Image — a Next.js 15 platform with a PostgreSQL backend, role-based access, background jobs, and a rich front-end. It combines sales reporting, lead lifecycle management, and operational governance.",
  },
  {
    slug: "mavn-scouting-platform",
    title: "MAVN Scouting Platform",
    client: "MAVN Models",
    clientUrl: "https://scout.mavnmodels.com/",
    tagline: "Influencer discovery, Apify enrichment, campaign management, and goal tracking.",
    role: "Full-stack engineer at CodeXGate",
    status: "Live · internal platform",
    date: "2024 — present",
    categories: ["Systems", "Commercial", "Mobile"],
    capabilities: ["Next.js 15 App Router", "Apify · DigitalOcean Spaces", "Instagram/TikTok enrichment"],
    disclosure: "Commercial",
    confidence: "user-confirmed",
    external: "https://scout.mavnmodels.com/",
    accent: "accent-warm",
    tier: "A",
    summary:
      "I built the MAVN Scouting Platform — influencer discovery, data enrichment, campaign management, and goal tracking. It integrates Apify for Instagram/TikTok enrichment and DigitalOcean Spaces for media, with edge-middleware security and background jobs.",
  },
  {
    slug: "jd-people-hub",
    title: "JD People Hub",
    client: "JD Sports",
    clientUrl: "https://peoplehub.jdsportssea.com/",
    tagline: "An HR portal with digital ID cards, vouchers, MFA, SFTP sync, and Android/iOS mobile apps.",
    role: "Full-stack engineer at CodeXGate",
    status: "Live · employee platform",
    date: "2024 — present",
    categories: ["Systems", "Commercial", "Mobile", "Healthcare"],
    capabilities: ["Next.js 15 App Router", "Capacitor · Android/iOS", "MFA · SFTP · MediaPipe"],
    disclosure: "Commercial",
    confidence: "user-confirmed",
    external: "https://peoplehub.jdsportssea.com/",
    accent: "accent",
    tier: "A",
    summary:
      "I built JD People Hub — a full HR portal for JD Sports employees with a digital ID card, vouchers, purchase history, MFA via email OTP, SFTP HR-data sync, and Capacitor mobile wrappers for Android and iOS.",
  },
  {
    slug: "erp-middleware-bridge",
    title: "ERP Middleware Bridge",
    client: "Montigo / RPG",
    tagline: "A reusable middleware bridging Odoo to WMS, AfterShip, Klaviyo, Zendesk, and BI.",
    role: "Engineer at CodeXGate",
    status: "In progress · phase 1",
    date: "2026",
    categories: ["Systems", "Commercial", "Security"],
    capabilities: ["Fastify · TypeScript", "BullMQ · Prisma 7", "Zod contracts · HMAC webhooks"],
    disclosure: "Commercial",
    confidence: "user-confirmed",
    accent: "accent-warm",
    tier: "A",
    summary:
      "I'm building a reusable ERP middleware for downstream integrations. Odoo is the ERP and my middleware sits between it and WMS/3PL, AfterShip, Klaviyo, Zendesk, and Cauldron/BI. It runs on canonical Zod contracts, idempotency, dead-letter queues, and a tested first vertical slice.",
  },

  /* ── Personal / flagship ── */
  {
    slug: "fnh-connect",
    title: "FNH Connect",
    tagline: "I rebuilt a hospital operations system around traceability.",
    role: "Engineer & project lead (second-generation system)",
    status: "Active public repository",
    date: "2025 — present",
    categories: ["Systems", "Healthcare", "Security"],
    capabilities: ["Next.js 15 · React 19", "Prisma · PostgreSQL", "RBAC · Audit logs"],
    disclosure: "Public repo",
    confidence: "repository-verified",
    repo: "https://github.com/ShakChunni/FNH-Connect",
    accent: "accent",
    tier: "A",
    summary:
      "I built FNH Connect with the Next.js App Router, React 19, Prisma and PostgreSQL. It manages general admissions, infertility and pathology workflows, cash collection and reconciliation, role-based access, and security audit trails — the second generation of a system that began as Feroza Accounts Management.",
  },
  {
    slug: "filmfave",
    title: "FilmFave",
    tagline: "A React Native movie & TV discovery app I built on the TMDb API.",
    role: "Sole contributor",
    status: "Shipped — Android APK available",
    date: "2023",
    categories: ["Mobile"],
    capabilities: ["React Native 0.71 · Expo 48", "Axios service layer", "Native-stack navigation"],
    disclosure: "Public repo",
    confidence: "repository-verified",
    repo: "https://github.com/ShakChunni/FilmFave",
    accent: "accent-warm",
    tier: "A",
    summary:
      "FilmFave is how I learned to turn a third-party API into a coherent mobile experience — now-playing and upcoming movies, on-air TV, genres, search, detail views, posters and trailers. The value is in the plumbing: service abstraction, navigation, loading and data states, reusable cards, and Android delivery.",
  },
  {
    slug: "powerfitness",
    title: "PowerFitness",
    tagline: "A React Native workout companion with explicit state separation and tests.",
    role: "Course project (tested)",
    status: "Android APK available",
    date: "2023",
    categories: ["Mobile", "Coursework"],
    capabilities: ["React Native · Expo", "MVC-style separation", "Jest · Testing Library"],
    disclosure: "Coursework",
    confidence: "repository-verified",
    repo: "https://github.com/ShakChunni/FitnessApp",
    tier: "A",
    summary:
      "A mobile workout companion I built for guided routines and in-session progress. Home, workout, exercise and rest views are separated from shared context that tracks completed exercises, workouts, calories and minutes. Four component-level test files and a downloadable APK make it my most test-evidenced mobile project.",
  },
  {
    slug: "conference-connect",
    title: "Conference Connect",
    tagline: "A real-time conference scheduler with LinkedIn OAuth and Socket.io rooms.",
    role: "Curtin coursework",
    status: "Coursework — memory-only server",
    date: "2026",
    categories: ["Systems", "Coursework"],
    capabilities: ["React SPA · React Router", "LinkedIn OpenID Connect", "Socket.io rooms"],
    disclosure: "Coursework",
    confidence: "repository-verified",
    repo: "https://github.com/ShakChunni/COMP6006-TimeConference",
    tier: "B",
    summary:
      "My Curtin coursework — a React SPA with React-Bootstrap, LinkedIn OpenID Connect, protected routes, local schedule persistence, and Socket.io rooms with live chat, participant lists and counts, history, and join/leave events. The server stores rooms and chat in memory, so it's not a production scalability claim.",
  },
  {
    slug: "banking-simulation",
    title: "Online Banking Simulation",
    tagline: "A server-rendered MVC banking system with ownership middleware and tests.",
    role: "Curtin coursework",
    status: "Coursework — simulated operations",
    date: "2026",
    categories: ["Systems", "Security", "Coursework"],
    capabilities: ["Node · Express · MongoDB", "Passport · sessions · bcrypt", "Joi validation"],
    disclosure: "Coursework",
    confidence: "repository-verified",
    repo: "https://github.com/ShakChunni/COMP6006-BankingSystem",
    tier: "B",
    summary:
      "My Curtin coursework using Node, Express, MongoDB/Mongoose, Pug, Bootstrap, Joi, Passport Local, sessions and bcrypt — registration/login, owned accounts, simulated credit/debit/transfers, search, admin controls, validation, ownership middleware, and tests. All banking operations are explicitly simulated.",
  },
  {
    slug: "feroza-accounts",
    title: "Feroza Accounts Management",
    tagline: "The predecessor to FNH Connect — a working departmental tool.",
    role: "Engineer",
    status: "Historical — superseded by FNH Connect",
    date: "2023",
    categories: ["Systems", "Healthcare"],
    capabilities: ["Node.js · SQL", "Admin dashboard", "Session-based reporting"],
    disclosure: "Public repo",
    confidence: "repository-verified",
    repo: "https://github.com/ShakChunni/clinique-account-management",
    tier: "B",
    summary:
      "The predecessor to FNH Connect, not a separate flagship. Its value is historical: early delivery of patient fee calculations, expenditure evidence, pathology selection, income views, sessions and an admin dashboard. Its limits are exactly what motivated my rebuild.",
  },
];

export const confidentialWorkNote =
  "Some of my CodeXGate client work is live and linkable; the rest is bound by client confidentiality. I show engineering decisions and transferable lessons rather than client code or internal metrics.";

export const publication = {
  title: "Dynamic Authentication Scheme for Advanced Security in Federated Metaverse Systems",
  venue: "2024 2nd International Conference on Information and Communication Technology (ICICT)",
  pages: "140–144",
  date: "October 2024",
  doi: "10.1109/ICICT64387.2024.10839681",
  doiUrl: "https://doi.org/10.1109/ICICT64387.2024.10839681",
  authors: [
    "Md Fuad Hasan",
    "F.M. Ashfaq",
    "Ahmed Awsaf Chowdhury",
    "Shoeb Islam Hamim",
    "Mustafiza Rahmani",
    "M. Iqbal Hossain",
  ],
  bibtex: `@inproceedings{ashfaq2024dynamic,
  title     = {Dynamic Authentication Scheme for Advanced Security in Federated Metaverse Systems},
  author    = {Hasan, Md Fuad and Ashfaq, F.M. and Chowdhury, Ahmed Awsaf and Hamim, Shoeb Islam and Rahmani, Mustafiza and Hossain, M. Iqbal},
  booktitle = {2024 2nd International Conference on Information and Communication Technology (ICICT)},
  pages     = {140--144},
  year      = {2024},
  month     = oct,
  doi       = {10.1109/ICICT64387.2024.10839681}
}`,
  summary:
    "My paper addresses identity and access security across federated metaverse environments, proposing a dynamic authentication framework intended to strengthen secure identity management in decentralised virtual environments. The official proceedings verify the author list, conference, year and pages.",
  note: "I'm the second author in a group of five. My contributions focused on the diagrams, working through the authentication design and its pipeline structure, contributing to the formal notations, supporting the literature review, and a few other critical pieces of the work. I don't claim to have individually authored every part of a group publication.",
};
