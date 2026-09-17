import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, Routes, Route } from 'react-router';
import { Layout } from './app/components/Layout';
import { Home } from './app/pages/Home';
import { Work } from './app/pages/Work';
import { About } from './app/pages/About';
import { Contact } from './app/pages/Contact';
import { PrivacyPolicy } from './app/pages/PrivacyPolicy';

/** Build-time rendering: the same visible regional components as the browser. */
export function renderRegionalPage(pathname: string) {
  return renderToString(
    <StaticRouter location={pathname}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/cw" element={<Home />} />
          <Route path="/cw/work" element={<Work />} />
          <Route path="/cw/about" element={<About />} />
          <Route path="/cw/contact" element={<Contact />} />
          <Route path="/cw/privacy-policy" element={<PrivacyPolicy />} />
        </Route>
      </Routes>
    </StaticRouter>,
  );
}
