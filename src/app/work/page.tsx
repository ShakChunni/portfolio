import type { Metadata } from "next";
import { WorkIndex } from "@/components/site/work-index";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected engineering by F.M. Ashfaq — FNH Connect, FilmFave, PowerFitness and Curtin coursework. Each entry is labelled with its disclosure: public repo, research prototype, coursework, or confidential.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <main id="main">
      <WorkIndex />
    </main>
  );
}
