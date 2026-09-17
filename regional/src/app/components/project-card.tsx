import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import BluecodeLogo from "../../imports/BluecodeLogo";
import BaqmeLogo from "../../imports/BaqmeLogo";
import NumberXLogo from "../../imports/NumberXLogo";
import PaydoraLogo from "../../imports/PaydoraLogo";
import BetterDealsLogoNew from "../../imports/BetterDealsLogoNew";
import type { Project } from "../data/projects";

const ACCENT = "#EB1A22";

/* ───────────── Client logo resolver ───────────── */
export function ProjectLogo({ projectId }: { projectId: string }) {
  /* Uniform wrapper — all logos render at a consistent visual height */
  const wrap = (child: React.ReactNode, height = "22px") => (
    <div
      className="flex items-center text-white"
      style={{ height }}
    >
      {child}
    </div>
  );

  switch (projectId) {
    case "bluecode":
      return wrap(
        <div style={{ height: "22px", width: "auto", aspectRatio: "710 / 164" }}>
          <BluecodeLogo />
        </div>
      );
    case "baqme":
      return wrap(
        <div style={{ height: "22px", width: "auto", aspectRatio: "774 / 230" }}>
          <BaqmeLogo />
        </div>
      );
    case "numberx":
      return wrap(
        <div style={{ height: "18px", width: "auto", aspectRatio: "774 / 166" }}>
          <NumberXLogo />
        </div>,
        "18px"
      );
    case "paydora":
      return wrap(
        <div style={{ height: "29px", width: "auto", aspectRatio: "713 / 236" }}>
          <PaydoraLogo />
        </div>,
        "29px"
      );
    case "betterdeals":
      return wrap(
        <div style={{ height: "22px", width: "auto", aspectRatio: "766 / 147" }}>
          <BetterDealsLogoNew />
        </div>
      );
    default:
      return null;
  }
}

/* ───────────── Shared fade-in wrapper ───────────── */
export function FadeIn({
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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ───────────── Section label with red dot ───────────── */
export function SectionLabel({
  children,
  dark = true,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  const dotColor = ACCENT;
  const textColor = dark ? ACCENT : ACCENT;

  return (
    <div className="flex items-center gap-3">
      <span
        className="inline-block w-[5px] h-[5px] rounded-full shrink-0"
        style={{ background: dotColor }}
      />
      <p
        className="text-[11px] uppercase tracking-[0.25em]"
        style={{ color: textColor }}
      >
        {children}
      </p>
    </div>
  );
}

/* ───────────── VIDEO ● indicator ───────────── */
function VideoIndicator({ playing }: { playing: boolean }) {
  return (
    <div
      className="absolute top-5 right-5 z-10 flex items-center gap-2 pointer-events-none"
      style={{
        opacity: 0.7,
        transition: "opacity 0.6s ease",
      }}
    >
      <span
        className="text-[10px] uppercase tracking-[0.18em] text-white"
        style={{ fontWeight: 500 }}
      >
        Video
      </span>
      <span
        className="inline-block w-[6px] h-[6px] rounded-full"
        style={{
          background: ACCENT,
          transition: "box-shadow 0.4s ease",
          boxShadow: playing
            ? `0 0 8px 3px rgba(235, 26, 34, 0.35)`
            : "none",
          animation: playing ? "pulse-glow 2.5s ease-in-out 1" : "none",
        }}
      />
    </div>
  );
}

/* ───────────── Cinematic media area (image + optional video) ───────────── */
function CinematicMedia({ project }: { project: Project }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-10%" });
  const [videoReady, setVideoReady] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const hasVideo = !!project.video;

  /* When entering the viewport, wait ~1.5s then fade the video in */
  useEffect(() => {
    if (!hasVideo || !isInView) {
      setShowVideo(false);
      // Pause video when out of view
      if (videoRef.current) {
        videoRef.current.pause();
      }
      return;
    }

    const timer = setTimeout(() => {
      if (videoRef.current && videoReady) {
        videoRef.current.play().catch(() => {});
        setShowVideo(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isInView, hasVideo, videoReady]);

  const handleCanPlay = useCallback(() => {
    setVideoReady(true);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[2.35/1] overflow-hidden"
    >
      {/* Poster / static image — always present */}
      <ImageWithFallback
        src={project.thumbnail ?? project.image}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-[1.03]"
        style={{
          filter: `brightness(${1 - project.overlay}) saturate(0.85)`,
        }}
      />

      {/* Video layer — fades in over the poster */}
      {hasVideo && (
        <video
          ref={videoRef}
          src={project.video}
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={handleCanPlay}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1.2s] ease-out"
          style={{
            opacity: showVideo ? 1 : 0,
            filter: `brightness(${1 - project.overlay}) saturate(0.85)`,
          }}
        />
      )}

      {/* Tonal gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,11,11,0.04) 0%, rgba(11,11,11,0.3) 100%)",
        }}
      />

      {/* VIDEO ● badge */}
      {hasVideo && <VideoIndicator playing={showVideo} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PROJECT CARD — used on both Home and Work pages
   ═══════════════════════════════════════════════════════ */
export function ProjectCard({
  project,
  index,
  totalCount,
  variant = "home",
}: {
  project: Project;
  index: number;
  totalCount: number;
  /** "home" = compact info; "work" = full info with scope column */
  variant?: "home" | "work";
}) {
  if (variant === "work") {
    return (
      <FadeIn delay={index * 0.04}>
        <div
          className="group"
          style={{
            paddingBottom:
              index < totalCount - 1
                ? "clamp(80px, 9vw, 140px)"
                : "clamp(40px, 5vw, 60px)",
          }}
        >
          {/* Media */}
          <div className="relative overflow-hidden mb-12 md:mb-16">
            <CinematicMedia project={project} />
          </div>

          {/* Info — editorial layout with logo + scope */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-16">
            <div className="md:col-span-7 flex items-center gap-6 md:gap-10">
              <div className="shrink-0 opacity-60 w-[70px] md:w-[110px] flex items-center">
                <ProjectLogo projectId={project.id} />
              </div>
              <div>
                <h2
                  className="text-white mb-3"
                  style={{
                    fontSize: "clamp(1.9rem, 3.5vw, 2.65rem)",
                    fontWeight: 500,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                  }}
                >
                  {project.title}
                </h2>
                <p
                  style={{
                    color: "rgba(255,255,255,0.525)",
                    fontSize: "1.05rem",
                    lineHeight: 1.65,
                    maxWidth: "480px",
                  }}
                >
                  {project.description}
                </p>
              </div>
            </div>

            <div className="md:col-span-5 md:pt-1">
              <p
                className="text-[11px] uppercase tracking-[0.2em] mb-5"
                style={{ color: "rgba(255,255,255,0.30)" }}
              >
                Scope
              </p>
              <ul className="flex flex-col gap-2.5">
                {project.scope.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm"
                    style={{ color: "rgba(255,255,255,0.57)" }}
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
        </div>
      </FadeIn>
    );
  }

  /* ── Home variant (compact) ── */
  return (
    <FadeIn delay={index * 0.05}>
      <div
        className="group"
        style={{
          paddingBottom:
            index < totalCount - 1
              ? "clamp(80px, 9vw, 140px)"
              : "clamp(40px, 5vw, 80px)",
        }}
      >
        {/* Media */}
        <div className="relative overflow-hidden mb-10 md:mb-14">
          <CinematicMedia project={project} />
        </div>

        {/* Project info — logo left, text right */}
        <div className="flex items-center gap-6 md:gap-10">
          <div className="shrink-0 opacity-60 w-[70px] md:w-[110px] flex items-center">
            <ProjectLogo projectId={project.id} />
          </div>
          <div>
            <h3
              className="text-white mb-3"
              style={{
                fontSize: "clamp(1.9rem, 3.5vw, 2.65rem)",
                fontWeight: 500,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              {project.title}
            </h3>
            <p
              style={{
                color: "rgba(255,255,255,0.525)",
                fontSize: "1.05rem",
                lineHeight: 1.65,
                maxWidth: "480px",
              }}
            >
              {project.description}
            </p>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}