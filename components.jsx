// components.jsx — shared UI primitives for the ABTG Trading dashboard.
const { useState, useEffect, useRef } = React;

// ── Brand wordmark (text-based, on-brand) ────────────────────────────
function Wordmark() {
  return (
    <div className="wordmark">
      <span className="wm-mark" aria-hidden="true" />
      <span className="wm-text">
        <strong>ALFIO BARDOLLA</strong>
        <em>TRAINING GROUP</em>
      </span>
    </div>
  );
}

// ── Minimal geometric icons (kept simple on purpose) ─────────────────
function Glyph({ type, color = 'currentColor', size = 18 }) {
  const s = { width: size, height: size, display: 'block' };
  switch (type) {
    case 'play':
      return (<svg viewBox="0 0 24 24" style={s}><path d="M8 5l11 7-11 7z" fill={color} /></svg>);
    case 'check':
      return (<svg viewBox="0 0 24 24" style={s}><path d="M4 12l5 5L20 6" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>);
    case 'warning':
      return (<svg viewBox="0 0 24 24" style={s}><path d="M12 3l10 18H2z" fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" /><path d="M12 9v5" stroke={color} strokeWidth="2.2" strokeLinecap="round" /><circle cx="12" cy="17.6" r="1.2" fill={color} /></svg>);
    case 'dot':
      return (<svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="5" fill={color} /></svg>);
    case 'diamond':
      return (<svg viewBox="0 0 24 24" style={s}><path d="M12 3l9 9-9 9-9-9z" fill={color} /></svg>);
    case 'flag':
      return (<svg viewBox="0 0 24 24" style={s}><path d="M6 3v18" stroke={color} strokeWidth="2.2" strokeLinecap="round" /><path d="M6 4h11l-2.5 4L17 12H6z" fill={color} /></svg>);
    case 'cal':
      return (<svg viewBox="0 0 24 24" style={s}><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke={color} strokeWidth="2" /><path d="M3 9h18M8 3v4M16 3v4" stroke={color} strokeWidth="2" strokeLinecap="round" /></svg>);
    case 'route':
      return (<svg viewBox="0 0 24 24" style={s}><circle cx="6" cy="6" r="2.6" fill="none" stroke={color} strokeWidth="2" /><circle cx="18" cy="18" r="2.6" fill="none" stroke={color} strokeWidth="2" /><path d="M6 8.6v4a4 4 0 004 4h4" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" /></svg>);
    case 'arrow':
      return (<svg viewBox="0 0 24 24" style={s}><path d="M12 4v16M6 14l6 6 6-6" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>);
    default:
      return null;
  }
}

// ── Vertical connector with arrowhead ────────────────────────────────
function Connector({ active, color = '#C9CCD6' }) {
  return (
    <div className={'connector' + (active ? ' is-active' : '')} aria-hidden="true">
      <span className="conn-line" style={active ? { background: color } : null} />
      <span className="conn-head" style={active ? { borderTopColor: color } : null} />
    </div>
  );
}

// ── Path filter pill ─────────────────────────────────────────────────
function PathPill({ path, active, onClick }) {
  return (
    <button
      className={'pill' + (active ? ' is-active' : '')}
      onClick={onClick}
      style={active ? { '--pc': path.color, '--ps': path.soft } : { '--pc': path.color }}
    >
      <span className="pill-dot" style={{ background: path.color }} />
      {path.label}
      {path.warning && <span className="pill-warn">in sospeso</span>}
    </button>
  );
}

Object.assign(window, { Wordmark, Glyph, Connector, PathPill });
