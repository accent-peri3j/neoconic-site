import { OG_IMAGE_URL } from "../components/HeadMeta";
import { useState } from "react";
import { useSEO } from "../hooks/useSEO";
import { Copy, Check, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

const ACCENT = "#EB1A22";
const EMAIL = "hello@neoconic.com";

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

export function Contact() {
  const [copied, setCopied] = useState(false);

  useSEO({
    title: "Contact",
    description:
      "Get in touch with Neoconic for brand identity, product design, or marketing design projects. Based in Amsterdam, working with fintech and technology companies across Europe.",
    path: "/contact",
    ogImage: OG_IMAGE_URL,
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = EMAIL;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ background: "#0B0B0B" }}>
      {/* Header */}
      <div className="pt-40 md:pt-48 pb-16 md:pb-20 px-8 md:px-12 lg:px-16">
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
              Contact
            </p>
            <h1
              className="text-white"
              style={{
                fontSize: "clamp(2.75rem, 7vw, 6rem)",
                fontWeight: 500,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
              }}
            >
              Let's work
              <br />
              together
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Contact Content */}
      <div className="px-8 md:px-12 lg:px-16 pb-36 md:pb-44">
        <div className="max-w-[1440px] mx-auto">
          {/* Divider */}
          <FadeIn>
            <div
              className="w-full h-px mb-20 md:mb-28"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24">
            {/* Left: Copy + Details */}
            <FadeIn className="md:col-span-5 flex flex-col gap-14">
              <p
                style={{
                  color: "rgba(255,255,255,0.58)",
                  fontSize: "1.05rem",
                  lineHeight: 1.85,
                  maxWidth: "28ch",
                }}
              >
                We take on a limited number of projects each year to ensure
                every engagement receives our full attention.
              </p>

              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-2">
                  <p
                    className="text-xs uppercase tracking-[0.2em] mb-1"
                    style={{ color: "rgba(255,255,255,0.28)" }}
                  >
                    Location
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.58)" }}>
                    Amsterdam, Netherlands
                  </p>
                </div>

                <div>
                  <p
                    className="text-xs uppercase tracking-[0.2em] mb-4"
                    style={{ color: "rgba(255,255,255,0.28)" }}
                  >
                    We work on
                  </p>
                  <ul className="flex flex-col gap-2.5">
                    {[
                      "Brand identity projects",
                      "Product design engagements",
                      "Design system creation",
                      "Spatial interface exploration",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-sm"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        <span
                          className="w-1 h-1 rounded-full shrink-0"
                          style={{ background: ACCENT }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>

            {/* Right: Email CTA */}
            <FadeIn delay={0.12} className="md:col-span-7 flex flex-col justify-center">
              <div className="flex flex-col gap-10">
                <p
                  className="text-xs uppercase tracking-[0.2em]"
                  style={{ color: "rgba(255,255,255,0.28)" }}
                >
                  Get in touch
                </p>

                {/* Email — large, prominent */}
                <a
                  href={`mailto:${EMAIL}`}
                  className="group inline-flex items-center gap-4 text-white transition-colors duration-500"
                  style={{
                    fontSize: "clamp(1.5rem, 3.5vw, 3rem)",
                    fontWeight: 500,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = ACCENT;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#ffffff";
                  }}
                >
                  {EMAIL}
                  <ArrowUpRight
                    className="w-6 h-6 md:w-8 md:h-8 shrink-0 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{ opacity: 0.4 }}
                  />
                </a>

                {/* Copy button */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer"
                    style={{
                      color: copied ? ACCENT : "rgba(255,255,255,0.35)",
                      background: "none",
                      border: "none",
                      padding: 0,
                    }}
                    onMouseEnter={(e) => {
                      if (!copied)
                        e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                    }}
                    onMouseLeave={(e) => {
                      if (!copied)
                        e.currentTarget.style.color = "rgba(255,255,255,0.35)";
                    }}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy email
                      </>
                    )}
                  </button>
                </div>

                {/* Response time note */}
                <p
                  className="mt-6"
                  style={{
                    color: "rgba(255,255,255,0.22)",
                    fontSize: "0.8rem",
                    letterSpacing: "0.01em",
                  }}
                >
                  We typically respond within 24–48 hours.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}