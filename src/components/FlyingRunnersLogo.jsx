export default function FlyingRunnersLogo({ size = 'md', dark = false }) {
  const isLg = size === 'lg';
  const isSm = size === 'sm';

  const textSize = isLg ? 28 : isSm ? 14 : 20;
  const wingSize = isLg ? 48 : isSm ? 22 : 34;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: isSm ? 6 : 10 }}>
      {/* Butterfly wing SVG */}
      <svg width={wingSize} height={wingSize} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Upper wing */}
        <ellipse cx="35" cy="30" rx="32" ry="22" fill="#e91e8c" transform="rotate(-20 35 30)" opacity="0.95"/>
        <ellipse cx="33" cy="28" rx="20" ry="13" fill="#f06eb5" transform="rotate(-20 33 28)" opacity="0.7"/>
        {/* Lower wing */}
        <ellipse cx="38" cy="68" rx="24" ry="16" fill="#e91e8c" transform="rotate(15 38 68)" opacity="0.9"/>
        <ellipse cx="37" cy="67" rx="14" ry="9" fill="#f06eb5" transform="rotate(15 37 67)" opacity="0.6"/>
        {/* Body */}
        <ellipse cx="62" cy="50" rx="5" ry="22" fill="#c2185b" rx="4"/>
        {/* Antennae */}
        <line x1="62" y1="28" x2="52" y2="10" stroke="#c2185b" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="52" cy="10" r="3" fill="#c2185b"/>
        <line x1="65" y1="28" x2="72" y2="10" stroke="#c2185b" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="72" cy="10" r="3" fill="#c2185b"/>
      </svg>

      {/* Text */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{
          fontSize: textSize,
          fontWeight: 900,
          color: dark ? '#111' : '#ffffff',
          letterSpacing: isSm ? 1 : 2,
          textTransform: 'uppercase',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}>
          FLYING
        </span>
        <span style={{
          fontSize: textSize,
          fontWeight: 900,
          color: dark ? '#111' : '#ffffff',
          letterSpacing: isSm ? 1 : 2,
          textTransform: 'uppercase',
          fontFamily: "'Inter', system-ui, sans-serif",
          marginTop: -2,
        }}>
          RUNNERS
        </span>
      </div>
    </div>
  );
}
