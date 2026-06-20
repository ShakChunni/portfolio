"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Bidirectional scroll reveal.
 * Elements animate IN when entering the viewport and animate OUT when leaving.
 * once: false is the key — it re-triggers on every enter/exit, both directions.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  amount = 0.15,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, filter: "blur(6px)", scale: 0.97 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
      viewport={{ once: false, amount, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.65, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.03 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(5px)", scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 0.6, ease: EASE },
  },
};

/**
 * Bidirectional stagger container.
 * Children stagger in when the container enters view, stagger out when it leaves.
 */
export function Stagger({
  children,
  className,
  amount = 0.12,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduce ? undefined : container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount, margin: "0px 0px -6% 0px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  );
}

export { EASE };
