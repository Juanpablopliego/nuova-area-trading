// calendar.jsx — Calendario view: continuous Live Forex flow + diversification events.
const { useState: useStateC } = React;

function CalendarView({ filter }) {
  const cal = window.CALENDAR;
  const [activeEvent, setActiveEvent] = useStateC(null);

  const weeks = [];
  cal.months.forEach((m, mi) => {
    for (let w = 0; w < cal.weeksPerMonth; w++) {
      weeks.push({ month: m, monthIndex: mi, week: w, globalWeek: mi * cal.weeksPerMonth + w });
    }
  });

  const eventAt = (mi, w) => cal.events.find(e => e.month === mi && e.week === w);
  const eventVisible = (e) => filter === 'all' || filter === e.path;

  return (
    <div className="calendar">
      <div className="cal-intro">
        <div className="cal-engine-tag"><Glyph type="play" size={13} color="#fff" />Elemento centrale</div>
        <p>Le live Forex diventano un <strong>flusso continuo</strong>. {cal.note}</p>
      </div>

      <div className="cal-scroll">
        <div className="cal-grid" style={{ gridTemplateColumns: `120px repeat(${weeks.length}, 1fr)` }}>
          {/* Month axis row */}
          <div className="cal-corner" />
          {cal.months.map((m, mi) => (
            <div key={m} className="cal-month" style={{ gridColumn: `span ${cal.weeksPerMonth}` }}>
              {m}<span className="cal-arrow">→</span>
            </div>
          ))}

          {/* Events lane */}
          <div className="cal-lane-label"><Glyph type="diamond" size={13} color={window.BRAND.onyx} />Eventi diversificazione</div>
          {weeks.map((wk) => {
            const ev = eventAt(wk.monthIndex, wk.week);
            if (!ev) return <div key={'e' + wk.globalWeek} className="cal-evcell" />;
            const p = window.PATHS[ev.path];
            const vis = eventVisible(ev);
            return (
              <div key={'e' + wk.globalWeek} className="cal-evcell">
                <button
                  className={'cal-event' + (ev.camp ? ' is-camp' : '') + (p.warning ? ' is-warn' : '') + (vis ? '' : ' is-faded') + (activeEvent === ev.id ? ' is-open' : '')}
                  style={{ '--pc': p.color, '--ps': p.soft, '--pi': p.ink }}
                  onClick={() => setActiveEvent(activeEvent === ev.id ? null : ev.id)}
                >
                  <span className="ev-dot" style={{ background: p.color }} />
                  <span className="ev-label">{ev.label}</span>
                  {p.warning && <Glyph type="warning" size={12} color={p.ink} />}
                </button>
              </div>
            );
          })}

          {/* Live Forex flow lane */}
          <div className="cal-lane-label flow"><Glyph type="play" size={12} color={window.BRAND.saffron} />Flusso Live Forex</div>
          {weeks.map((wk) => (
            <div key={'l' + wk.globalWeek} className="cal-weekcell">
              <span className="cal-weeknum">S{wk.globalWeek + 1}</span>
              <div className="cal-lives">
                {Array.from({ length: cal.livesPerWeek }).map((_, i) => (
                  <span key={i} className="cal-live" title={`${cal.liveLabel} · ${cal.coach}`}>
                    <Glyph type="play" size={9} color="#fff" />
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Entry-anywhere + replaces note */}
      <div className="cal-footnotes">
        <div className="cal-entry">
          <span className="cal-entry-icon"><Glyph type="arrow" size={16} color="#fff" /></span>
          <div>
            <strong>Entra in qualsiasi momento</strong>
            <p>Guarda i video preparatori → ti allinei rapidamente → entri nel flusso già attivo.</p>
          </div>
        </div>
        <div className="cal-replace">
          <Glyph type="check" size={16} color={window.BRAND.jade} />
          <p>{cal.replaces}</p>
        </div>
      </div>

      {/* Event detail popover area */}
      {activeEvent && (() => {
        const ev = cal.events.find(e => e.id === activeEvent);
        const p = window.PATHS[ev.path];
        return (
          <div className="cal-detail" style={{ '--pc': p.color, '--ps': p.soft, '--pi': p.ink }}>
            <div className="cal-detail-head">
              <span className="ev-dot" style={{ background: p.color }} />
              <strong>{ev.label}</strong>
              {p.warning && <span className="cal-detail-warn"><Glyph type="warning" size={13} color={p.ink} />decisione in sospeso</span>}
              <button className="cal-detail-close" onClick={() => setActiveEvent(null)}>×</button>
            </div>
            <p>{ev.camp
              ? 'Acceleratore avanzato per community, networking e diversificazione — non usato per acquisizione.'
              : `Evento dedicato che fa scoprire il mercato ${p.label} senza complicare l’entry level. Alimenta Group Coaching e Trading Diary.`}</p>
          </div>
        );
      })()}
    </div>
  );
}

Object.assign(window, { CalendarView });
