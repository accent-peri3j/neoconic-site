import { ArrowUpRight, Mail } from "lucide-react";
import { Link } from "react-router";
import {
  FadeIn,
  SectionLabel,
} from "../components/project-card";
import { HeroB } from "../components/HeroB";
import { CinematicShowcase } from "../components/CinematicShowcase";
import { useSEO } from "../hooks/useSEO";
import { OG_IMAGE_URL } from "../components/HeadMeta";

const ACCENT = "#EB1A22";

const CAPABILITIES = [
  {
    title: "Brand Identity",
    description:
      "Visual systems, logos, typography, and brand guidelines for companies that lead.",
  },
  {
    title: "Product Design",
    description:
      "UX/UI design for digital products — from concept to high-fidelity interfaces.",
  },
  {
    title: "Marketing Design",
    description:
      "Campaign visuals, landing pages, and motion design for growth-stage brands.",
  },
  {
    title: "Spatial Interface Exploration",
    description:
      "Pioneering UI design for Apple Vision Pro and next-generation spatial platforms.",
  },
];

/* ════════════════════════════════════════════════════════
   HOME
   ════════════════════════════════════════════════════════ */
export function Home() {
  useSEO({
    title: "Home",
    description:
      "Neoconic is an independent design studio based in Amsterdam, specializing in brand identity and digital product design for fintech and technology companies.",
    path: "/",
    ogImage: OG_IMAGE_URL,
  });

  return (
    <div>
      {/* ──────────── HERO ──────────── */}
      <HeroB />

      {/* ──────────── SELECTED WORK — Cinematic Showcase ──────────── */}
      <CinematicShowcase />

      {/* ──────────── CAPABILITIES — WHITE ──────────── */}
      <section
        data-header-theme="light"
        style={{
          background: "#F7F7F7",
          paddingTop: "clamp(140px, 14vw, 220px)",
          paddingBottom: "clamp(140px, 14vw, 220px)",
        }}
      >
        <div className="max-w-[1440px] mx-auto px-8 md:px-12 lg:px-16">
          <FadeIn>
            <SectionLabel dark={false}>Capabilities</SectionLabel>
            <h2
              className="mt-5 mb-28 md:mb-36"
              style={{
                fontSize: "clamp(2.25rem, 5vw, 4.25rem)",
                fontWeight: 500,
                letterSpacing: "-0.035em",
                lineHeight: 1.1,
                color: "#0B0B0B",
              }}
            >
              What we do
            </h2>
          </FadeIn>

          <div className="flex flex-col">
            {CAPABILITIES.map((cap, i) => (
              <FadeIn key={cap.title} delay={i * 0.06}>
                <div
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-12 py-16 md:py-20"
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="md:col-span-1 flex items-start">
                    <span
                      className="inline-block w-[5px] h-[5px] rounded-full mt-3"
                      style={{ background: ACCENT }}
                    />
                  </div>
                  <h3
                    className="md:col-span-5"
                    style={{
                      fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)",
                      fontWeight: 500,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.3,
                      color: "#0B0B0B",
                    }}
                  >
                    {cap.title}
                  </h3>
                  <p
                    className="md:col-span-6"
                    style={{
                      color: "rgba(0,0,0,0.4)",
                      fontSize: "1.05rem",
                      lineHeight: 1.75,
                    }}
                  >
                    {cap.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── CTA — LET'S TALK ──────────── */}
      <section style={{ background: "#141414" }} className="py-44 md:py-60">
        <div className="max-w-[1440px] mx-auto px-8 md:px-12 lg:px-16">
          <FadeIn>
            <div className="max-w-[760px]">
              <SectionLabel>Get in touch</SectionLabel>

              <h2
                className="text-white mt-8 mb-12"
                style={{
                  fontSize: "clamp(3rem, 7vw, 6rem)",
                  fontWeight: 500,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                }}
              >
                Let's talk
              </h2>
              <p
                className="mb-18"
                style={{
                  fontSize: "clamp(1.05rem, 1.6vw, 1.2rem)",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.75,
                  maxWidth: "540px",
                }}
              >
                If you're building a fintech or technology product and need
                design support, feel free to reach out.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-3 text-sm tracking-wide bg-white text-[#0B0B0B] transition-all duration-500 w-fit"
                  style={{
                    padding: "14px 30px",
                    letterSpacing: "0.02em",
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = ACCENT;
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.color = "#0B0B0B";
                  }}
                >
                  Schedule an intro call
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <a
                  href="mailto:hello@neoconic.com"
                  className="group inline-flex items-center gap-3 text-sm tracking-wide text-white transition-all duration-500 w-fit"
                  style={{
                    padding: "14px 30px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    letterSpacing: "0.02em",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.1)";
                  }}
                >
                  <Mail
                    className="w-4 h-4"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  />
                  hello@neoconic.com
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

export default Home;