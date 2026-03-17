import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { PageTransition } from "./PageTransition";
import { CookieConsent } from "./CookieConsent";
import { Analytics } from "./Analytics";
import { HeadMeta } from "./HeadMeta";

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0B0B0B" }}>
      <HeadMeta />

      {/* Skip to content — visible on focus for keyboard users */}
      <a
        href="#main-content"
        className="skip-to-content"
        style={{
          position: "fixed",
          top: "-100px",
          left: "16px",
          zIndex: 9999,
          padding: "12px 24px",
          background: "#EB1A22",
          color: "#fff",
          fontSize: "14px",
          fontWeight: 500,
          letterSpacing: "0.02em",
          borderRadius: "0 0 6px 6px",
          textDecoration: "none",
          transition: "top 0.2s ease",
        }}
        onFocus={(e) => {
          e.currentTarget.style.top = "0px";
        }}
        onBlur={(e) => {
          e.currentTarget.style.top = "-100px";
        }}
      >
        Skip to content
      </a>

      <Navigation />
      <main id="main-content" className="flex-1" tabIndex={-1} style={{ outline: "none" }}>
        <AnimatePresence mode="wait">
          <PageTransition pathname={pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
      <CookieConsent />
      <Analytics />
    </div>
  );
}
