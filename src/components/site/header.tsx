"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { nav } from "@/lib/site";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "border-b border-rule bg-paper/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="group flex items-baseline gap-2"
          aria-label="F.M. Ashfaq — home"
        >
          <span className="font-display text-xl leading-none text-ink">
            F.M. Ashfaq
          </span>
          <span className="label-mono hidden text-ink-soft transition-all duration-300 group-hover:text-accent sm:inline">
            / I build systems
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative px-3 py-2 text-sm transition-colors",
                  active ? "text-ink" : "text-ink-soft hover:text-ink",
                )}
              >
                <span className="label-mono mr-1.5 text-ink-soft/70 transition-colors group-hover:text-accent">
                  {item.index}
                </span>
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-px h-0.5 bg-accent"
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="label-mono inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rule text-ink-soft transition-colors hover:border-accent hover:text-accent md:hidden"
              >
                <Menu className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[85vw] max-w-sm border-l border-rule bg-paper p-0"
            >
              <SheetHeader className="border-b border-rule px-6 py-5 text-left">
                <SheetTitle className="font-display text-2xl text-ink">
                  F.M. Ashfaq
                </SheetTitle>
                <p className="label-mono mt-1 text-ink-soft">Index — navigation</p>
              </SheetHeader>
              <nav className="flex flex-col" aria-label="Mobile">
                {nav.map((item) => {
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-baseline gap-4 border-b border-rule px-6 py-5 transition-colors",
                        active ? "bg-accent-soft" : "hover:bg-paper-2",
                      )}
                    >
                      <span className="label-mono text-accent">{item.index}</span>
                      <span className="font-display text-2xl text-ink">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>
              <div className="px-6 py-6">
                <p className="label-mono mb-3 text-ink-soft">Elsewhere</p>
                <a
                  href="https://github.com/ShakChunni"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="block py-1.5 text-sm text-ink-soft transition-colors hover:text-accent"
                >
                  GitHub — ShakChunni
                </a>
                <a
                  href="https://www.linkedin.com/in/f-m-ashfaq/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="block py-1.5 text-sm text-ink-soft transition-colors hover:text-accent"
                >
                  LinkedIn — in/f-m-ashfaq
                </a>
                <a
                  href="mailto:ashfaq601230@gmail.com"
                  className="block py-1.5 text-sm text-ink-soft transition-colors hover:text-accent"
                >
                  ashfaq601230@gmail.com
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
