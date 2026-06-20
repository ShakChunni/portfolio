import Link from "next/link";
import { profile } from "@/lib/content";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-rule bg-paper-2/50">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="label-mono mb-4 text-ink-soft">Colophon</p>
            <p className="font-display text-2xl leading-snug text-ink sm:text-3xl">
              I build carefully.{" "}
              <span className="font-display-italic">I measure honestly.</span>
            </p>
            <p className="mt-4 max-w-sm text-sm text-ink-soft">
              My portfolio. I made security and accessibility part of the
              architecture, not an afterthought.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <p className="label-mono mb-4 text-ink-soft">Pages</p>
            <nav className="flex flex-col gap-2" aria-label="Footer">
              {[
                { href: "/", label: "Index" },
                { href: "/work", label: "Work" },
                { href: "/research", label: "Research" },
                { href: "/about", label: "About" },
                { href: "/cv", label: "CV" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="link-quiet w-fit text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="md:col-span-3">
            <p className="label-mono mb-4 text-ink-soft">Elsewhere</p>
            <div className="flex flex-col gap-2">
              {Object.values(profile.links).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-accent"
                >
                  <span className="link-quiet">{link.label}</span>
                  <ArrowUpRight
                    className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    strokeWidth={1.5}
                  />
                </a>
              ))}
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-accent"
              >
                <span className="link-quiet">{profile.email}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-rule pt-6 sm:flex-row sm:items-center">
          <p className="label-mono text-ink-soft">
            © {year} {profile.name} — Perth, Western Australia
          </p>
          <p className="label-mono text-ink-soft">
            Next.js · Tailwind · Motion · shadcn/ui
          </p>
        </div>
      </div>
    </footer>
  );
}
