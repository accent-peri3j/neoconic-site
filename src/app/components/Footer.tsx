import { Link } from "react-router";
import { motion } from "motion/react";
import NeoconicLogoBlack from "../../imports/NeoconicLogoBlack";

const ACCENT = "#EB1A22";
const EMAIL = "hello@neoconic.com";

/* ─────────────────────────────────────────────────────────────
   Geographic connection element — Curaçao ● ──── ● Amsterdam
   ───────────────────────────────────────────────────────────── */
function GeoConnection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1.6, ease: "easeOut" }}
      className="flex flex-col items-center gap-3 w-full"
    >
      {/* Coordinates + connection line */}
      <div className="flex items-center w-full gap-3">
        <span
          style={{
            fontSize: "11px",
            letterSpacing: "0.03em",
            color: "rgba(255,255,255,0.33)",
            whiteSpace: "nowrap",
          }}
        >
          12.1696° N, 68.9900° W
        </span>

        <div className="flex items-center flex-1 min-w-[60px]">
          <div
            className="shrink-0"
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: ACCENT,
            }}
          />
          <div
            className="flex-1"
            style={{
              height: "0.5px",
              background: "rgba(255,255,255,0.10)",
            }}
          />
          <div
            className="shrink-0"
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: ACCENT,
            }}
          />
        </div>

        <span
          style={{
            fontSize: "11px",
            letterSpacing: "0.03em",
            color: "rgba(255,255,255,0.33)",
            whiteSpace: "nowrap",
          }}
        >
          52.3676° N, 4.9041° E
        </span>
      </div>

      {/* City labels */}
      <div className="flex justify-between w-full">
        <span
          style={{
            fontSize: "11px",
            letterSpacing: "0.05em",
            color: "rgba(255,255,255,0.21)",
          }}
        >
          Curaçao
        </span>
        <span
          style={{
            fontSize: "11px",
            letterSpacing: "0.05em",
            color: "rgba(255,255,255,0.21)",
          }}
        >
          Amsterdam
        </span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */
export function Footer() {
  const muted = "rgba(255,255,255,0.525)";
  const subtle = "rgba(255,255,255,0.33)";
  const faint = "rgba(255,255,255,0.21)";

  return (
    <footer style={{ background: "#0B0B0B" }}>
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 lg:px-16 pt-16 md:pt-20 pb-0">
        {/* Geographic connection element - moved closer to top */}
        <div className="pb-16 md:pb-20 flex justify-center">
          <GeoConnection />
        </div>

        {/* ── Main 2-column layout - better vertical centering ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 md:items-end pb-12 md:pb-16">
          {/* Left — Brand + Location + Legal */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div
              style={{
                width: "120px",
                height: "17px",
                position: "relative",
                "--fill-0": "white",
              } as React.CSSProperties}
            >
              <NeoconicLogoBlack />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm" style={{ color: subtle }}>
                Amsterdam, The Netherlands
              </p>
              <p style={{ fontSize: "11px", color: faint, letterSpacing: "0.01em" }}>
                KvK 80114172 · VAT NL003394829B60
              </p>
            </div>
          </div>

          {/* Right — Contact */}
          <div className="md:col-span-5 md:col-start-8 flex flex-col md:items-end md:text-right">
            <div className="flex flex-col gap-3">
              <p
                className="text-xs uppercase tracking-[0.2em]"
                style={{ color: faint }}
              >
                Get in touch
              </p>
              <a
                href={`mailto:${EMAIL}`}
                className="text-sm transition-colors duration-300"
                style={{ color: muted }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = ACCENT;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = muted;
                }}
              >
                {EMAIL}
              </a>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div
          style={{ height: "1px", background: "rgba(255,255,255,0.06)" }}
        />

        {/* ── Bottom row ── */}
        <div className="py-6 md:py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <p style={{ fontSize: "12px", lineHeight: 1.6, color: subtle }}>
            &copy; 2026 Neoconic. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            {[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms of Use", href: "/terms" },
            ].map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="transition-colors duration-300"
                style={{ fontSize: "12px", color: faint }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = muted;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = faint;
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}