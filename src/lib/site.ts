export const siteConfig = {
  name: "F.M. Ashfaq",
  url: "https://fmashfaq.dev",
  description:
    "Software engineer & applied-security researcher. Full-stack systems and applied security research, built and tested under real constraints. Perth, Australia.",
  email: "ashfaq601230@gmail.com",
} as const;

export const nav = [
  { href: "/", label: "Index", index: "00" },
  { href: "/work", label: "Work", index: "01" },
  { href: "/research", label: "Research", index: "02" },
  { href: "/about", label: "About", index: "03" },
  { href: "/cv", label: "CV", index: "04" },
] as const;
