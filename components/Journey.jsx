'use client';
import { useState } from 'react';
import { BRAND, PATHS } from '@/lib/brand';
import { useContentRoot } from './ContentProvider';
import { EditableText } from './EditableText';
import { Glyph, Connector } from './Shared';

function NodeCard({ node, path, expanded, onToggle, dim, lit, accentColor }) {
  const acc = accentColor || (node.accent ? PATHS[node.accent].color : BRAND.onyx);
  return (
    <div
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

  const tourStops = [...shared.map((s) => s.id), 'trading', 'immobili'];
  const litId = tour ? tourStops[step] : null;
  const tint = (spec) => `color-mix(in srgb, ${spec.color} 4%, #fff)`;
  const dimOf = (spec) => tour && litId !== spec.id;
  const litOf = (spec) => tour && litId === spec.id;

  const showBranch = (b) => filter === 'all' || filter === b.path;
  const fadeBranch = (b) => filter !== 'all' && filter !== b.path;

  const Banner = (spec) => (
    <>
      <div className="track-banner" style={{ background: spec.color }}>
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
  const BranchStageHorizontal = (spec) => (
    <>
      <div className={'track-branches-horizontal' + (spec.id === 'immobili' ? ' immobili' : '')}>
        {spec.branches.map((b, i) => (
          <BranchColumn key={b.path} branch={b} path={[spec.branchesPath, i]} visible={showBranch(b)} faded={fadeBranch(b)} />
        ))}
      </div>
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
      <p className="camp-summary"><EditableText path={[spec.tailPath, 'summary']} /></p>
      <div className="camp-tags">
        {spec.tail.details.map((d, i) => <span key={i}><EditableText path={[spec.tailPath, 'details', i]} /></span>)}
      </div>
      <div className="camp-outcome"><Glyph type="arrow" size={14} color="#fff" /><EditableText path={[spec.tailPath, 'outcome']} /></div>
    </div>
  );

  return (
    <div className="journey">
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
            />
            <Connector active />
          </Fragment>
        ))}

        <div className="fork-label"><span>Due percorsi paralleli</span></div>

        <div className="tracks-grid">
          <Cell tint={tint(trading)} top dim={dimOf(trading)} lit={litOf(trading)}>{Banner(trading)}</Cell>
          <Cell tint={tint(immobili)} top dim={dimOf(immobili)} lit={litOf(immobili)}>{Banner(immobili)}</Cell>

          <Cell tint={tint(trading)} dim={dimOf(trading)}>{NodeStage(trading.spine[0], [trading.spinePath, 0])}</Cell>
          <Cell tint={tint(immobili)} dim={dimOf(immobili)}>{NodeStage(immobili.spine[0], [immobili.spinePath, 0])}</Cell>

          <Cell tint={tint(trading)} dim={dimOf(trading)}>{NodeStage(trading.spine[1], [trading.spinePath, 1])}</Cell>
          <Cell tint={tint(immobili)} dim={dimOf(immobili)}>{NodeStage(immobili.spine[1], [immobili.spinePath, 1])}</Cell>

          <Cell tint={tint(trading)} dim={dimOf(trading)}>{ForkStage()}</Cell>
          <Cell tint={tint(immobili)} dim={dimOf(immobili)}>{ForkStage()}</Cell>

          <Cell tint={tint(trading)} dim={dimOf(trading)}>{BranchStageHorizontal(trading)}</Cell>
          <Cell tint={tint(immobili)} dim={dimOf(immobili)}>{BranchStageHorizontal(immobili)}</Cell>

          <Cell tint={tint(trading)} dim={dimOf(trading)}>
            {CampStage(trading)}
            <Connector active />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', width: 'calc(100% + 64px)', marginLeft: '-32px', marginRight: '-32px', paddingLeft: '32px', paddingRight: '32px', alignItems: 'center' }}>
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
        </div>
      </div>
    </div>
  );
}
