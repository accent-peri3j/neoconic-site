import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

const ACCENT = "#EB1A22";

/* ═══════════════════════════════════════════════════════
   VIDEO EMBED — Responsive 16:9 YouTube iframe
   Lazy-loads: only mounts the iframe when user clicks play.
   ═══════════════════════════════════════════════════════ */
export function VideoEmbed({
  youtubeId,
  className = "",
  autoplay = false,
}: {
  youtubeId: string;
  className?: string;
  autoplay?: boolean;
}) {
  const [loaded, setLoaded] = useState(autoplay);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Lazy visibility: preload poster when in viewport */
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: "16 / 9",
        borderRadius: "6px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.35), 0 2px 12px rgba(0,0,0,0.25)",
        background: "#0a0a0a",
      }}
    >
      {loaded ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&color=white`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
          style={{ borderRadius: "6px" }}
        />
      ) : (
        <button
          onClick={() => setLoaded(true)}
          className="absolute inset-0 w-full h-full group/play cursor-pointer"
          aria-label="Play video"
        >
          {/* Thumbnail */}
          {inView && (
            <img
              src={thumbnailUrl}
              alt="Video thumbnail"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                filter: "brightness(0.7) saturate(0.9)",
                borderRadius: "6px",
              }}
            />
          )}

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 100%)",
              borderRadius: "6px",
            }}
          />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="flex items-center justify-center transition-all duration-500 group-hover/play:scale-110"
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <svg
                width="20"
                height="24"
                viewBox="0 0 20 24"
                fill="none"
                className="ml-1 transition-colors duration-300"
              >
                <path
                  d="M20 12L0 24V0L20 12Z"
                  fill="white"
                  fillOpacity="0.9"
                />
              </svg>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VIDEO PREVIEW — Thumbnail with play button overlay
   For use on the home page / cinematic showcase.
   Does NOT load any iframe — lightweight.
   ═══════════════════════════════════════════════════════ */
export function VideoPreview({
  youtubeId,
  onClick,
  className = "",
}: {
  youtubeId: string;
  onClick: () => void;
  className?: string;
}) {
  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden group/preview cursor-pointer ${className}`}
      style={{
        aspectRatio: "16 / 9",
        borderRadius: "6px",
        boxShadow:
          "0 6px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)",
        background: "#0a0a0a",
      }}
      aria-label="Play video"
    >
      <img
        src={thumbnailUrl}
        alt="Video thumbnail"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/preview:scale-[1.03]"
        style={{
          filter: "brightness(0.65) saturate(0.9)",
          borderRadius: "6px",
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)",
          borderRadius: "6px",
        }}
      />

      {/* Centered play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex items-center justify-center transition-all duration-500 group-hover/preview:scale-110"
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          <svg
            width="18"
            height="22"
            viewBox="0 0 20 24"
            fill="none"
            className="ml-0.5"
          >
            <path
              d="M20 12L0 24V0L20 12Z"
              fill="white"
              fillOpacity="0.9"
            />
          </svg>
        </div>
      </div>

      {/* Film badge */}
      <div
        className="absolute bottom-4 left-4 flex items-center gap-2 pointer-events-none"
        style={{ opacity: 0.7 }}
      >
        <span
          className="w-[5px] h-[5px] rounded-full"
          style={{
            background: ACCENT,
            boxShadow: "0 0 6px 1px rgba(235,26,34,0.3)",
          }}
        />
        <span
          className="text-[10px] uppercase tracking-[0.18em] text-white"
          style={{ fontWeight: 500 }}
        >
          Brand Film
        </span>
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════
   VIDEO MODAL — Lightbox with darkened backdrop
   ESC / click-outside to close. Fade + scale animation.
   ═══════════════════════════════════════════════════════ */
export function VideoModal({
  youtubeId,
  isOpen,
  onClose,
}: {
  youtubeId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[70] flex items-center justify-center cursor-pointer"
          style={{ background: "rgba(0,0,0,0.92)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[90vw] max-w-[1100px] cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative overflow-hidden"
              style={{
                aspectRatio: "16 / 9",
                borderRadius: "8px",
                boxShadow:
                  "0 24px 80px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.3)",
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&color=white`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
                style={{ borderRadius: "8px" }}
              />
            </div>
          </motion.div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            }}
            aria-label="Close video"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeOpacity="0.7"
              />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
