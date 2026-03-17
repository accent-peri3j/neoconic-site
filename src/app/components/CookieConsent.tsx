import { useState, useEffect } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";

const ACCENT = "#EB1A22";
const STORAGE_KEY = "neoconic-cookie-consent";

type ConsentState = "pending" | "accepted" | "rejected" | "custom";

interface Preferences {
  essential: boolean; // always true
  analytics: boolean;
}

export function CookieConsent() {
  const [state, setState] = useState<ConsentState>("pending");
  const [showCustom, setShowCustom] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>({
    essential: true,
    analytics: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setState("accepted"); // any stored value = user already chose
    }
  }, []);

  function save(consent: Preferences) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    setState("accepted");

    // Dispatch custom event so analytics can listen
    window.dispatchEvent(
      new CustomEvent("neoconic-consent", { detail: consent })
    );
  }

  function acceptAll() {
    save({ essential: true, analytics: true });
  }

  function rejectAll() {
    save({ essential: true, analytics: false });
  }

  function saveCustom() {
    save(prefs);
  }

  if (state !== "pending") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
      >
        <div
          className="max-w-[520px] mx-auto md:mx-0 md:ml-6 rounded-xl px-6 py-5"
          style={{
            background: "#141414",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          }}
        >
          {/* Main banner */}
          {!showCustom && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p
                  style={{
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.8)",
                    lineHeight: 1.5,
                  }}
                >
                  We use cookies to improve your experience.
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.45)",
                    lineHeight: 1.6,
                  }}
                >
                  This site uses essential cookies for functionality and
                  optional analytics cookies to understand how you use our site.{" "}
                  <Link
                    to="/privacy-policy"
                    className="underline transition-colors duration-300"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = ACCENT;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                    }}
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={acceptAll}
                  className="px-4 py-2 rounded-md text-sm transition-opacity duration-200 cursor-pointer"
                  style={{
                    background: "white",
                    color: "#0B0B0B",
                    fontSize: "13px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.85";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  Accept all
                </button>
                <button
                  onClick={rejectAll}
                  className="px-4 py-2 rounded-md text-sm transition-colors duration-200 cursor-pointer"
                  style={{
                    background: "transparent",
                    color: "rgba(255,255,255,0.75)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontSize: "13px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                  }}
                >
                  Reject all
                </button>
                <button
                  onClick={() => setShowCustom(true)}
                  className="px-4 py-2 text-sm transition-colors duration-200 cursor-pointer"
                  style={{
                    background: "transparent",
                    color: "rgba(255,255,255,0.53)",
                    fontSize: "13px",
                    border: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.53)";
                  }}
                >
                  Customize
                </button>
              </div>
            </div>
          )}

          {/* Custom preferences */}
          {showCustom && (
            <div className="flex flex-col gap-5">
              <p
                style={{
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                Cookie preferences
              </p>

              {/* Essential */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span
                    style={{
                      fontSize: "13px",
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    Essential
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.38)",
                    }}
                  >
                    Required for core functionality
                  </span>
                </div>
                <div
                  className="w-9 h-5 rounded-full relative"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                >
                  <div
                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full"
                    style={{ background: "rgba(255,255,255,0.5)" }}
                  />
                </div>
              </div>

              {/* Analytics toggle */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span
                    style={{
                      fontSize: "13px",
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    Analytics
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.38)",
                    }}
                  >
                    Anonymous usage statistics
                  </span>
                </div>
                <button
                  onClick={() =>
                    setPrefs((p) => ({ ...p, analytics: !p.analytics }))
                  }
                  className="w-9 h-5 rounded-full relative transition-colors duration-200 cursor-pointer border-none"
                  style={{
                    background: prefs.analytics
                      ? ACCENT
                      : "rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
                    style={{
                      background: "white",
                      left: prefs.analytics ? "calc(100% - 18px)" : "2px",
                    }}
                  />
                </button>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={saveCustom}
                  className="px-4 py-2 rounded-md text-sm transition-opacity duration-200 cursor-pointer"
                  style={{
                    background: "white",
                    color: "#0B0B0B",
                    fontSize: "13px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.85";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  Save preferences
                </button>
                <button
                  onClick={() => setShowCustom(false)}
                  className="px-4 py-2 text-sm transition-colors duration-200 cursor-pointer"
                  style={{
                    background: "transparent",
                    color: "rgba(255,255,255,0.53)",
                    fontSize: "13px",
                    border: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.53)";
                  }}
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}