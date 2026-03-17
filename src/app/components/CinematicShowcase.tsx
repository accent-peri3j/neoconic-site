import { useRef, useState, useEffect, useCallback, memo } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ProjectLogo } from "./project-card";
import { PROJECTS, type Project } from "../data/projects";
import { VideoModal } from "./VideoEmbed";

/* ════════════════════════════════════════════════════════
   BRAND COLOUR MAP — rgb triplets for dynamic compositing
   ════════════════════════════════════════════════════════ */
const BRAND: Record<string, { rgb: string; hex: string }> = {
  bluecode:    { rgb: "0, 102, 255",   hex: "#0066FF" },
  baqme:       { rgb: "0, 180, 160",   hex: "#00B4A0" },
  numberx:     { rgb: "255, 255, 255", hex: "#FFFFFF" },
  paydora:     { rgb: "199, 226, 241", hex: "#C7E2F1" },
  betterdeals: { rgb: "235, 26, 34",   hex: "#EB1A22" },
};

const ACCENT = "#EB1A22";

/* ═══════════════════════════════════════════════════════
   LEFT-SIDE PROGRESS BAR
   Thin vertical bar showing scroll progress within
   the current client slide. Brand-colored fill.
   ═══════════════════════════════════════════════════════ */
const LeftProgressBar = memo(function LeftProgressBar({
  progress,
  brandHex,
  brandRgb,
}: {
  progress: number;
  brandHex: string;
  brandRgb: string;
}) {
  const fillPercent = Math.max(0, Math.min(100, progress * 100));

  return (
    <div
      className="absolute left-0 top-0 bottom-0 z-20 pointer-events-none"
      style={{ width: "6px" }}
    >
      {/* Track — full-height architectural spine */}
      <div
        className="relative w-full h-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        {/* Fill — grows top→bottom with leading-edge gradient */}
        <div
          className="absolute top-0 left-0 w-full"
          style={{
            height: `${fillPercent}%`,
            background: `linear-gradient(to top, ${brandHex} 60%, rgba(${brandRgb},0.4) 100%)`,
            opacity: 0.85,
            transition: "height 60ms linear, background 0.5s ease",
            boxShadow: `3px 0 16px 0 rgba(${brandRgb},0.12), 0 0 6px 0 rgba(${brandRgb},0.08)`,
          }}
        />
      </div>
    </div>
  );
});

/* Neutral palette for the rail — no brand colours bleed */
const RAIL_NEUTRAL = {
  track:     "rgba(255,255,255,0.09)",
  completed: "rgba(255,255,255,0.33)",
  upcoming:  "rgba(255,255,255,0.09)",
  counter:   "rgba(255,255,255,0.33)",
  muted:     "rgba(255,255,255,0.18)",
};

/* ═══════════════════════════════════════════════════════
   SINGLE NAVIGATION PILL
   Isolated component — only the active pill reads brand.
   ═══════════════════════════════════════════════════════ */
const NavPill = memo(function NavPill({
  project,
  index,
  isActive,
  isCompleted,
  fillPercent,
  activeBrandHex,
  activeBrandRgb,
  onNavigate,
}: {
  project: Project;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  fillPercent: number;
  activeBrandHex: string;
  activeBrandRgb: string;
  onNavigate: (i: number) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const pillHeight = isActive ? 32 : 18;

  /* Fill colour: only active gets brand tint, rest are neutral */
  const fillColor = isActive
    ? activeBrandHex
    : isCompleted
      ? RAIL_NEUTRAL.completed
      : "transparent";

  const trackColor = isCompleted
    ? RAIL_NEUTRAL.muted
    : RAIL_NEUTRAL.track;

  return (
    <button
      onClick={() => onNavigate(index)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center justify-center"
      style={{ cursor: "pointer", padding: "3px 8px" }}
      aria-label={`Go to ${project.title}`}
    >
      {/* ── Hover tooltip with logo preview ── */}
      <div
        className="absolute right-full mr-4 flex items-center pointer-events-none"
        style={{
          opacity: hovered ? 1 : 0,
          transform: `translateX(${hovered ? 0 : 6}px)`,
          transition: "opacity 0.25s ease, transform 0.25s ease",
        }}
      >
        <div
          className="flex items-center gap-2.5 px-3 py-2 rounded-md"
          style={{
            background: "rgba(18,18,18,0.88)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.06)",
            whiteSpace: "nowrap",
          }}
        >
          {/* Client name — simple, uniform */}
          <span
            className="text-[10px] uppercase tracking-[0.14em]"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            {project.title}
          </span>
        </div>
      </div>

      {/* ── Pill track ── */}
      <span
        className="block relative overflow-hidden"
        style={{
          width: "3px",
          height: `${pillHeight}px`,
          borderRadius: "2px",
          background: trackColor,
          transition: "height 0.4s cubic-bezier(0.16,1,0.3,1), background 0.4s ease",
        }}
      >
        {/* Fill — grows top→bottom */}
        <span
          className="absolute top-0 left-0 w-full rounded-[2px]"
          style={{
            height: `${fillPercent}%`,
            background: fillColor,
            transition: isActive
              ? "height 60ms linear, background 0.4s ease"
              : "height 0.35s ease-out, background 0.4s ease",
            boxShadow: isActive
              ? `0 0 8px 1px rgba(${activeBrandRgb},0.25)`
              : "none",
          }}
        />
      </span>
    </button>
  );
});

/* ═══════════════════════════════════════════════════════
   VERTICAL NAVIGATION RAIL
   ═══════════════════════════════════════════════════════ */
const NavigationRail = memo(function NavigationRail({
  activeIndex,
  slideProgress,
  count,
  onNavigate,
}: {
  activeIndex: number;
  slideProgress: number;
  count: number;
  onNavigate: (index: number) => void;
}) {
  const activeBrand = BRAND[PROJECTS[activeIndex]?.id] || { rgb: "235,26,34", hex: ACCENT };

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Counter — current slide */}
      <p
        className="text-[10px] tracking-[0.2em] tabular-nums mb-2.5"
        style={{ color: RAIL_NEUTRAL.counter }}
      >
        <span style={{ color: "rgba(255,255,255,0.975)" }}>
          {String(activeIndex + 1).padStart(2, "0")}
        </span>
      </p>

      {/* Pill markers */}
      {PROJECTS.map((p, i) => {
        const isActive = i === activeIndex;
        const isCompleted = i < activeIndex;

        const fillPercent = isCompleted
          ? 100
          : isActive
            ? Math.max(5, slideProgress * 100)
            : 0;

        return (
          <NavPill
            key={p.id}
            project={p}
            index={i}
            isActive={isActive}
            isCompleted={isCompleted}
            fillPercent={fillPercent}
            activeBrandHex={activeBrand.hex}
            activeBrandRgb={activeBrand.rgb}
            onNavigate={onNavigate}
          />
        );
      })}

      {/* Total count */}
      <p
        className="text-[10px] tracking-[0.2em] tabular-nums mt-2.5"
        style={{ color: "rgba(255,255,255,0.15)" }}
      >
        {String(count).padStart(2, "0")}
      </p>
    </div>
  );
});

/* ═══════════════════════════════════════════════════════
   SINGLE PROJECT SLIDE
   Full-screen cinematic background with content overlay,
   brand-tinted gradients, and staggered reveal.
   ═══════════════════════════════════════════════════════ */
const ProjectSlide = memo(function ProjectSlide({
  project,
  onPlayVideo,
}: {
  project: Project;
  onPlayVideo?: (youtubeId: string) => void;
}) {
  const brand = BRAND[project.id] || { rgb: "235,26,34", hex: ACCENT };
  const hasYouTube = !!project.youtubeId;

  /* ── Staggered reveal ── */
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    setPhase(0);

    /* Use rAF to batch the initial state, then start timers */
    const raf = requestAnimationFrame(() => {
      const timers = [
        setTimeout(() => setPhase(1), 80),
        setTimeout(() => setPhase(2), 400),
        setTimeout(() => setPhase(3), 720),
      ];
      /* Store cleanup in a ref-like closure */
      (cleanup as any).timers = timers;
    });

    const cleanup: any = () => {
      cancelAnimationFrame(raf);
      ((cleanup as any).timers || []).forEach(clearTimeout);
    };
    return cleanup;
  }, [project.id]);

  return (
    <div className="absolute inset-0">
      {/* ── Full-screen image ── */}
      <div
        className="absolute inset-0"
        style={{
          transform: `scale(${phase >= 1 ? 1 : 1.06})`,
          transition: "transform 1.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <ImageWithFallback
          src={project.thumbnail ?? project.image}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.82) saturate(1.05)" }}
        />
      </div>

      {/* ── Directional gradient ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "linear-gradient(35deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.50) 35%, rgba(0,0,0,0.10) 65%, transparent 100%)",
            "linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.12) 30%, transparent 55%)",
            "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 20%)",
          ].join(", "),
        }}
      />

      {/* ── Brand-tinted gradient — bottom-left ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(35deg, rgba(${brand.rgb},0.08) 0%, rgba(${brand.rgb},0.03) 25%, transparent 50%)`,
          opacity: phase >= 2 ? 1 : 0,
          transition: "opacity 1.6s ease",
        }}
      />

      {/* ── Brand glow — top-right ambient ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "55vw",
          height: "55vh",
          top: "8%",
          right: "-8%",
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(${brand.rgb},0.10) 0%, rgba(${brand.rgb},0.03) 45%, transparent 70%)`,
          filter: "blur(90px)",
          opacity: phase >= 2 ? 1 : 0,
          transition: "opacity 1.8s ease",
        }}
      />

      {/* ── Bottom-left content overlay ── */}
      <div className="absolute inset-0 flex flex-col justify-end">
        <Link
          to={`/work#${project.id}`}
          className="relative pl-14 pr-10 md:pl-24 md:pr-16 lg:pl-28 lg:pr-20 pb-20 md:pb-24 lg:pb-28 max-w-[960px] group/slide"
          style={{ textDecoration: "none" }}
        >
          {/* Logo — reveals first */}
          <div
            className="mb-7 md:mb-9"
            style={{
              opacity: phase >= 1 ? 0.85 : 0,
              transform: `translateY(${phase >= 1 ? 0 : 16}px)`,
              transition: "opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <ProjectLogo projectId={project.id} />
          </div>

          {/* Brand accent dot + line */}
          <div
            className="flex items-center gap-3 mb-5 md:mb-6"
            style={{
              opacity: phase >= 2 ? 1 : 0,
              transform: `translateX(${phase >= 2 ? 0 : -10}px)`,
              transition: "opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <span
              className="w-[6px] h-[6px] rounded-full shrink-0"
              style={{
                background: brand.hex,
                boxShadow: `0 0 8px 2px rgba(${brand.rgb},0.3)`,
              }}
            />
            <span
              className="block h-px"
              style={{
                width: phase >= 2 ? "36px" : "0px",
                background: `rgba(${brand.rgb},0.45)`,
                transition: "width 0.9s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          </div>

          {/* Title */}
          <h2
            className="text-white mb-4"
            style={{
              fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)",
              fontWeight: 500,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              opacity: phase >= 2 ? 1 : 0,
              transform: `translateY(${phase >= 2 ? 0 : 24}px)`,
              transition: "opacity 0.9s ease-out, transform 0.9s cubic-bezier(0.16,1,0.3,1)",
              transitionDelay: "0.06s",
            }}
          >
            {project.title}
          </h2>

          {/* Description */}
          <p
            className="mb-3"
            style={{
              color: "rgba(255,255,255,0.825)",
              fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
              lineHeight: 1.6,
              maxWidth: "480px",
              opacity: phase >= 3 ? 1 : 0,
              transform: `translateY(${phase >= 3 ? 0 : 16}px)`,
              transition: "opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {project.description}
          </p>

          {/* Role label */}
          {project.role && (
            <p
              className="text-[11px] uppercase tracking-[0.2em]"
              style={{
                color: `rgba(${brand.rgb},0.45)`,
                opacity: phase >= 3 ? 1 : 0,
                transform: `translateY(${phase >= 3 ? 0 : 12}px)`,
                transition: "opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.16,1,0.3,1)",
                transitionDelay: "0.06s",
              }}
            >
              {project.role}
            </p>
          )}

          {/* Location label */}
          {project.location && (
            <div
              className="flex items-center gap-2 mt-4"
              style={{
                opacity: phase >= 3 ? 1 : 0,
                transform: `translateY(${phase >= 3 ? 0 : 10}px)`,
                transition: "opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.16,1,0.3,1)",
                transitionDelay: "0.14s",
              }}
            >
              <span
                className="w-[5px] h-[5px] rounded-full shrink-0"
                style={{
                  background: ACCENT,
                  boxShadow: "0 0 6px 1px rgba(235,26,34,0.25)",
                }}
              />
              <span
                className="text-[11px] tracking-[0.06em]"
                style={{ color: "rgba(255,255,255,0.60)" }}
              >
                {project.location.city}
                <span style={{ color: "rgba(255,255,255,0.33)" }}>
                  , {project.location.country}
                </span>
              </span>
            </div>
          )}

          {/* View project link */}
          <div
            className="mt-8 flex items-center gap-2"
            style={{
              opacity: phase >= 3 ? 1 : 0,
              transform: `translateY(${phase >= 3 ? 0 : 8}px)`,
              transition: "opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.16,1,0.3,1)",
              transitionDelay: "0.22s",
            }}
          >
            <span
              className="text-[11px] uppercase tracking-[0.18em] group-hover/slide:tracking-[0.22em] transition-all duration-300"
              style={{ color: "rgba(255,255,255,0.525)" }}
            >
              View project
            </span>
            <span
              className="inline-block transition-transform duration-300 group-hover/slide:translate-x-1"
              style={{ color: "rgba(255,255,255,0.375)", fontSize: "12px" }}
            >
              &rarr;
            </span>
          </div>
        </Link>
      </div>

      {/* ── YouTube play button — centered ── */}
      {hasYouTube && phase >= 3 && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayVideo?.(project.youtubeId!);
            }}
            className="pointer-events-auto group/play cursor-pointer"
            style={{
              opacity: phase >= 3 ? 1 : 0,
              transform: `scale(${phase >= 3 ? 1 : 0.9})`,
              transition: "opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.16,1,0.3,1)",
            }}
            aria-label="Play brand film"
          >
            <div
              className="flex items-center justify-center transition-all duration-500 group-hover/play:scale-105"
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid rgba(235,26,34,0.18)`,
                boxShadow: "0 4px 24px rgba(0,0,0,0.4), 0 0 0 0px rgba(235,26,34,0)",
                transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.4), 0 0 20px rgba(235,26,34,0.15)";
                e.currentTarget.style.borderColor = "rgba(235,26,34,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.4), 0 0 0 0px rgba(235,26,34,0)";
                e.currentTarget.style.borderColor = "rgba(235,26,34,0.18)";
              }}
            >
              <svg
                width="14"
                height="16"
                viewBox="0 0 14 16"
                fill="none"
                className="ml-0.5"
              >
                <path d="M14 8L0 16V0L14 8Z" fill={ACCENT} fillOpacity="0.9" />
              </svg>
            </div>
          </button>
        </div>
      )}
    </div>
  );
});

/* ═══════════════════════════════════════════════════════
   CINEMATIC SHOWCASE — Main controller
   ═══════════════════════════════════════════════════════ */
export function CinematicShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);
  const [videoModalId, setVideoModalId] = useState<string | null>(null);
  const rafRef = useRef(0);
  const lastIdxRef = useRef(0);
  const lastProgressRef = useRef(0);
  const count = PROJECTS.length;

  useEffect(() => {
    const handleScroll = () => {
      /* Throttle via rAF for smooth 60fps updates */
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const scrolledInto = -rect.top;

        if (scrolledInto < 0) {
          if (lastIdxRef.current !== 0 || lastProgressRef.current !== 0) {
            lastIdxRef.current = 0;
            lastProgressRef.current = 0;
            setActiveIndex(0);
            setSlideProgress(0);
          }
          return;
        }

        const totalScrollable = rect.height - window.innerHeight;
        if (totalScrollable <= 0) return;

        const slideHeight = totalScrollable / count;
        const rawIdx = scrolledInto / slideHeight;
        const idx = Math.max(0, Math.min(count - 1, Math.floor(rawIdx)));
        const progress = Math.max(0, Math.min(1, rawIdx - idx));

        /* Only setState when values actually change meaningfully */
        if (idx !== lastIdxRef.current) {
          lastIdxRef.current = idx;
          lastProgressRef.current = 0;
          setActiveIndex(idx);
          setSlideProgress(0);
        }

        /* Progress: only update if delta > 0.5% to reduce renders */
        if (idx === lastIdxRef.current && Math.abs(progress - lastProgressRef.current) > 0.005) {
          lastProgressRef.current = progress;
          setSlideProgress(progress);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [count]);

  const handleNavigate = useCallback(
    (i: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const slideHeight = (rect.height - window.innerHeight) / count;
      const containerTop = rect.top + window.scrollY;
      window.scrollTo({
        top: containerTop + i * slideHeight + 2,
        behavior: "smooth",
      });
    },
    [count],
  );

  const handlePlayVideo = useCallback((youtubeId: string) => {
    setVideoModalId(youtubeId);
  }, []);

  const activeProject = PROJECTS[activeIndex];

  return (
    <section
      ref={containerRef}
      style={{
        height: `${(count + 1) * 100}vh`,
        background: "#0B0B0B",
      }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Vertical navigation rail */}
        <div className="absolute right-5 md:right-9 top-1/2 -translate-y-1/2 z-20">
          <NavigationRail
            activeIndex={activeIndex}
            slideProgress={slideProgress}
            count={count}
            onNavigate={handleNavigate}
          />
        </div>

        {/* Left-side progress bar */}
        {activeProject && (
          <LeftProgressBar
            key={`progress-${activeProject.id}`}
            progress={slideProgress}
            brandHex={BRAND[activeProject.id]?.hex || ACCENT}
            brandRgb={BRAND[activeProject.id]?.rgb || "235,26,34"}
          />
        )}

        {/* Active slide */}
        {activeProject && (
          <motion.div
            key={activeProject.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <ProjectSlide project={activeProject} onPlayVideo={handlePlayVideo} />
          </motion.div>
        )}
      </div>

      {/* Video lightbox modal */}
      <VideoModal
        youtubeId={videoModalId || ""}
        isOpen={!!videoModalId}
        onClose={() => setVideoModalId(null)}
      />
    </section>
  );
}