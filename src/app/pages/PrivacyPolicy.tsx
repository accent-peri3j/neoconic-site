import { LegalPage, LegalSection } from "../components/LegalPage";
import { useSEO } from "../hooks/useSEO";

export function PrivacyPolicy() {
  useSEO({
    title: "Privacy Policy",
    description: "Neoconic privacy policy — how we collect, use, and protect your data. GDPR compliant.",
    path: "/privacy-policy",
  });

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