import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import NeoconicLogoBlack from "../../imports/NeoconicLogoBlack";

const ACCENT = "#EB1A22";

/* ═══════════════════════════════════════════════════════
   THEME DETECTION
   ═══════════════════════════════════════════════════════ */
function useHeaderTheme(): "dark" | "light" {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const rafRef = useRef(0);

  useEffect(() => {
    const detect = () => {
      rafRef.current = requestAnimationFrame(() => {
        const probeY = 36;
        const els = document.elementsFromPoint(window.innerWidth / 2, probeY);
        const isLight = els.some(
          (el) =>
            el instanceof HTMLElement &&
            el.dataset.headerTheme === "light"
        );
        setTheme(isLight ? "light" : "dark");
      });
    };

    window.addEventListener("scroll", detect, { passive: true });
    window.addEventListener("resize", detect, { passive: true });
    detect();

    return () => {
      window.removeEventListener("scroll", detect);
      window.removeEventListener("resize", detect);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return theme;
}

/* ═══════════════════════════════════════════════════════
   NAVIGATION
   Minimal floating header — no pill, no outline.
   Logo left, bare text links right.
   ═══════════════════════════════════════════════════════ */
export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const headerTheme = useHeaderTheme();
  const isDark = headerTheme === "dark";

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* ── Subtle top vignette for readability over imagery ── */}
      <div
        className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
        style={{
          height: "110px",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.07) 50%, transparent 100%)",
          opacity: isDark ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* ══════════════════════════════════════════════
          HEADER BAR
          ══════════════════════════════════════════════ */}
      <header
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
        style={{ padding: "28px clamp(24px, 4vw, 64px) 0" }}
      >
        <div className="flex items-center justify-between pointer-events-auto">
          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center shrink-0"
            aria-label="Neoconic Home"
            style={{
              filter: isDark
                ? "drop-shadow(0 1px 3px rgba(0,0,0,0.35))"
                : "none",
              transition: "filter 0.4s ease",
            }}
          >
            <div
              style={{
                width: "128px",
                height: "18px",
                position: "relative",
                "--fill-0": isDark ? "white" : "#0B0B0B",
              } as React.CSSProperties}
            >
              <NeoconicLogoBlack />
            </div>
          </Link>

          {/* ── Desktop links — bare floating text ── */}
          <nav className="hidden md:flex items-center" style={{ gap: "48px" }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <NavLink
                  key={link.href}
                  to={link.href}
                  label={link.label}
                  isActive={isActive}
                  isDark={isDark}
                />
              );
            })}
          </nav>

          {/* ── Mobile hamburger ── */}
          <button
            className="md:hidden relative w-10 h-10 flex items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{ background: "transparent", border: "none" }}
          >
            <span className="relative w-5 h-3 flex flex-col justify-between">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="block w-full h-px origin-center absolute left-0"
                  style={{
                    background: menuOpen
                      ? ACCENT
                      : isDark
                        ? "white"
                        : "#0B0B0B",
                    filter:
                      isDark && !menuOpen
                        ? "drop-shadow(0 0 2px rgba(0,0,0,0.4))"
                        : "none",
                    transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                    top:
                      i === 0
                        ? menuOpen
                          ? "50%"
                          : "0%"
                        : i === 1
                          ? "50%"
                          : menuOpen
                            ? "50%"
                            : "100%",
                    transform:
                      i === 0 && menuOpen
                        ? "translateY(-50%) rotate(45deg)"
                        : i === 2 && menuOpen
                          ? "translateY(-50%) rotate(-45deg)"
                          : i === 1
                            ? "translateY(-50%)"
                            : "translateY(-50%)",
                    opacity: i === 1 && menuOpen ? 0 : 1,
                  }}
                />
              ))}
            </span>
          </button>
        </div>
      </header>

      {/* ── Mobile fullscreen menu ── */}
      <div
        className="fixed inset-0 z-40 md:hidden flex flex-col justify-center px-8 transition-all duration-500"
        style={{
          background: "#0B0B0B",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "all" : "none",
        }}
      >
        <ul className="flex flex-col gap-6">
          {navLinks.map((link, i) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className="block text-white transition-transform duration-500"
                style={{
                  fontSize: "clamp(2.5rem, 10vw, 4rem)",
                  fontWeight: 500,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.15,
                  transform: menuOpen
                    ? "translateY(0)"
                    : `translateY(${20 + i * 10}px)`,
                  transitionDelay: menuOpen ? `${i * 60}ms` : "0ms",
                }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   NAV LINK
   • Contextual colour (white on dark, black on light)
   • Hover: red underline from center, no weight change
   • Smooth 200ms transitions
   ═══════════════════════════════════════════════════════ */
function NavLink({
  to,
  label,
  isActive,
  isDark,
}: {
  to: string;
  label: string;
  isActive: boolean;
  isDark: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  /* Text colour */
  const color = isDark
    ? isActive || hovered
      ? "#fff"
      : "rgba(255,255,255,0.55)"
    : isActive || hovered
      ? "#0B0B0B"
      : "rgba(0,0,0,0.4)";

  const showLine = isActive || hovered;

  return (
    <Link
      to={to}
      className="relative text-[13px] pb-1"
      style={{
        color,
        fontWeight: 500,
        letterSpacing: "0.025em",
        transition: "color 0.2s ease",
        filter: isDark
          ? "drop-shadow(0 1px 2px rgba(0,0,0,0.3))"
          : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}

      {/* Red underline — expands from center */}
      <span
        className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[1.5px] rounded-full"
        style={{
          width: showLine ? "100%" : "0%",
          background: ACCENT,
          opacity: isActive ? 1 : 0.8,
          transition: "width 0.18s cubic-bezier(0.16,1,0.3,1), opacity 0.18s ease",
        }}
      />
    </Link>
  );
}