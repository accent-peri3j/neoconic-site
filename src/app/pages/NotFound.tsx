import { Link } from "react-router";
import { motion } from "motion/react";
import { useSEO } from "../hooks/useSEO";

const ACCENT = "#EB1A22";

export function NotFound() {
  useSEO({
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist.",
    path: "/404",
  });

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-8"
      style={{ background: "#0B0B0B" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-[480px]"
      >
        {/* 404 number */}
        <p
          className="mb-6"
          style={{
            fontSize: "clamp(5rem, 12vw, 9rem)",
            fontWeight: 500,
            letterSpacing: "-0.05em",
            lineHeight: 1,
            color: "rgba(255,255,255,0.06)",
          }}
        >
          404
        </p>

        {/* Red dot */}
        <span
          className="inline-block w-[6px] h-[6px] rounded-full mb-8"
          style={{
            background: ACCENT,
            boxShadow: "0 0 12px 3px rgba(235,26,34,0.3)",
          }}
        />

        <h1
          className="text-white mb-4"
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
          }}
        >
          Page not found
        </h1>

        <p
          className="mb-12"
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "1rem",
            lineHeight: 1.7,
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm transition-all duration-300"
          style={{
            padding: "14px 28px",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "white",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = ACCENT;
            e.currentTarget.style.color = ACCENT;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
            e.currentTarget.style.color = "white";
          }}
        >
          &larr; Back to home
        </Link>
      </motion.div>
    </div>
  );
}
