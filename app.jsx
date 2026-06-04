// app.jsx — main App: header, view toggle, filters, decisions rail, tweaks.
const { useState: useStateA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "cardStyle": "morbido",
  "density": "regular",
  "accentLead": "saffron",
  "showDecisions": true,
  "fontScale": 100
}/*EDITMODE-END*/;

function DecisionCard({ d }) {
  const warn = d.status === 'warning';
  return (
    <div className={'dcard' + (warn ? ' warn' : '')}>
      <div className="dcard-head">
        <span className={'dcard-icon' + (warn ? ' warn' : '')}>
          <Glyph type={warn ? 'warning' : 'check'} size={15} color="#fff" />
        </span>
        <h4>{d.title}</h4>
      </div>
      <ul>
        {d.points.map((p, i) => <li key={i}>{p}</li>)}
      </ul>
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [view, setView] = useStateA('journey');
  const [filter, setFilter] = useStateA('all');

  const lead = window.PATHS[t.accentLead] ? window.BRAND[t.accentLead] : window.BRAND.saffron;

  return (
    <div
      className="app"
      data-cardstyle={t.cardStyle}
      data-density={t.density}
      style={{ '--lead': lead, fontSize: (t.fontScale / 100) + 'rem' }}
    >
      <header className="topbar">
        <Wordmark />
        <div className="topbar-title">
          <h1>Nuova Area Trading</h1>
          <p>Struttura approvata in call · entry unico sul Forex</p>
        </div>
        <div className="viewtoggle">
          <button className={view === 'journey' ? 'on' : ''} onClick={() => setView('journey')}>
            <Glyph type="route" size={15} color={view === 'journey' ? '#fff' : window.BRAND.onyx} />Journey
          </button>
          <button className={view === 'calendar' ? 'on' : ''} onClick={() => setView('calendar')}>
            <Glyph type="cal" size={15} color={view === 'calendar' ? '#fff' : window.BRAND.onyx} />Calendario
          </button>
        </div>
      </header>

      <div className="filterbar">
        <span className="filter-label">Percorso</span>
        <button className={'pill pill-all' + (filter === 'all' ? ' is-active' : '')} onClick={() => setFilter('all')}>
          Tutti
        </button>
        {Object.values(window.PATHS).map(p => (
          <PathPill key={p.id} path={p} active={filter === p.id} onClick={() => setFilter(filter === p.id ? 'all' : p.id)} />
        ))}
        <span className="filter-hint">{view === 'journey' ? 'Clicca un box per i dettagli' : 'Clicca un evento per i dettagli'}</span>
      </div>

      <div className={'layout' + (t.showDecisions ? '' : ' no-rail')}>
        <main className="stage">
          {view === 'journey' ? <JourneyView filter={filter} /> : <CalendarView filter={filter} />}
        </main>

        {t.showDecisions && (
          <aside className="rail">
            <div className="rail-head">
              <Glyph type="flag" size={16} color={window.BRAND.saffron} />
              <h2>Decisioni della call</h2>
            </div>
            {window.DECISIONS.map(d => <DecisionCard key={d.id} d={d} />)}
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

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
