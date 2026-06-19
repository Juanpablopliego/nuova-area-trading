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
        <h4>{branch.title}</h4>
      </div>
      <div className="branch-steps">
        {branch.steps.map((s, i) => (
          <React.Fragment key={i}>
            <div className={'bstep' + (i === 0 ? ' feature' : '') + (s.struck ? ' struck' : '') + (s.hypothesis ? ' hyp' : '')}>
              <div className="bstep-row">
                <div className="bstep-num" style={{ background: s.struck ? '#C9CCD6' : p.color }}>{i + 1}</div>
                <div className="bstep-txt">
                  <strong>{s.title}{s.hypothesis && <em className="hyp-tag">ipotesi</em>}{s.struck && <em className="struck-tag">{s.strikeTag || 'da valutare'}</em>}</strong>
                  <span>{s.detail}</span>
                </div>
              </div>
            </div>
            {i < branch.steps.length - 1 && <Connector active color={p.color} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function Cell({ children, tint, top, bot, dim, lit }) {
  return (
    <div
      className={'tcell' + (top ? ' top' : '') + (bot ? ' bot' : '') + (dim ? ' is-dim' : '') + (lit ? ' is-lit' : '')}
      style={tint ? { background: tint } : null}
    >
      {children}
    </div>
  );
}

function JourneyView({ filter }) {
  const [tour, setTour] = useStateJ(false);
  const [step, setStep] = useStateJ(0);

  const shared = window.SPINE_SHARED;
  const trading = {
    id: 'trading', label: 'Percorso Trading', tagline: 'Forex → mercati', color: window.BRAND.saffron, diamond: window.BRAND.saffron,
    spine: window.SPINE_TRADING, branches: window.BRANCHES, tail: window.CAMP, addons: ['Formazione AI', 'Crea il mio Expert'],
  };
  const immobili = {
    id: 'immobili', label: 'Percorso Immobili', tagline: 'Flipping · Aste · Rent', color: window.PATHS.aste.color, diamond: window.PATHS.aste.color,
    spine: window.SPINE_IMMOBILI, branches: window.BRANCHES_IMMOBILI, tail: window.RICORRENTI,
  };

  const tourStops = [...shared.map(s => s.id), 'trading', 'immobili'];
  const litId = tour ? tourStops[step] : null;
  const tint = (spec) => `color-mix(in srgb, ${spec.color} 4%, #fff)`;
  const dimOf = (spec) => tour && litId !== spec.id;
  const litOf = (spec) => tour && litId === spec.id;

  const showBranch = (b) => filter === 'all' || filter === b.path;
  const fadeBranch = (b) => filter !== 'all' && filter !== b.path;

  const Banner = (spec) => (
    <React.Fragment>
      <div className="track-banner" style={{ background: spec.color }}>
        <Glyph type="route" size={15} color="#fff" />
        <strong>{spec.label}</strong>
        <span>{spec.tagline}</span>
      </div>
      <Connector active />
    </React.Fragment>
  );
  const NodeStage = (node) => (
    <React.Fragment>
      <NodeCard node={node} expanded={true} onToggle={() => {}} />
      <Connector active />
    </React.Fragment>
  );
  const ForkStage = () => (
    <div className="fork-label track-fork"><span>Biforcazione — secondo l’Assessment</span></div>
  );
  const BranchStage = (spec) => (
    <React.Fragment>
      <div className="track-branches">
        {spec.branches.map((b) => (
          <BranchColumn key={b.path} branch={b} visible={showBranch(b)} faded={fadeBranch(b)} />
        ))}
      </div>
      <Connector active />
    </React.Fragment>
  );
  const BranchStageHorizontal = (spec) => (
    <React.Fragment>
      <div className={'track-branches-horizontal' + (spec.id === 'immobili' ? ' immobili' : '')}>
        {spec.branches.map((b) => (
          <BranchColumn key={b.path} branch={b} visible={showBranch(b)} faded={fadeBranch(b)} />
        ))}
      </div>
      <Connector active />
    </React.Fragment>
  );
  const CampStage = (spec) => (
    <div className="camp">
      <div className="camp-head">
        <Glyph type="diamond" size={18} color={spec.diamond} />
        <div>
          <h3>{spec.tail.title}</h3>
          <p>{spec.tail.sub}</p>
        </div>
      </div>
      <p className="camp-summary">{spec.tail.summary}</p>
      <div className="camp-tags">
        {spec.tail.details.map((d, i) => <span key={i}>{d}</span>)}
      </div>
      <div className="camp-outcome"><Glyph type="arrow" size={14} color="#fff" />{spec.tail.outcome}</div>
    </div>
  );
  const AddonStage = (spec) => (
    <React.Fragment>
      <Connector active />
      <div className="addons track-addons">
        {spec.addons.map((a, i) => (
          <div className="addon" key={i}>
            <span className="addon-icon"><Glyph type="diamond" size={16} color={i === 0 ? window.BRAND.jade : window.BRAND.saffron} /></span>
            <h4>{a}</h4>
          </div>
        ))}
      </div>
    </React.Fragment>
  );

  return (
    <div className="journey">
      <div className="journey-spine">
        {/* Shared entry */}
        {shared.map((node) => (
          <React.Fragment key={node.id}>
            <NodeCard
              node={node}
              expanded={true}
              onToggle={() => {}}
              dim={tour && litId !== node.id}
              lit={tour && litId === node.id}
            />
            <Connector active />
          </React.Fragment>
        ))}

        <div className="fork-label"><span>Due percorsi paralleli</span></div>

        {/* Paired-row grid: each stage aligns across both tracks */}
        <div className="tracks-grid">
          {/* Banners */}
          <Cell tint={tint(trading)} top dim={dimOf(trading)} lit={litOf(trading)}>{Banner(trading)}</Cell>
          <Cell tint={tint(immobili)} top dim={dimOf(immobili)} lit={litOf(immobili)}>{Banner(immobili)}</Cell>
          {/* Starter */}
          <Cell tint={tint(trading)} dim={dimOf(trading)}>{NodeStage(trading.spine[0])}</Cell>
          <Cell tint={tint(immobili)} dim={dimOf(immobili)}>{NodeStage(immobili.spine[0])}</Cell>
          {/* Assessment */}
          <Cell tint={tint(trading)} dim={dimOf(trading)}>{NodeStage(trading.spine[1])}</Cell>
          <Cell tint={tint(immobili)} dim={dimOf(immobili)}>{NodeStage(immobili.spine[1])}</Cell>
          {/* Fork label */}
          <Cell tint={tint(trading)} dim={dimOf(trading)}>{ForkStage()}</Cell>
          <Cell tint={tint(immobili)} dim={dimOf(immobili)}>{ForkStage()}</Cell>
          {/* Branches — HORIZONTAL */}
          <Cell tint={tint(trading)} dim={dimOf(trading)}>{BranchStageHorizontal(trading)}</Cell>
          <Cell tint={tint(immobili)} dim={dimOf(immobili)}>{BranchStageHorizontal(immobili)}</Cell>
          {/* Camps — aligned row */}
          <Cell tint={tint(trading)} dim={dimOf(trading)}>
            {CampStage(trading)}
            <Connector active />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', width: 'calc(100% + 64px)', marginLeft: '-32px', marginRight: '-32px', paddingLeft: '32px', paddingRight: '32px', alignItems: 'center' }}>
              <div className="addon" style={{ textAlign: 'center' }}>
                <span className="addon-icon"><Glyph type="diamond" size={16} color={window.BRAND.saffron} /></span>
                <h4>Ricorrenti Trading</h4>
              </div>
              {trading.addons.map((a, i) => (
                <div className="addon" key={i} style={{ textAlign: 'center' }}>
                  <span className="addon-icon"><Glyph type="diamond" size={16} color={i === 0 ? window.BRAND.jade : window.BRAND.saffron} /></span>
                  <h4>{a}</h4>
                </div>
              ))}
            </div>
          </Cell>
          <Cell tint={tint(immobili)} bot dim={dimOf(immobili)}>
            {CampStage(immobili)}
            <Connector active />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="addon" style={{ textAlign: 'center', padding: '8px 12px' }}>
                <span className="addon-icon"><Glyph type="diamond" size={16} color={window.BRAND.saffron} /></span>
                <h4 style={{ marginTop: '4px', marginBottom: '0px' }}>Ricorrenti Immobili</h4>
              </div>
            </div>
          </Cell>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { JourneyView });
