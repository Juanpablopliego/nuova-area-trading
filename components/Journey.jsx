'use client';
import { useState, useRef, useEffect } from 'react';
import { BRAND, PATHS } from '@/lib/brand';
import { useContentRoot } from './ContentProvider';
import { EditableText } from './EditableText';
import { Glyph, Connector } from './Shared';

function NodeCard({ node, path, expanded, onToggle, dim, lit, accentColor, domRef }) {
  const acc = accentColor || (node.accent ? PATHS[node.accent].color : BRAND.onyx);
  return (
    <div
      ref={domRef}
      className={'node' + (node.highlight ? ' node-hi' : '') + (dim ? ' is-dim' : '') + (lit ? ' is-lit' : '')}
      style={{ '--acc': acc }}
      onClick={onToggle}
      role="button"
      tabIndex={0}
    >
      <div className="node-top">
        <span className="node-badge"><EditableText path={[...path, 'badge']} /></span>
        <div className="node-head">
          <h3><EditableText path={[...path, 'title']} /></h3>
          {node.sub != null && <p className="node-sub"><EditableText path={[...path, 'sub']} /></p>}
        </div>
        <span className={'node-chev' + (expanded ? ' open' : '')} aria-hidden="true">+</span>
      </div>
      <p className="node-summary"><EditableText path={[...path, 'summary']} /></p>

      <div className={'node-body' + (expanded ? ' open' : '')}>
        <div className="node-body-inner">
          <ul className="node-list">
            {node.details.map((d, i) => (
              <li key={i}><Glyph type="dot" size={9} color={acc} /><span><EditableText path={[...path, 'details', i]} /></span></li>
            ))}
          </ul>
          {node.extra && (
            <div className="node-extra" style={{ '--acc': acc }}>
              <strong><EditableText path={[...path, 'extra', 'label']} /></strong>
              <span><EditableText path={[...path, 'extra', 'value']} /></span>
            </div>
          )}
          {node.bonus && (
            <div className="node-bonus">
              <span className="node-bonus-tag">BONUS</span>
              <Glyph type="diamond" size={13} color="#009C4E" />
              <strong><EditableText path={[...path, 'bonus', 'label']} /></strong>
              <span><EditableText path={[...path, 'bonus', 'value']} /></span>
            </div>
          )}
          {node.note && <p className="node-note"><Glyph type="flag" size={13} color={acc} /><EditableText path={[...path, 'note']} /></p>}
        </div>
      </div>
    </div>
  );
}

function BranchColumn({ branch, path, visible, faded }) {
  const p = PATHS[branch.path];
  return (
    <div className={'branch' + (faded ? ' is-faded' : '') + (branch.warning ? ' is-warn' : '')}
         style={{ '--pc': p.color, '--ps': p.soft, '--pi': p.ink, display: visible ? 'flex' : 'none' }}>
      <div className="branch-head">
        <span className="branch-tag" style={{ background: p.color }}>{p.label}</span>
        <h4><EditableText path={[...path, 'title']} /></h4>
      </div>
      <div className="branch-steps">
        {branch.steps.map((s, i) => (
          <Fragment key={i}>
            <div className={'bstep' + (i === 0 ? ' feature' : '') + (s.struck ? ' struck' : '') + (s.hypothesis ? ' hyp' : '')}>
              <div className="bstep-row">
                <div className="bstep-num" style={{ background: s.struck ? '#C9CCD6' : p.color }}>{i + 1}</div>
                <div className="bstep-txt">
                  <strong>
                    <EditableText path={[...path, 'steps', i, 'title']} />
                    {s.hypothesis && <em className="hyp-tag">ipotesi</em>}
                    {s.struck && <em className="struck-tag">{s.strikeTag || 'da valutare'}</em>}
                  </strong>
                  <span><EditableText path={[...path, 'steps', i, 'detail']} /></span>
                </div>
              </div>
            </div>
            {i < branch.steps.length - 1 && <Connector active color={p.color} />}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function Fragment({ children }) {
  return <>{children}</>;
}

// Edge fades + arrow buttons hint that the row scrolls — a plain overflow:auto
// row gives no visual sign there's more content, especially since OS-level
// "hide scrollbar until hover" settings can make the (now always-visible,
// see .track-branches-horizontal::-webkit-scrollbar) bar easy to miss too.
function ScrollFadeRow({ className, fadeColor, children }) {
  const ref = useRef(null);
  const [edge, setEdge] = useState({ left: false, right: false });

  const update = () => {
    const el = ref.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setEdge({
      left: scrollLeft > 4,
      right: scrollLeft < scrollWidth - clientWidth - 4,
    });
  };

  const nudge = (dir) => {
    ref.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });
  };

  useEffect(() => { update(); }, [children]);

  return (
    <div className="scrollfade-wrap" style={{ '--fade': fadeColor }}>
      <div ref={ref} className={className} onScroll={update}>
        {children}
      </div>
      {edge.left && <div className="scrollfade scrollfade-left" />}
      {edge.right && <div className="scrollfade scrollfade-right" />}
      {edge.left && (
        <button type="button" className="scrollnav scrollnav-left" aria-label="Scorri a sinistra" onClick={() => nudge(-1)}>‹</button>
      )}
      {edge.right && (
        <button type="button" className="scrollnav scrollnav-right" aria-label="Scorri a destra" onClick={() => nudge(1)}>›</button>
      )}
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

export function JourneyView({ filter }) {
  const content = useContentRoot();
  const [tour, setTour] = useState(false);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [proposalImmobili, setProposalImmobili] = useState(1);
  const stopRefs = useRef({});
  const setStopRef = (id) => (el) => { stopRefs.current[id] = el; };
  // window.scrollTo (not scrollIntoView) so the jump only ever moves the
  // vertical axis — some sections bleed past the viewport horizontally via
  // negative-margin "edge to edge" rows, and scrollIntoView's own inline
  // axis heuristic would otherwise drag the page sideways into that bleed.
  const scrollToStop = (id) => {
    const el = stopRefs.current[id];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const targetY = window.scrollY + rect.top - (window.innerHeight / 2 - rect.height / 2);
    window.scrollTo({ top: Math.max(0, targetY), left: 0, behavior: 'smooth' });
  };

  const shared = content.SPINE_SHARED;
  const trading = {
    id: 'trading', label: 'Percorso Trading', tagline: 'Forex → mercati', color: BRAND.saffron, diamond: BRAND.saffron,
    spine: content.SPINE_TRADING, spinePath: 'SPINE_TRADING', branches: content.BRANCHES, branchesPath: 'BRANCHES',
    tail: content.CAMP, tailPath: 'CAMP', addons: ['Formazione AI', 'Crea il mio Expert'],
  };
  const immobili = {
    id: 'immobili', label: 'Percorso Immobili', tagline: 'Flipping · Aste · Rent', color: PATHS.aste.color, diamond: PATHS.aste.color,
    spine: content.SPINE_IMMOBILI, spinePath: 'SPINE_IMMOBILI', branches: content.BRANCHES_IMMOBILI, branchesPath: 'BRANCHES_IMMOBILI',
    tail: content.RICORRENTI, tailPath: 'RICORRENTI',
  };
  const mindset = {
    id: 'mindset', label: 'Percorso Mindset', tagline: 'Money mindset → libertà', color: '#0EA5A4', diamond: '#0EA5A4',
    spine: content.SPINE_MINDSET, spinePath: 'SPINE_MINDSET', branches: content.BRANCHES_MINDSET, branchesPath: 'BRANCHES_MINDSET',
    tail: content.FUTURE_CAMP, tailPath: 'FUTURE_CAMP',
  };

  const tourStops = [...shared.map((s) => s.id), 'trading', 'immobili', 'mindset'];
  const stopLabels = [...shared.map((s) => s.title), trading.label, immobili.label, mindset.label];
  const litId = tour ? tourStops[step] : null;
  const tint = (spec) => `color-mix(in srgb, ${spec.color} 4%, #fff)`;
  const dimOf = (spec) => tour && litId !== spec.id;
  const litOf = (spec) => tour && litId === spec.id;

  const goToStep = (i) => {
    const clamped = Math.max(0, Math.min(tourStops.length - 1, i));
    setPlaying(false);
    setTour(true);
    setStep(clamped);
    scrollToStop(tourStops[clamped]);
  };
  const togglePlay = () => {
    if (playing) { setPlaying(false); return; }
    const startStep = tour ? step : 0;
    setTour(true);
    setStep(startStep);
    scrollToStop(tourStops[startStep]);
    setPlaying(true);
  };
  const exitFocus = () => { setTour(false); setPlaying(false); };

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setStep((s) => {
        const next = s + 1;
        if (next >= tourStops.length) { setPlaying(false); return s; }
        scrollToStop(tourStops[next]);
        return next;
      });
    }, 2600);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const showBranch = (b) => filter === 'all' || filter === b.path;
  const fadeBranch = (b) => filter !== 'all' && filter !== b.path;

  const Banner = (spec, domRef) => (
    <>
      <div ref={domRef} className="track-banner" style={{ background: spec.color }}>
        <Glyph type="route" size={15} color="#fff" />
        <strong>{spec.label}</strong>
        <span>{spec.tagline}</span>
      </div>
      <Connector active />
    </>
  );
  const NodeStage = (node, path) => (
    <>
      <NodeCard node={node} path={path} expanded={true} onToggle={() => {}} />
      <Connector active />
    </>
  );
  const ForkStage = () => (
    <div className="fork-label track-fork"><span>Biforcazione — secondo l'Assessment</span></div>
  );
  const ProposalToggle = () => (
    <div className="proposal-toggle">
      <button
        type="button"
        className={'proposal-btn' + (proposalImmobili === 1 ? ' active' : '')}
        style={{ '--ptc': immobili.color }}
        onClick={() => setProposalImmobili(1)}
      >Proposta 1</button>
      <button
        type="button"
        className={'proposal-btn' + (proposalImmobili === 2 ? ' active' : '')}
        style={{ '--ptc': immobili.color }}
        onClick={() => setProposalImmobili(2)}
      >Proposta 2</button>
    </div>
  );
  const BranchStageHorizontal = (spec) => (
    <>
      <ScrollFadeRow
        className={'track-branches-horizontal' + (spec.id === 'immobili' ? ' immobili' : '')}
        fadeColor={tint(spec)}
      >
        {spec.branches.map((b, i) => (
          <BranchColumn key={b.path} branch={b} path={[spec.branchesPath, i]} visible={showBranch(b)} faded={fadeBranch(b)} />
        ))}
      </ScrollFadeRow>
      <Connector active />
    </>
  );
  const CampStage = (spec) => (
    <div className="camp">
      <div className="camp-head">
        <Glyph type="diamond" size={18} color={spec.diamond} />
        <div>
          <h3><EditableText path={[spec.tailPath, 'title']} /></h3>
          <p><EditableText path={[spec.tailPath, 'sub']} /></p>
        </div>
      </div>
      {spec.tail.summary && <p className="camp-summary"><EditableText path={[spec.tailPath, 'summary']} /></p>}
      {spec.tail.details.length > 0 && (
        <div className="camp-tags">
          {spec.tail.details.map((d, i) => <span key={i}><EditableText path={[spec.tailPath, 'details', i]} /></span>)}
        </div>
      )}
      {spec.tail.outcome && (
        <div className="camp-outcome"><Glyph type="arrow" size={14} color="#fff" /><EditableText path={[spec.tailPath, 'outcome']} /></div>
      )}
    </div>
  );

  return (
    <div className="journey">
      <div className="tour-bar">
        <div className="tour-row">
          <button type="button" className={'tour-toggle' + (playing ? ' on' : '')} onClick={togglePlay}>
            {playing
              ? <span className="tour-pause-icon" aria-hidden="true">❚❚</span>
              : <Glyph type="play" size={13} color="currentColor" />}
            {playing ? 'Pausa' : 'Tour guidato'}
          </button>
          <div className="tour-nav">
            <button type="button" onClick={() => goToStep(step - 1)} disabled={!tour || step === 0}>← Indietro</button>
            <div className="tour-dots">
              {tourStops.map((id, i) => (
                <span
                  key={id}
                  className={'tdot' + (tour && i === step ? ' on' : '') + (tour && i < step ? ' done' : '')}
                  title={stopLabels[i]}
                  onClick={() => goToStep(i)}
                  role="button"
                  tabIndex={0}
                />
              ))}
            </div>
            <button type="button" onClick={() => goToStep(step + 1)} disabled={!tour || step === tourStops.length - 1}>Avanti →</button>
          </div>
          {tour && <button type="button" className="tour-exit" onClick={exitFocus}>✕ Vedi tutto</button>}
        </div>
      </div>

      <div className="journey-spine">
        {shared.map((node, i) => (
          <Fragment key={node.id}>
            <NodeCard
              node={node}
              path={['SPINE_SHARED', i]}
              expanded={true}
              onToggle={() => {}}
              dim={tour && litId !== node.id}
              lit={tour && litId === node.id}
              domRef={setStopRef(node.id)}
            />
            <Connector active />
          </Fragment>
        ))}

        <div className="fork-label"><span>Tre percorsi paralleli</span></div>

        <div className="tracks-grid">
          <Cell tint={tint(trading)} top dim={dimOf(trading)} lit={litOf(trading)}>{Banner(trading, setStopRef('trading'))}</Cell>
          <Cell tint={tint(immobili)} top dim={dimOf(immobili)} lit={litOf(immobili)}>{Banner(immobili, setStopRef('immobili'))}</Cell>
          <Cell tint={tint(mindset)} top dim={dimOf(mindset)} lit={litOf(mindset)}>{Banner(mindset, setStopRef('mindset'))}</Cell>

          <Cell tint={tint(trading)} dim={dimOf(trading)}>{NodeStage(trading.spine[0], [trading.spinePath, 0])}</Cell>
          <Cell tint={tint(immobili)} dim={dimOf(immobili)}>
            {ProposalToggle()}
            <Fragment key={proposalImmobili}>
              {proposalImmobili === 1
                ? NodeStage(content.SPINE_IMMOBILI[0], ['SPINE_IMMOBILI', 0])
                : NodeStage(content.SPINE_IMMOBILI_P2[0], ['SPINE_IMMOBILI_P2', 0])}
            </Fragment>
          </Cell>
          <Cell tint={tint(mindset)} dim={dimOf(mindset)}>{NodeStage(mindset.spine[0], [mindset.spinePath, 0])}</Cell>

          <Cell tint={tint(trading)} dim={dimOf(trading)}>{NodeStage(trading.spine[1], [trading.spinePath, 1])}</Cell>
          <Cell tint={tint(immobili)} dim={dimOf(immobili)}>{NodeStage(immobili.spine[1], [immobili.spinePath, 1])}</Cell>
          <Cell tint={tint(mindset)} dim={dimOf(mindset)} />

          <Cell tint={tint(trading)} dim={dimOf(trading)}>{ForkStage()}</Cell>
          <Cell tint={tint(immobili)} dim={dimOf(immobili)}>{ForkStage()}</Cell>
          <Cell tint={tint(mindset)} dim={dimOf(mindset)}>{ForkStage()}</Cell>

          <Cell tint={tint(trading)} dim={dimOf(trading)}>{BranchStageHorizontal(trading)}</Cell>
          <Cell tint={tint(immobili)} dim={dimOf(immobili)}>{BranchStageHorizontal(immobili)}</Cell>
          <Cell tint={tint(mindset)} dim={dimOf(mindset)}>{BranchStageHorizontal(mindset)}</Cell>

          <Cell tint={tint(trading)} dim={dimOf(trading)}>
            {CampStage(trading)}
            <Connector active />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', alignItems: 'center' }}>
              <div className="addon" style={{ textAlign: 'center' }}>
                <span className="addon-icon"><Glyph type="diamond" size={16} color={BRAND.saffron} /></span>
                <h4>Ricorrenti Trading</h4>
              </div>
              {trading.addons.map((a, i) => (
                <div className="addon" key={i} style={{ textAlign: 'center' }}>
                  <span className="addon-icon"><Glyph type="diamond" size={16} color={i === 0 ? BRAND.jade : BRAND.saffron} /></span>
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
                <span className="addon-icon"><Glyph type="diamond" size={16} color={BRAND.saffron} /></span>
                <h4 style={{ marginTop: '4px', marginBottom: '0px' }}>Ricorrenti Immobili</h4>
              </div>
            </div>
          </Cell>
          <Cell tint={tint(mindset)} bot dim={dimOf(mindset)}>{CampStage(mindset)}</Cell>
        </div>
      </div>
    </div>
  );
}
