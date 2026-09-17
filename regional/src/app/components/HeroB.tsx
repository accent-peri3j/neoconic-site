import { useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

const ACCENT = "#EB1A22";
const ACCENT_RGB = { r: 235, g: 26, b: 34 };

/* ════════════════════════════════════════════════════════
   Dot Field Canvas
   A structured grid of tiny red dots with slow organic
   breathing and positional drift. Rendered on <canvas>
   for smooth 60fps performance.
   ════════════════════════════════════════════════════════ */

interface Dot {
  /** base grid position */
  bx: number;
  by: number;
  /** current rendered position */
  x: number;
  y: number;
  /** individual phase offsets for organic variation */
  phase: number;
  phaseY: number;
  /** base opacity (varies by position for depth) */
  baseAlpha: number;
  /** base radius */
  baseRadius: number;
}

function DotFieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const rafRef = useRef<number>(0);
  const dprRef = useRef(1);

  const initDots = useCallback((width: number, height: number) => {
    const dots: Dot[] = [];
    const spacing = 38;
    const cols = Math.ceil(width / spacing) + 2;
    const rows = Math.ceil(height / spacing) + 2;
    const offsetX = (width - (cols - 1) * spacing) / 2;
    const offsetY = (height - (rows - 1) * spacing) / 2;

    /* Centre of canvas — dots near here are brighter */
    const cx = width * 0.52;
    const cy = height * 0.48;
    const maxDist = Math.sqrt(cx * cx + cy * cy);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const bx = offsetX + c * spacing;
        const by = offsetY + r * spacing;
        const dist = Math.sqrt((bx - cx) ** 2 + (by - cy) ** 2);
        const proximity = 1 - dist / maxDist; // 0‑1, higher = closer to centre

        /* Opacity falloff: brighter near centre, fades at edges */
        const baseAlpha = 0.06 + proximity * 0.16;

        dots.push({
          bx,
          by,
          x: bx,
          y: by,
          phase: Math.random() * Math.PI * 2,
          phaseY: Math.random() * Math.PI * 2,
          baseAlpha,
          baseRadius: 1.1 + proximity * 0.6,
        });
      }
    }
    dotsRef.current = dots;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    dprRef.current = dpr;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initDots(rect.width, rect.height);
    };

    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    const draw = () => {
      t += 0.001; // very slow global clock
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      const dots = dotsRef.current;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        /* Gentle positional drift — each dot orbits its grid position */
        const driftX = Math.sin(t * 2.4 + d.phase) * 4.5;
        const driftY = Math.cos(t * 1.8 + d.phaseY) * 4.5;
        d.x = d.bx + driftX;
        d.y = d.by + driftY;

        /* Breathing opacity — slow pulsing unique to each dot */
        const breathe = 0.7 + 0.3 * Math.sin(t * 3.2 + d.phase * 1.5);
        const alpha = d.baseAlpha * breathe;

        /* Subtle radius pulse */
        const radius = d.baseRadius * (0.85 + 0.15 * Math.sin(t * 2 + d.phaseY * 2));

        ctx.beginPath();
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT_RGB.r},${ACCENT_RGB.g},${ACCENT_RGB.b},${alpha})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [initDots]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 1 }}
    />
  );
}

/* ════════════════════════════════════════════════════════
   HERO B — Animated Dot Field
   ════════════════════════════════════════════════════════ */
export function HeroB() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-end overflow-hidden"
      style={{ background: "#0B0B0B" }}
    >
      {/* Dot field background */}
      <DotFieldCanvas />

      {/* ── Ambient red orb — dual-layer glow ── */}
      {/* Layer 1: larger, darker, slower drift */}
      <motion.div
        className="absolute pointer-events-none"
        animate={{
          x: [0, 30, -20, 10, 0],
          y: [0, -25, 15, -10, 0],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          width: "min(110vw, 1400px)",
          height: "min(110vw, 1400px)",
          top: "50%",
          left: "52%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(120,10,14,0.22) 0%, rgba(80,8,10,0.10) 35%, transparent 65%)",
          filter: "blur(120px)",
        }}
      />
      {/* Layer 2: smaller, brighter, slightly faster offset drift */}
      <motion.div
        className="absolute pointer-events-none"
        animate={{
          x: [0, -18, 25, -8, 0],
          y: [0, 20, -18, 12, 0],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          width: "min(65vw, 800px)",
          height: "min(65vw, 800px)",
          top: "48%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(235,26,34,0.18) 0%, rgba(180,18,24,0.08) 40%, transparent 68%)",
          filter: "blur(90px)",
        }}
      />

      {/* Soft vignette overlay to keep edges clean */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 52% 48%, transparent 30%, #0B0B0B 85%)",
        }}
      />

      {/* Bottom fade for text readability */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: "45%",
          background:
            "linear-gradient(to top, #0B0B0B 0%, rgba(11,11,11,0.6) 50%, transparent 100%)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative max-w-[1440px] mx-auto w-full px-8 md:px-12 lg:px-16 pb-28 md:pb-36 pt-48 md:pt-56">
        <motion.h1
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.4,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-white max-w-[920px]"
          style={{
            fontSize: "clamp(2.4rem, 5.5vw, 5rem)",
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: "-0.035em",
          }}
        >
          Designing brands and digital products for fintech and technology
          companies.
        </motion.h1>

        {/* Thin divider line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{
            duration: 1.2,
            delay: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="origin-left mt-14 mb-14"
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.08) 0%, transparent 60%)",
            maxWidth: "400px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: 0.55,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-10"
        >
          <p
            className="max-w-md"
            style={{
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.525)",
              lineHeight: 1.65,
            }}
          >
            Independent design studio based in Amsterdam.
          </p>

          <Link
            to="/work"
            className="group inline-flex items-center gap-3 text-sm tracking-wide text-white transition-all duration-500 w-fit"
            style={{
              padding: "14px 28px",
              border: "1px solid rgba(255,255,255,0.18)",
              letterSpacing: "0.03em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = ACCENT;
              e.currentTarget.style.color = ACCENT;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
              e.currentTarget.style.color = "#fff";
            }}
          >
            View selected work
            <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}