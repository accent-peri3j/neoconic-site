import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const ACCENT = "#EB1A22";

/* ── Media item type ── */
export interface MediaItem {
  type: "image" | "youtube";
  src: string;
  alt: string;
}

/* ═══════════════════════════════════════════════════════
   PROJECT MEDIA CAROUSEL
   Single 16:9 container with minimal numbered navigation.
   - 1 item → no navigation
   - 2–5 items → numbered selectors with video indicator
   - YouTube iframes lazy-loaded only when selected
   ═══════════════════════════════════════════════════════ */
export function ProjectMediaCarousel({
  items,
  className = "",
}: {
  items: MediaItem[];
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const [loadedYouTube, setLoadedYouTube] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const count = items.length;
  const hasNav = count > 1;

  /* Clamp active index when items change */
  const safeActive = active >= count ? 0 : active;
  const current = items[safeActive];

  useEffect(() => {
    if (active >= count) setActive(0);
  }, [active, count]);

  /* Mark YouTube as loaded when selected */
  const selectSlide = useCallback(
    (index: number) => {
      setActive(index);
      if (items[index]?.type === "youtube") {
        setLoadedYouTube((prev) => new Set(prev).add(index));
      }
    },
    [items]
  );

  /* Keyboard navigation */
  useEffect(() => {
    if (!hasNav) return;
    const handler = (e: KeyboardEvent) => {
      if (!containerRef.current?.matches(":hover")) return;
      if (e.key === "ArrowLeft") {
        setActive((p) => (p > 0 ? p - 1 : count - 1));
      } else if (e.key === "ArrowRight") {
        setActive((p) => (p < count - 1 ? p + 1 : 0));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hasNav, count]);

  return (
    <div className={className} ref={containerRef}>
      {/* ── Main media container — 16:9 ── */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "16 / 9",
          borderRadius: "8px",
          background: "#0a0a0a",
          boxShadow:
            "0 8px 40px rgba(0,0,0,0.3), 0 2px 12px rgba(0,0,0,0.2)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={safeActive}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {current.type === "youtube" ? (
              <YouTubeLazy
                youtubeId={current.src}
                loaded={loadedYouTube.has(safeActive)}
                onLoad={() =>
                  setLoadedYouTube((prev) => new Set(prev).add(safeActive))
                }
              />
            ) : (
              <ImageWithFallback
                src={current.src}
                alt={current.alt}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  borderRadius: "8px",
                  filter: "brightness(0.92) saturate(0.9)",
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Numbered navigation ── */}
      {hasNav && (
        <div className="mt-5 flex items-center gap-1">
          {items.map((item, i) => {
            const isActive = safeActive === i;
            const isVideo = item.type === "youtube";

            return (
              <button
                key={i}
                onClick={() => selectSlide(i)}
                className="relative flex items-center gap-1.5 cursor-pointer transition-all duration-300"
                style={{
                  padding: "6px 10px",
                  background: "none",
                  border: "none",
                }}
                aria-label={`View ${isVideo ? "video" : "image"} ${i + 1}`}
              >
                {/* Red dot — active indicator */}
                <span
                  className="inline-block rounded-full transition-all duration-300"
                  style={{
                    width: "4px",
                    height: "4px",
                    background: ACCENT,
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "scale(1)" : "scale(0)",
                  }}
                />

                {/* Play icon for video items */}
                {isVideo && (
                  <svg
                    width="7"
                    height="8"
                    viewBox="0 0 7 8"
                    fill="none"
                    className="transition-colors duration-300"
                  >
                    <path
                      d="M7 4L0 8V0L7 4Z"
                      fill={isActive ? "white" : "rgba(255,255,255,0.3)"}
                    />
                  </svg>
                )}

                {/* Number */}
                <span
                  className="transition-colors duration-300"
                  style={{
                    fontSize: "13px",
                    letterSpacing: "0.02em",
                    fontVariantNumeric: "tabular-nums",
                    color: isActive
                      ? "rgba(255,255,255,0.9)"
                      : "rgba(255,255,255,0.25)",
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── YouTube lazy loader ── */
function YouTubeLazy({
  youtubeId,
  loaded,
  onLoad,
}: {
  youtubeId: string;
  loaded: boolean;
  onLoad: () => void;
}) {
  const [playing, setPlaying] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

  if (playing || loaded) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&color=white${playing ? "&autoplay=1" : ""}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
        style={{ borderRadius: "8px" }}
        onLoad={onLoad}
      />
    );
  }

  return (
    <button
      onClick={() => {
        setPlaying(true);
        onLoad();
      }}
      className="absolute inset-0 w-full h-full group/play cursor-pointer"
      aria-label="Play video"
    >
      <img
        src={thumbnailUrl}
        alt="Video thumbnail"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: "brightness(0.7) saturate(0.9)",
          borderRadius: "8px",
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)",
          borderRadius: "8px",
        }}
      />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
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
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
            transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.4), 0 0 20px rgba(235,26,34,0.15)";
            e.currentTarget.style.borderColor = "rgba(235,26,34,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.4)";
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
      </div>
    </button>
  );
}