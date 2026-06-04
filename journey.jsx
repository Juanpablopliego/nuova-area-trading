// journey.jsx — Customer Journey view: spine + branches + guided tour.
const { useState: useStateJ } = React;

function NodeCard({ node, expanded, onToggle, dim, lit, accentColor }) {
  const acc = accentColor || (node.accent ? window.PATHS[node.accent].color : window.BRAND.onyx);
  return (
    <div
      className={'node' + (node.highlight ? ' node-hi' : '') + (dim ? ' is-dim' : '') + (lit ? ' is-lit' : '')}
      style={{ '--acc': acc }}
      onClick={onToggle}
      role="button"
      tabIndex={0}
    >
      <div className="node-top">
        <span className="node-badge">{node.badge}</span>
        <div className="node-head">
          <h3>{node.title}</h3>
          {node.sub && <p className="node-sub">{node.sub}</p>}
        </div>
        <span className={'node-chev' + (expanded ? ' open' : '')} aria-hidden="true">+</span>
      </div>
      <p className="node-summary">{node.summary}</p>

      <div className={'node-body' + (expanded ? ' open' : '')}>
        <div className="node-body-inner">
          <ul className="node-list">
            {node.details.map((d, i) => (
              <li key={i}><Glyph type="dot" size={9} color={acc} /><span>{d}</span></li>
            ))}
          </ul>
          {node.extra && (
            <div className="node-extra" style={{ '--acc': acc }}>
              <strong>{node.extra.label}</strong>
              <span>{node.extra.value}</span>
            </div>
          )}
          {node.note && <p className="node-note"><Glyph type="flag" size={13} color={acc} />{node.note}</p>}
        </div>
      </div>
    </div>
  );
}

function BranchColumn({ branch, visible, faded }) {
  const p = window.PATHS[branch.path];
  return (
    <div className={'branch' + (faded ? ' is-faded' : '') + (branch.warning ? ' is-warn' : '')}
         style={{ '--pc': p.color, '--ps': p.soft, '--pi': p.ink, display: visible ? 'flex' : 'none' }}>
      <div className="branch-head">
        <span className="branch-tag" style={{ background: p.color }}>{p.label}</span>
        {branch.warning && <span className="branch-warnbadge"><Glyph type="warning" size={13} color={p.ink} />in sospeso</span>}
        <h4>{branch.title}</h4>
      </div>
      <div className="branch-steps">
        {branch.steps.map((s, i) => (
          <React.Fragment key={i}>
            <div className={'bstep' + (s.struck ? ' struck' : '') + (s.hypothesis ? ' hyp' : '')}>
              <div className="bstep-num" style={{ background: s.struck ? '#C9CCD6' : p.color }}>{i + 1}</div>
              <div className="bstep-txt">
                <strong>{s.title}{s.hypothesis && <em className="hyp-tag">ipotesi</em>}{s.struck && <em className="struck-tag">da valutare</em>}</strong>
                <span>{s.detail}</span>
              </div>
            </div>
            {i < branch.steps.length - 1 && <Connector active color={p.color} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function JourneyView({ filter }) {
  const [expanded, setExpanded] = useStateJ({ starter: true, assessment: true });
  const [tour, setTour] = useStateJ(false);
  const [step, setStep] = useStateJ(0);

  const spine = window.SPINE;
  const branches = window.BRANCHES;
  const camp = window.CAMP;

  // Tour steps: each spine node, then the fork, then camp
  const tourStops = [...spine.map(s => s.id), 'fork', 'camp'];
  const litId = tour ? tourStops[step] : null;

  const toggle = (id) => {
    if (tour) return;
    setExpanded(e => ({ ...e, [id]: !e[id] }));
  };

  const showBranch = (b) => filter === 'all' || filter === b.path;
  const fadeBranch = (b) => filter !== 'all' && filter !== b.path;

  return (
    <div className="journey">
      {/* Guided tour control */}
      <div className="tour-bar">
        <button className={'tour-toggle' + (tour ? ' on' : '')} onClick={() => { setTour(t => !t); setStep(0); }}>
          <Glyph type="route" size={16} color={tour ? '#fff' : window.BRAND.onyx} />
          {tour ? 'Tour guidato attivo' : 'Avvia tour guidato'}
        </button>
        {tour && (
          <div className="tour-nav">
            <button disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))}>‹ Indietro</button>
            <div className="tour-dots">
              {tourStops.map((_, i) => (
                <span key={i} className={'tdot' + (i === step ? ' on' : '') + (i < step ? ' done' : '')} onClick={() => setStep(i)} />
              ))}
            </div>
            <button disabled={step === tourStops.length - 1} onClick={() => setStep(s => Math.min(tourStops.length - 1, s + 1))}>Avanti ›</button>
          </div>
        )}
      </div>

      <div className="journey-spine">
        {spine.map((node, i) => (
          <React.Fragment key={node.id}>
            <NodeCard
              node={node}
              expanded={tour ? litId === node.id : !!expanded[node.id]}
              onToggle={() => toggle(node.id)}
              dim={tour && litId !== node.id}
              lit={tour && litId === node.id}
            />
            <Connector active />
          </React.Fragment>
        ))}

        {/* Fork label */}
        <div className={'fork-label' + (tour && litId === 'fork' ? ' is-lit' : '') + (tour && litId !== 'fork' ? ' is-dim' : '')}>
          <span>Biforcazione percorso — secondo l’Assessment</span>
        </div>

        {/* Branches */}
        <div className={'branches' + (tour && litId === 'fork' ? ' is-lit' : '') + (tour && litId !== 'fork' ? ' is-dim' : '')}>
          {branches.map((b) => (
            <BranchColumn key={b.path} branch={b} visible={showBranch(b)} faded={fadeBranch(b)} />
          ))}
        </div>

        <Connector active />

        {/* Trading Camp convergence */}
        <div className={'camp' + (tour && litId === 'camp' ? ' is-lit' : '') + (tour && litId !== 'camp' && tour ? ' is-dim' : '')}>
          <div className="camp-head">
            <Glyph type="diamond" size={18} color={window.BRAND.saffron} />
            <div>
              <h3>{camp.title}</h3>
              <p>{camp.sub}</p>
            </div>
          </div>
          <p className="camp-summary">{camp.summary}</p>
          <div className="camp-tags">
            {camp.details.map((d, i) => <span key={i}>{d}</span>)}
          </div>
          <div className="camp-outcome"><Glyph type="arrow" size={14} color="#fff" />{camp.outcome}</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { JourneyView });
