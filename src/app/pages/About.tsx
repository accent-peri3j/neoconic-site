import { motion } from "motion/react";
import { useSEO } from "../hooks/useSEO";
import { OG_IMAGE_URL } from "../components/HeadMeta";

const ACCENT = "#EB1A22";

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const VALUES = [
  {
    title: "Clarity over complexity",
    description:
      "We believe the best design removes friction. Every decision is made with purpose — nothing added without reason.",
  },
  {
    title: "Craft at every scale",
    description:
      "From a logo mark to a full product system, we approach every project with the same level of detail and care.",
  },
  {
    title: "Long-term partnerships",
    description:
      "We work with companies building for the long run. Our best work comes from sustained, trusting relationships.",
  },
];

export function About() {
  useSEO({
    title: "About",
    description:
      "Neoconic is an independent design studio with 10+ years of experience working with fintech and technology companies across Europe. Based in Amsterdam.",
    path: "/about",
    ogImage: OG_IMAGE_URL,
  });

  return (
    <div>
      {/* Header */}
      <div
        className="pt-40 md:pt-48 pb-20 md:pb-28 px-8 md:px-12 lg:px-16"
        style={{ background: "#0B0B0B" }}
      >
        <div className="max-w-[1440px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p
              className="text-xs uppercase tracking-[0.25em] mb-6"
              style={{ color: ACCENT }}
            >
              <span
                className="inline-block w-[5px] h-[5px] rounded-full mr-3 align-middle"
                style={{ background: ACCENT }}
              />
              About
            </p>
            <h1
              className="text-white max-w-[800px]"
              style={{
                fontSize: "clamp(2.75rem, 7vw, 6rem)",
                fontWeight: 500,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
              }}
            >
              Independent
              <br />
              design practice
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Intro */}
      <div
        className="pb-24 md:pb-32 px-8 md:px-12 lg:px-16"
        style={{ background: "#0B0B0B" }}
      >
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20">
          <FadeIn className="md:col-span-7">
            <p
              className="text-white"
              style={{
                fontSize: "clamp(1.15rem, 2.2vw, 1.6rem)",
                fontWeight: 400,
                lineHeight: 1.6,
                letterSpacing: "-0.01em",
              }}
            >
              Neoconic is an independent design studio with 10+ years of
              experience working with fintech and technology companies across
              Europe.
            </p>
          </FadeIn>
          <FadeIn delay={0.12} className="md:col-span-5 flex flex-col gap-6">
            <p
              style={{
                color: "rgba(255,255,255,0.68)",
                fontSize: "0.95rem",
                lineHeight: 1.8,
              }}
            >
              We specialize in brand identity, product design, and the emerging
              frontier of spatial interfaces. Our clients are founders, product
              teams, and growth-stage companies building products people love.
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "0.9rem",
                lineHeight: 1.8,
              }}
            >
              Based in Amsterdam with roots in Curacao, working across the
              Netherlands, Austria, Germany, and beyond.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Values */}
      <div
        className="pb-36 md:pb-44 px-8 md:px-12 lg:px-16"
        style={{ background: "#0B0B0B" }}
      >
        <div className="max-w-[1440px] mx-auto">
          <FadeIn>
            <p
              className="text-xs uppercase tracking-[0.25em] mb-20 md:mb-24"
              style={{ color: ACCENT }}
            >
              <span
                className="inline-block w-[5px] h-[5px] rounded-full mr-3 align-middle"
                style={{ background: ACCENT }}
              />
              Our Values
            </p>
          </FadeIn>

          <div className="flex flex-col">
            {VALUES.map((val, i) => (
              <FadeIn key={val.title} delay={i * 0.08}>
                <div
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-16 py-12 md:py-16"
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="md:col-span-1 flex items-start">
                    <span
                      className="inline-block w-[5px] h-[5px] rounded-full mt-2.5"
                      style={{ background: ACCENT }}
                    />
                  </div>
                  <h3
                    className="text-white md:col-span-5"
                    style={{
                      fontSize: "clamp(1.1rem, 2vw, 1.45rem)",
                      fontWeight: 500,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.3,
                    }}
                  >
                    {val.title}
                  </h3>
                  <p
                    className="md:col-span-6"
                    style={{
                      color: "rgba(255,255,255,0.57)",
                      fontSize: "0.9rem",
                      lineHeight: 1.75,
                    }}
                  >
                    {val.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}