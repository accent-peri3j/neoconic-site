import './region-switch.css';

/** Only rendered within Curaçao navigation; global navigation stays unchanged. */
export function RegionSwitch({ isDark, mobile = false }: { isDark: boolean; mobile?: boolean }) {
  return (
    <div
      className={`cw-region-switch${mobile ? ' cw-region-switch-mobile' : ''}`}
      data-theme={isDark ? 'dark' : 'light'}
      role="group"
      aria-label="Website region"
    >
      <a href="/?region=global">Global</a>
      <span className="cw-region-divider" aria-hidden="true">/</span>
      <span className="cw-region-current" aria-current="true">Curaçao</span>
    </div>
  );
}
