import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Section({
  id,
  index,
  label,
  title,
  children,
  className,
  rule = true,
}: {
  id?: string;
  index: string;
  label: string;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  rule?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24",
        className,
      )}
    >
      <div className="grid grid-cols-1 gap-y-10 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-3 lg:col-span-2">
          <div className="sticky top-24">
            <p className="section-marker">{index}</p>
            <p className="label-mono mt-2 text-ink">{label}</p>
          </div>
        </div>
        <div className="md:col-span-9 lg:col-span-10">
          {title ? (
            <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl">
              {title}
            </h2>
          ) : null}
          {rule && title ? <div className="rule-h mt-8" /> : null}
          {children}
        </div>
      </div>
    </section>
  );
}

export function SectionBare({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>
      {children}
    </section>
  );
}
