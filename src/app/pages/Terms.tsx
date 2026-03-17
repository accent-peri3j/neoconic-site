import { LegalPage, LegalSection } from "../components/LegalPage";
import { useSEO } from "../hooks/useSEO";

export function Terms() {
  useSEO({
    title: "Terms of Use",
    description: "Terms of use for the Neoconic website. Intellectual property, portfolio work, and governing law.",
    path: "/terms",
  });

  return (
    <LegalPage title="Terms of Use" lastUpdated="March 14, 2026">
      <LegalSection heading="General">
        <p>
          By accessing and using the Neoconic website, you agree to be bound by
          these Terms of Use. If you do not agree with any part of these terms,
          please discontinue use of this website.
        </p>
      </LegalSection>

      <LegalSection heading="Intellectual property">
        <p>
          All content on this website — including but not limited to text,
          graphics, layouts, designs, and code — is the intellectual property of
          Neoconic unless otherwise indicated. Unauthorized reproduction,
          distribution, or modification of this content is prohibited.
        </p>
      </LegalSection>

      <LegalSection heading="Portfolio work">
        <p>
          The projects displayed on this website represent past and current work
          completed by Neoconic in collaboration with the respective clients.
          All work is shown for portfolio and demonstration purposes only.
        </p>
        <p>
          Logos, trademarks, and brand names shown on this website remain the
          property of their respective owners and are displayed solely for
          identification and portfolio purposes. Their inclusion does not imply
          endorsement, sponsorship, or affiliation.
        </p>
      </LegalSection>

      <LegalSection heading="No binding offer">
        <p>
          The information presented on this website is for general informational
          purposes only. Nothing on this website constitutes a binding offer,
          contract, or commitment to provide services. Any engagement for
          services will be formalized through a separate agreement.
        </p>
      </LegalSection>

      <LegalSection heading="External links">
        <p>
          This website may contain links to third-party websites or services.
          Neoconic has no control over and assumes no responsibility for the
          content, privacy policies, or practices of any external sites.
        </p>
      </LegalSection>

      <LegalSection heading="Limitation of liability">
        <p>
          Neoconic makes reasonable efforts to ensure the accuracy and
          completeness of information on this website. However, we do not
          guarantee that all information is current, complete, or free of errors.
          Neoconic shall not be held liable for any damages arising from the use
          of or inability to use this website.
        </p>
      </LegalSection>

      <LegalSection heading="Governing law">
        <p>
          These terms are governed by the laws of The Netherlands. Any disputes
          arising from the use of this website will be subject to the exclusive
          jurisdiction of the courts in Amsterdam.
        </p>
      </LegalSection>
    </LegalPage>
  );
}