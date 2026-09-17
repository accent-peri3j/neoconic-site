import { Navigate, useLocation } from 'react-router';

/** Preserve earlier review links, including project anchors and campaign tags. */
export function LegacyCuracaoRedirect() {
  const { pathname, search, hash } = useLocation();
  return <Navigate replace to={`/cw${pathname.slice('/curacao'.length)}${search}${hash}`} />;
}
