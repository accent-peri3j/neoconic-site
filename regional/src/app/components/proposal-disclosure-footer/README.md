# ProposalDisclosureFooter

Self-contained Neoconic proposal disclosure footer.

## Copy Into Another React Project

Copy this folder:

```txt
proposal-disclosure-footer/
  ProposalDisclosureFooter.tsx
  index.ts
```

Then render it below that project's existing footer:

```tsx
import { ProposalDisclosureFooter } from "./proposal-disclosure-footer";

export function PageLayout() {
  return (
    <>
      <main>{/* page content */}</main>
      <ClientFooter />
      <ProposalDisclosureFooter />
    </>
  );
}
```

## With A Logo

You do not need to pass a logo. The component includes a built-in Neoconic SVG
wordmark by default.

To override it:

```tsx
<ProposalDisclosureFooter
  logo={<YourNeoconicLogo />}
/>
```

## Common Overrides

```tsx
<ProposalDisclosureFooter
  email="hello@neoconic.com"
  siteUrl="https://neoconic.com"
  legalLinks={[
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms", href: "/terms" },
    { label: "Disclaimer", href: "/disclaimer" },
  ]}
/>
```

The component uses plain `<a>` tags, owns its CSS, and does not require Tailwind,
React Router, lucide-react, or the Neoconic website CSS.

It also injects Satoshi from Fontshare into the page head. If the target site
blocks external font CSS, the footer falls back to system sans-serif.

The Neoconic red and white wordmark colors are locked inside the component so a
client site's brand CSS does not recolor the disclosure.
