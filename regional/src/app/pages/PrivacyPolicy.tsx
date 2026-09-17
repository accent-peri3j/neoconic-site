import { LegalPage, LegalSection } from "../components/LegalPage";
import { useSEO } from "../hooks/useSEO";
import { useLocation } from "react-router";
import { isCwPath } from "../data/curacao";
import { openCookieSettings } from "@/lib/analytics";
import { useCuracaoSEO } from "../hooks/useCuracaoSEO";
import { getCuracaoSEOProps } from "../seo/curacao-seo.mjs";

export function PrivacyPolicy() {
  const curacao = isCwPath(useLocation().pathname);
  useSEO(curacao ? getCuracaoSEOProps("/cw/privacy-policy") : {
    title: "Privacy Policy",
    description: "Neoconic privacy policy — how we collect, use, and protect your data. GDPR compliant.",
    path: "/privacy-policy",
  });
  useCuracaoSEO(curacao ? "/cw/privacy-policy" : null);

  if (curacao) {
    return (
      <LegalPage title="Privacy Policy" lastUpdated="September 17, 2026" homePath="/cw">
        <LegalSection heading="Who we are">
          <p>Neoconic is an independent design practice based in Amsterdam, The Netherlands, providing branding, marketing and design services for businesses in Curaçao and internationally.</p>
          <p>Chamber of Commerce (KvK): 80114172<br />VAT number: NL003394829B60<br />Contact: hello@neoconic.com</p>
        </LegalSection>
        <LegalSection heading="Contact information">
          <p>When you email us, we receive the contact details and information you choose to send. We use these to respond to your enquiry and discuss the work you request. Clicking an email link opens your own email application; this website does not submit a contact form.</p>
          <p>We do not sell your personal information. Service providers involved in hosting, email and consented analytics may process information to provide those services.</p>
        </LegalSection>
        <LegalSection heading="Optional Google Analytics">
          <p>We load Google Analytics only after you allow analytics cookies. It helps us understand page visits, referral sources, device and browser types, approximate location, and interactions with our email and copy-email controls. Analytics cookies use identifiers to distinguish visits; these statistics are not described as fully anonymous.</p>
          <p>Google processes this usage information. Our contact events record the type of interaction, not your email address, message content or confirmation that an email was sent. Google Signals and advertising personalization are disabled in this regional implementation.</p>
          <p>For information about Google's processing, see <a className="underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>.</p>
        </LegalSection>
        <LegalSection heading="Cookies and your choices">
          <p>Your analytics choice is saved in your browser. Rejecting analytics leaves the Google tag unloaded. You can change your choice at any time using Cookie settings below or in the footer. Withdrawing consent stops regional analytics, removes its Google Analytics cookies and reloads the page to unload the tag.</p>
          <p>A separate, essential region-preference cookie remembers an explicit Global or Curaçao choice. Approximate country information supplied by our hosting provider selects the initial regional experience; it is not precise device-location tracking.</p>
          <button type="button" onClick={openCookieSettings} className="min-h-11 self-start underline cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-white focus-visible:outline-offset-4" style={{ color: "rgba(255,255,255,.85)" }}>Cookie settings</button>
        </LegalSection>
        <LegalSection heading="Retention and requests">
          <p>We keep enquiry correspondence for as long as it is needed to respond and manage the work you request, subject to applicable record-keeping requirements. Analytics retention follows the settings of our existing Google Analytics property.</p>
          <p>Contact hello@neoconic.com to ask about access, correction, deletion or retention of your personal information, or to raise a privacy concern. Withdrawing analytics consent does not remove data already processed; contact us about any deletion request.</p>
        </LegalSection>
        <LegalSection heading="Other websites">
          <p>Links to project websites and other third parties follow those providers' privacy practices. This notice covers the Neoconic Curaçao website.</p>
        </LegalSection>
      </LegalPage>
    );
  }

  return (
    <LegalPage title="Privacy Policy" lastUpdated="March 14, 2026">
      <LegalSection heading="Who we are">
        <p>
          Neoconic is an independent design practice based in Amsterdam, The
          Netherlands. We specialize in brand identity, product design, and
          marketing design for fintech and technology companies.
        </p>
        <p>
          Chamber of Commerce (KvK): 80114172
          <br />
          VAT number: NL003394829B60
          <br />
          Contact: hello@neoconic.com
        </p>
      </LegalSection>

      <LegalSection heading="What data we collect">
        <p>We may collect the following types of information:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li>
            Contact form submissions — including your name, email address, and
            message content.
          </li>
          <li>
            Email communication — any information you share with us via email.
          </li>
          <li>
            Analytics data — anonymous usage statistics such as IP address,
            browser type, device information, pages visited, and approximate
            geographic location.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="How we use your data">
        <p>The information we collect is used exclusively to:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li>Respond to your inquiries and communications.</li>
          <li>
            Improve the website experience through anonymous usage analysis.
          </li>
        </ul>
        <p>We do not sell, trade, or share your personal data with third parties.</p>
      </LegalSection>

      <LegalSection heading="Analytics">
        <p>
          This website may use privacy-friendly analytics tools to collect
          anonymous usage data, including pages visited, device type, approximate
          location, and referrer sources. This data is aggregated and cannot be
          used to personally identify you.
        </p>
      </LegalSection>

      <LegalSection heading="Cookies">
        <p>
          This website uses minimal cookies required for basic functionality. We
          will ask for your consent before setting any non-essential cookies.
          You can manage your cookie preferences at any time through the cookie
          banner or your browser settings.
        </p>
      </LegalSection>

      <LegalSection heading="Data retention">
        <p>
          We retain personal data only for as long as necessary to fulfill the
          purposes described above. Contact form submissions and email
          correspondence are retained for a reasonable period and then deleted.
        </p>
      </LegalSection>

      <LegalSection heading="Your rights under GDPR">
        <p>
          As a resident of the European Economic Area, you have the right to:
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li>Access the personal data we hold about you.</li>
          <li>Request correction of inaccurate data.</li>
          <li>Request deletion of your personal data.</li>
          <li>Object to or restrict the processing of your data.</li>
          <li>Request data portability.</li>
        </ul>
        <p>
          To exercise any of these rights, please contact us at
          hello@neoconic.com. We will respond within 30 days.
        </p>
      </LegalSection>

      <LegalSection heading="External links">
        <p>
          This website may contain links to external websites. We are not
          responsible for the privacy practices or content of those sites. We
          encourage you to review the privacy policies of any third-party
          websites you visit.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
