import { cn } from "@/lib/utils";
import type { ResearchStatus, Disclosure, WorkCategory } from "@/lib/content";

const statusStyles: Record<ResearchStatus, string> = {
  Published: "border-accent/40 text-accent",
  Experimenting: "border-accent-warm/50 text-accent-warm",
  "Data collection": "border-accent/40 text-accent",
  Writing: "border-ink-soft/30 text-ink-soft",
  "Active study": "border-accent-warm/50 text-accent-warm",
  "Research note": "border-ink-soft/30 text-ink-soft",
};

export function StatusChip({
  status,
  className,
}: {
  status: ResearchStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "label-mono inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
        statusStyles[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {status}
    </span>
  );
}

const disclosureStyles: Record<Disclosure, string> = {
  "Public repo": "text-ink-soft",
  "Research prototype": "text-accent",
  Coursework: "text-ink-soft",
  Commercial: "text-accent-warm",
};

export function DisclosureLabel({
  disclosure,
  className,
}: {
  disclosure: Disclosure;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "label-mono inline-flex items-center gap-1.5",
        disclosureStyles[disclosure],
        className,
      )}
    >
      <span aria-hidden>◊</span>
      {disclosure}
    </span>
  );
}

export function CategoryTag({ category }: { category: WorkCategory }) {
  return (
    <span className="label-mono rounded-full border border-rule px-2 py-0.5 text-ink-soft">
      {category}
    </span>
  );
}
