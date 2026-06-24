'use client';
import { useState } from 'react';
import { BRAND, PATHS } from '@/lib/brand';
import { useContentRoot } from './ContentProvider';
import { EditableText } from './EditableText';
import { Glyph, Wordmark } from './Shared';
import { JourneyView } from './Journey';
import { CalendarView } from './CalendarView';
import { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakToggle, TweakSlider } from './TweaksPanel';

const TWEAK_DEFAULTS = {
  cardStyle: 'morbido',
  density: 'regular',
  accentLead: 'saffron',
  showDecisions: true,
  fontScale: 100,
};

function DecisionCard({ d, path }) {
  const warn = d.status === 'warning';
  return (
    <div className={'dcard' + (warn ? ' warn' : '')}>
      <div className="dcard-head">
        <span className={'dcard-icon' + (warn ? ' warn' : '')}>
          <Glyph type={warn ? 'warning' : 'check'} size={15} color="#fff" />
        </span>
        <h4><EditableText path={[...path, 'title']} /></h4>
      </div>
      <ul>
        {d.points.map((p, i) => <li key={i}><EditableText path={[...path, 'points', i]} /></li>)}
      </ul>
    </div>
  );
}

export function App() {
  const content = useContentRoot();
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [view, setView] = useState('journey');
  const [filter] = useState('all');
  const [decisionsOpen, setDecisionsOpen] = useState(false);

  const lead = PATHS[t.accentLead] ? BRAND[t.accentLead] : BRAND.saffron;

  return (
    <div
      className="app"
      data-cardstyle={t.cardStyle}
      data-density={t.density}
      style={{ '--lead': lead, fontSize: t.fontScale / 100 + 'rem' }}
    >
      <header className="topbar">
        <Wordmark />
        <div className="topbar-title">
          <h1>Nuova Area Formazione</h1>
          <p>Lead → Wake Up Call → due aree: Trading &amp; Immobili</p>
        </div>
        <div className="viewtoggle">
          <button className={view === 'journey' ? 'on' : ''} onClick={() => setView('journey')}>
            <Glyph type="route" size={15} color={view === 'journey' ? '#fff' : BRAND.onyx} />Journey
          </button>
          <button className={view === 'calendar' ? 'on' : ''} onClick={() => setView('calendar')}>
            <Glyph type="cal" size={15} color={view === 'calendar' ? '#fff' : BRAND.onyx} />Calendario
          </button>
        </div>
      </header>

      <div className="filterbar">
        <button className="decisions-toggle" onClick={() => setDecisionsOpen(!decisionsOpen)}>
          <Glyph type="flag" size={15} color={BRAND.saffron} />
          <span>Decisioni della call</span>
          <span className={'toggle-chevron' + (decisionsOpen ? ' open' : '')}>‣</span>
        </button>
        <span className="filter-hint">{view === 'journey' ? 'Clicca un box per i dettagli' : 'Clicca un evento per i dettagli'}</span>
      </div>

      <div className={'layout' + (decisionsOpen ? '' : ' no-rail')}>
        <main className="stage">
          {view === 'journey' ? <JourneyView filter={filter} /> : <CalendarView filter={filter} />}
        </main>

        {decisionsOpen && (
          <aside className="rail expanded">
            <div className="rail-head">
              <h2>Decisioni della call</h2>
              <button className="rail-close" onClick={() => setDecisionsOpen(false)}>✕</button>
            </div>
            {content.DECISIONS.map((d, i) => <DecisionCard key={d.id} d={d} path={['DECISIONS', i]} />)}
          </aside>
        )}
      </div>

      <TweaksPanel>
        <TweakSection label="Stile" />
        <TweakRadio label="Card" value={t.cardStyle}
          options={['morbido', 'deciso', 'essenziale']}
          onChange={(v) => setTweak('cardStyle', v)} />
        <TweakRadio label="Densità" value={t.density}
          options={['compact', 'regular', 'comfy']}
          onChange={(v) => setTweak('density', v)} />
        <TweakSection label="Brand" />
        <TweakColor label="Accento guida" value={t.accentLead === 'saffron' ? '#EF7B10' : '#009C4E'}
          options={['#EF7B10', '#009C4E']}
          onChange={(v) => setTweak('accentLead', v === '#EF7B10' ? 'saffron' : 'jade')} />
        <TweakSection label="Layout" />
        <TweakToggle label="Mostra decisioni" value={t.showDecisions}
          onChange={(v) => setTweak('showDecisions', v)} />
        <TweakSlider label="Dimensione testo" value={t.fontScale} min={85} max={120} step={5} unit="%"
          onChange={(v) => setTweak('fontScale', v)} />
      </TweaksPanel>
    </div>
  );
}
