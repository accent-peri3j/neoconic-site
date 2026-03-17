import { Link } from "react-router";
import { motion } from "motion/react";

const ACCENT = "#EB1A22";

/* ── Shared layout for all legal pages ── */
export function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ background: "#0B0B0B" }} className="min-h-screen">
      <div className="max-w-[720px] mx-auto px-8 md:px-12 pt-40 md:pt-48 pb-24 md:pb-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <div
              className="shrink-0"
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: ACCENT,
              }}
            />
            <span
              style={{
                fontSize: "12px",
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase",
              }}
            >
              Legal
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              color: "white",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            {title}
          </h1>

          <p
            className="mt-4"
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            Last updated: {lastUpdated}
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="legal-content flex flex-col gap-12"
        >
          {children}
        </motion.div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Link
            to="/"
            className="text-sm transition-colors duration-300"
            style={{ color: "rgba(255,255,255,0.35)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = ACCENT;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.35)";
            }}
          >
            &larr; Back to home
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Reusable section block ── */
export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2
        style={{
          fontSize: "17px",
          color: "rgba(255,255,255,0.85)",
          letterSpacing: "-0.01em",
        }}
      >
        {heading}
      </h2>
      <div
        className="flex flex-col gap-3"
        style={{
          fontSize: "14px",
          lineHeight: 1.75,
          color: "rgba(255,255,255,0.4)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
