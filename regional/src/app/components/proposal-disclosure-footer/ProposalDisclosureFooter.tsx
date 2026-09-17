import { useEffect, type ReactNode } from "react";

type LegalLink = {
  label: string;
  href: string;
};

type ProposalDisclosureFooterProps = {
  accentColor?: string;
  brandDescription?: string;
  ctaHref?: string;
  ctaText?: string;
  disclaimer?: string;
  email?: string;
  legalLinks?: LegalLink[];
  logo?: ReactNode;
  metadata?: string;
  privacyNote?: string;
  siteLabel?: string;
  siteUrl?: string;
};

const DEFAULT_LEGAL_LINKS: LegalLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

const SATOSHI_STYLESHEET_ID = "neoconic-proposal-satoshi";
const SATOSHI_STYLESHEET_URL =
  "https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap";

function DefaultNeoconicLogo() {
  return (
    <svg
      aria-hidden="true"
      className="proposal-footer__logo-svg"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 1169.68 167.951"
    >
      <path d="M891.199 0.340169C937.505 0.340169 975.008 37.8436 975.008 84.1489V167.575H937.505V84.1489C937.505 58.5088 916.839 37.8436 891.199 37.8436C865.559 37.8436 844.894 58.5088 844.894 84.1489V167.575H807.773C807.773 167.575 806.243 129.88 807.774 84.1489C809.304 38.4178 844.894 14.4996 844.894 14.4996C857.905 5.69781 873.978 0.340169 891.199 0.340169Z" fill="#ffffff" />
      <path d="M711.536 0.340103C757.841 0.340103 795.344 37.8435 795.344 84.1488C795.344 130.454 757.841 167.575 711.536 167.575C665.23 167.575 628.11 130.454 628.11 84.1488C628.11 37.8435 665.23 0.340103 711.536 0.340103ZM711.536 130.454C737.176 130.454 757.841 109.789 757.841 84.1488C757.841 58.5087 737.176 37.8435 711.536 37.8435C685.896 37.8435 665.23 58.5087 665.23 84.1488C665.23 109.789 685.896 130.454 711.536 130.454Z" fill="#ffffff" />
      <path d="M398.825 0.340169C445.131 0.340169 482.634 37.8436 482.634 84.1489C482.634 130.454 445.131 167.575 398.825 167.575C352.52 167.575 315.399 130.454 315.399 84.1489C315.399 37.8436 352.52 0.340169 398.825 0.340169ZM398.825 130.454C424.465 130.454 445.131 109.789 445.131 84.1489C445.131 58.5088 424.465 37.8436 398.825 37.8436C373.185 37.8436 352.52 58.5088 352.52 84.1489C352.52 109.789 373.185 130.454 398.825 130.454Z" fill="#ffffff" />
      <path d="M84.1062 0.340103C130.411 0.340103 167.915 37.8435 167.915 84.1488V167.575H130.411V84.1488C130.411 58.5087 109.746 37.8435 84.1062 37.8435C58.4661 37.8435 37.8009 58.5087 37.8009 84.1488V167.575H0.680134C0.680134 167.575 -0.850362 129.88 0.680426 84.1488C2.21121 38.4177 37.8009 14.4996 37.8009 14.4996C50.8123 5.69774 66.8852 0.340103 84.1062 0.340103Z" fill="#ffffff" />
      <path d="M493.404 83.8088C493.404 37.5035 530.908 1.37716e-05 577.213 1.17476e-05L622.37 9.77368e-06V37.5035L577.213 37.5035C551.573 37.5035 530.908 58.1686 530.908 83.8088C530.908 109.449 551.573 130.114 577.213 130.114H622.37V167.235C622.37 167.235 622.944 168.765 577.213 167.235C531.482 165.704 507.564 130.114 507.564 130.114C498.762 117.103 493.404 101.03 493.404 83.8088Z" fill="#ffffff" />
      <path d="M180.457 83.8087C180.457 37.5035 217.961 3.99795e-06 264.266 1.97388e-06L309.423 0V37.5035H264.266C238.626 37.5035 217.961 58.1686 217.961 83.8087C217.961 109.449 238.626 130.114 264.266 130.114H309.423V167.235C309.423 167.235 309.997 168.765 264.266 167.234C218.535 165.704 194.617 130.114 194.617 130.114C185.815 117.103 180.457 101.03 180.457 83.8087Z" fill="#ffffff" />
      <path d="M292.322 82.8785C292.322 68.7452 280.806 57.2292 266.673 57.2292C252.54 57.2292 241.547 68.7452 241.547 82.8785C241.547 96.4884 252.54 108.004 266.673 108.004C280.806 108.004 292.322 96.4884 292.322 82.8785Z" fill="#EB1A22" />
      <path d="M1040.71 83.8452C1040.71 37.54 1078.21 0.0365009 1124.52 0.0364989L1169.67 0.0364969V37.54L1124.52 37.54C1098.88 37.54 1078.21 58.2051 1078.21 83.8452C1078.21 109.485 1098.88 130.151 1124.52 130.151H1169.67V167.271C1169.67 167.271 1170.25 168.802 1124.52 167.271C1078.79 165.74 1054.87 130.151 1054.87 130.151C1046.07 117.139 1040.71 101.066 1040.71 83.8452Z" fill="#ffffff" />
      <path clipRule="evenodd" d="M990.899 0.340136V167.575H1028.02V0.340136H990.899Z" fill="#ffffff" fillRule="evenodd" />
    </svg>
  );
}

const styles = `
.proposal-footer {
  background: linear-gradient(180deg, rgba(235,26,34,0.04) 0%, rgba(5,5,5,0) 22%), #050505 !important;
  border-top: 1px solid rgba(255,255,255,0.08) !important;
  border-radius: 0 !important;
  color: #ffffff !important;
  color-scheme: dark;
  display: block !important;
  font-family: "Satoshi", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
  font-size: 16px !important;
  font-style: normal !important;
  font-weight: 400 !important;
  isolation: isolate;
  letter-spacing: 0 !important;
  line-height: normal !important;
  overflow: hidden !important;
  text-align: left !important;
  text-transform: none !important;
  width: 100% !important;
}

.proposal-footer,
.proposal-footer * {
  box-sizing: border-box !important;
  font-family: "Satoshi", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
}

.proposal-footer__inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 48px 24px calc(48px + env(safe-area-inset-bottom));
}

.proposal-footer__grid {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 36px;
}

.proposal-footer__label-group {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.proposal-footer__label {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #EB1A22 !important;
  font-size: 11px !important;
  font-weight: 500 !important;
  letter-spacing: 0.16em !important;
  line-height: 1.2 !important;
  text-transform: uppercase !important;
}

.proposal-footer__dot {
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: #EB1A22 !important;
  flex: 0 0 auto;
  animation: proposalFooterDotPulse 5s ease-in-out infinite;
}

.proposal-footer__line {
  height: 1px;
  flex: 0 1 96px;
  width: min(18vw, 96px);
  min-width: 36px;
  background: linear-gradient(90deg, rgba(235,26,34,0.16) 0%, rgba(235,26,34,0) 100%) !important;
}

.proposal-footer__metadata {
  margin: 0;
  color: rgba(255,255,255,0.24) !important;
  font-size: 10px !important;
  letter-spacing: 0.16em !important;
  line-height: 1.4 !important;
  text-transform: uppercase !important;
}

.proposal-footer__disclaimer {
  max-width: 760px;
  margin: 0;
  color: rgba(255,255,255,0.52) !important;
  font-size: 13px !important;
  line-height: 1.65 !important;
}

.proposal-footer__bottom {
  display: grid;
  grid-template-columns: 1fr;
  align-items: start;
  gap: 20px;
  border-top: 1px solid rgba(255,255,255,0.035);
}

.proposal-footer__privacy {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 20px;
}

.proposal-footer__privacy p,
.proposal-footer__cta p,
.proposal-footer__brand-description {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
}

.proposal-footer__privacy p {
  color: rgba(255,255,255,0.34) !important;
}

.proposal-footer__links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 16px;
}

.proposal-footer__link,
.proposal-footer__signature-link {
  color: rgba(255,255,255,0.3) !important;
  font-size: 11px !important;
  line-height: 1.6 !important;
  text-decoration: none !important;
  transition: color 220ms ease;
}

.proposal-footer__signature-link {
  color: rgba(255,255,255,0.42) !important;
  font-size: 12px !important;
}

.proposal-footer__link:hover,
.proposal-footer__signature-link:hover {
  color: rgba(255,255,255,0.68) !important;
}

.proposal-footer__cta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding-top: 20px;
}

.proposal-footer__cta p {
  color: rgba(255,255,255,0.38) !important;
}

.proposal-footer__button {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  width: fit-content;
  flex: 0 0 auto;
  padding: 14px 28px;
  border: 1px solid rgba(255,255,255,0.18);
  color: #fff !important;
  font-size: 14px !important;
  letter-spacing: 0.03em !important;
  line-height: 1.2 !important;
  text-decoration: none !important;
  transition: border-color 500ms ease, color 500ms ease;
}

.proposal-footer__button:hover {
  border-color: #EB1A22 !important;
  color: #EB1A22 !important;
}

.proposal-footer__button-arrow {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  transition: transform 500ms ease;
}

.proposal-footer__button:hover .proposal-footer__button-arrow {
  transform: translateX(4px);
}

.proposal-footer__signature {
  display: flex;
  height: fit-content;
  flex-direction: column;
  gap: 20px;
}

.proposal-footer__logo-link {
  display: block;
  width: fit-content;
  color: rgba(255,255,255,0.86) !important;
  text-decoration: none !important;
}

.proposal-footer__logo-svg {
  display: block;
  width: 120px;
  height: auto;
}

.proposal-footer__logo-fallback {
  color: white !important;
  font-size: 22px !important;
  font-weight: 700 !important;
  letter-spacing: -0.04em !important;
  line-height: 1 !important;
}

.proposal-footer__brand-description {
  color: rgba(255,255,255,0.46) !important;
  font-size: 13px !important;
}

.proposal-footer__signature-links {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;
}

@keyframes proposalFooterDotPulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

@media (min-width: 768px) {
  .proposal-footer__inner {
    padding: 64px 48px 56px;
  }

  .proposal-footer__grid {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    grid-template-rows: auto auto;
    column-gap: clamp(64px, 8vw, 96px);
    row-gap: 64px;
  }

  .proposal-footer__label-group,
  .proposal-footer__signature {
    grid-column: span 4;
  }

  .proposal-footer__disclaimer,
  .proposal-footer__bottom {
    grid-column: 6 / span 7;
  }

  .proposal-footer__label-group,
  .proposal-footer__disclaimer {
    grid-row: 1;
  }

  .proposal-footer__signature,
  .proposal-footer__bottom {
    grid-row: 2;
  }

  .proposal-footer__signature {
    align-self: end;
  }

  .proposal-footer__bottom {
    grid-template-columns: minmax(0, 1.1fr) auto;
    align-items: end;
    column-gap: 40px;
  }

  .proposal-footer__cta {
    align-items: flex-end;
    text-align: right;
  }

  .proposal-footer__dot {
    width: 6px;
    height: 6px;
  }
}

@media (min-width: 1024px) {
  .proposal-footer__inner {
    padding-left: 64px;
    padding-right: 64px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .proposal-footer__dot {
    animation: none;
    opacity: 0.9;
  }
}
`;

export function ProposalDisclosureFooter({
  accentColor: _accentColor = "#EB1A22",
  brandDescription = "Design studio based in Amsterdam.",
  ctaHref = "mailto:hello@neoconic.com?subject=Discussing%20the%20concept%20proposal",
  ctaText = "Discuss this concept",
  disclaimer = "This is a conceptual design proposal created by Neoconic for presentation purposes. Designs, flows, visuals, logos, messaging, and product ideas shown here are exploratory and do not represent a final product, approved partnership, legal offer, or production-ready implementation.",
  email = "hello@neoconic.com",
  legalLinks = DEFAULT_LEGAL_LINKS,
  logo,
  metadata = "NEOCONIC / AMSTERDAM / 2026",
  privacyNote = "Privacy-conscious analytics may be used after consent to understand aggregate proposal engagement. No advertising pixels or cross-site tracking.",
  siteLabel = "neoconic.com",
  siteUrl = "https://neoconic.com",
}: ProposalDisclosureFooterProps) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(SATOSHI_STYLESHEET_ID)) return;

    const link = document.createElement("link");
    link.id = SATOSHI_STYLESHEET_ID;
    link.rel = "stylesheet";
    link.href = SATOSHI_STYLESHEET_URL;
    document.head.appendChild(link);
  }, []);

  return (
    <aside
      aria-label="Neoconic concept proposal disclosure"
      className="proposal-footer"
    >
      <style>{styles}</style>
      <div className="proposal-footer__inner">
        <div className="proposal-footer__grid">
          <div className="proposal-footer__label-group">
            <div className="proposal-footer__label">
              <span className="proposal-footer__dot" aria-hidden="true" />
              <span>CONCEPT PROPOSAL</span>
              <span className="proposal-footer__line" aria-hidden="true" />
            </div>
            <p className="proposal-footer__metadata">{metadata}</p>
          </div>

          <p className="proposal-footer__disclaimer">{disclaimer}</p>

          <div className="proposal-footer__bottom">
            <div className="proposal-footer__privacy">
              <p>{privacyNote}</p>
              <div className="proposal-footer__links">
                {legalLinks.map((link) => (
                  <a
                    className="proposal-footer__link"
                    href={link.href}
                    key={link.href}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="proposal-footer__cta">
              <p>Ready to explore the direction?</p>
              <a className="proposal-footer__button" href={ctaHref}>
                {ctaText}
                <svg
                  aria-hidden="true"
                  className="proposal-footer__button-arrow"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          <div className="proposal-footer__signature">
            <a
              aria-label="Visit the Neoconic website"
              className="proposal-footer__logo-link"
              href={siteUrl}
              rel="noreferrer"
              target="_blank"
            >
              {logo ?? <DefaultNeoconicLogo />}
            </a>

            <div>
              <p className="proposal-footer__brand-description">
                {brandDescription}
              </p>
              <div className="proposal-footer__signature-links">
                <a
                  className="proposal-footer__signature-link"
                  href={siteUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {siteLabel}
                </a>
                <a
                  className="proposal-footer__signature-link"
                  href={`mailto:${email}`}
                >
                  {email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
