import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Work } from "./pages/Work";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { Terms } from "./pages/Terms";
import { Disclaimer } from "./pages/Disclaimer";
import { NotFound } from "./pages/NotFound";
import { LegacyCuracaoRedirect } from "./components/LegacyCuracaoRedirect";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "cw", Component: Home },
      { path: "cw/work", Component: Work },
      { path: "cw/about", Component: About },
      { path: "cw/contact", Component: Contact },
      { path: "cw/privacy-policy", Component: PrivacyPolicy },
      { path: "curacao", Component: LegacyCuracaoRedirect },
      { path: "curacao/*", Component: LegacyCuracaoRedirect },
      { path: "work", Component: Work },
      { path: "about", Component: About },
      { path: "contact", Component: Contact },
      { path: "privacy-policy", Component: PrivacyPolicy },
      { path: "terms", Component: Terms },
      { path: "disclaimer", Component: Disclaimer },
      { path: "*", Component: NotFound },
    ],
  },
]);
