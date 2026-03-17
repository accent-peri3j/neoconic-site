import { LegalPage, LegalSection } from "../components/LegalPage";
import { useSEO } from "../hooks/useSEO";

export function Disclaimer() {
  useSEO({
    title: "Disclaimer",
    description: "Legal disclaimer for the Neoconic website. Limitations of liability and trademark notices.",
    path: "/disclaimer",
  });

  return (
    <LegalPage title="Disclaimer" lastUpdated="March 14, 2026">
      <LegalSection heading="General">
        <p>
          The content on the Neoconic website is provided for informational and
          portfolio purposes only. While we make reasonable efforts to keep the
          information accurate and up to date, we make no representations or
          warranties of any kind — express or implied — about the completeness,
          accuracy, reliability, or suitability of the information.
        </p>
      </LegalSection>

      <LegalSection heading="No guarantee of accuracy">
        <p>
          Neoconic endeavors to ensure that all information on this website is
          correct. However, we do not guarantee that the content is free from
          errors, omissions, or inaccuracies. Information may be changed or
          updated without notice.
        </p>
      </LegalSection>

      <LegalSection heading="Limitation of liability">
        <p>
          Neoconic shall not be liable for any loss or damage — including without
          limitation, indirect or consequential loss or damage — arising from or
          in connection with the use of this website or reliance on any
          information provided herein.
        </p>
      </LegalSection>

      <LegalSection heading="Trademarks and brand names">
        <p>
          Logos, trademarks, and brand names displayed on this website are the
          property of their respective owners. They are shown exclusively for
          identification and portfolio purposes and do not imply any affiliation,
          endorsement, or sponsorship by the trademark holders.
        </p>
      </LegalSection>

      <LegalSection heading="External links">
        <p>
          This website may include links to external sites for convenience or
          reference. Neoconic does not endorse and is not responsible for the
          content or practices of any linked third-party websites.
        </p>
      </LegalSection>
    </LegalPage>
  );
}