// Ilustraciones de la landing: muestran qué hace cada función (no son fotos reales).

type View = "front" | "three" | "side";

function Person({ view, hair = "#3b2a22", skin = "#e2b99c", shirt = "#f4f1ee", bg = ["#2a2f45", "#3a3560"] as [string, string], id }: { view: View; hair?: string; skin?: string; shirt?: string; bg?: [string, string]; id: string }) {
  const dx = view === "front" ? 0 : view === "three" ? 5 : 10;
  return (
    <svg viewBox="0 0 100 120" className="person" role="img" aria-label="Ilustración de un modelo">
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={bg[0]} />
          <stop offset="1" stopColor={bg[1]} />
        </linearGradient>
      </defs>
      <rect width="100" height="120" fill={`url(#bg-${id})`} />
      <path d={`M${14 + dx / 2} 120c0-26 16-36 ${36 - dx / 2}-36s${36 - dx / 2} 10 ${36 - dx / 2} 36z`} fill={shirt} />
      <rect x={43 + dx / 2} y="68" width="14" height="18" rx="5" fill={skin} />
      <ellipse cx={50 + dx} cy="50" rx={view === "side" ? 15 : 19} ry="23" fill={skin} />
      <path d={view === "side" ? "M32 52c-4-30 12-38 28-34 10 3 14 14 12 24-2-8-8-12-14-12-8 0-14 6-14 18z" : "M29 54c-6-34 12-42 21-42s27 8 21 42c-2-14-8-22-21-22s-19 8-21 22z"} fill={hair} transform={`translate(${view === "side" ? 0 : dx * 0.5} 0)`} />
      {view !== "side" && (
        <>
          <circle cx={42 + dx} cy="50" r="1.8" fill="#2b2220" />
          <circle cx={58 + dx} cy="50" r="1.8" fill="#2b2220" />
        </>
      )}
      {view === "side" && <circle cx="56" cy="50" r="1.8" fill="#2b2220" />}
      {view === "side" && <path d="M63 52l5 6-5 1z" fill={skin} stroke="#c99b7e" strokeWidth=".6" />}
      <path d={view === "side" ? "M54 63q4 2 8 0" : `M${44 + dx} 62q6 4 12 0`} fill="none" stroke="#a5605a" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ConsistencyVisual() {
  return (
    <div className="vis">
      <div className="vis-row">
        {(["front", "three", "side"] as const).map((v, i) => (
          <div key={v} className="vis-col">
            <Person view={v} id={`c${i}`} />
            <span>{["Frontal", "3/4", "Perfil"][i]}</span>
          </div>
        ))}
      </div>
      <div className="vis-note">Misma persona en cada ángulo</div>
    </div>
  );
}

export function RealismVisual() {
  const dots = Array.from({ length: 26 }, (_, i) => ({ x: 14 + ((i * 37) % 72), y: 16 + ((i * 53) % 68), r: 0.7 + ((i * 7) % 5) / 6 }));
  return (
    <div className="vis">
      <div className="vis-row">
        <div className="vis-col">
          <svg viewBox="0 0 100 100" className="skin">
            <defs><radialGradient id="sm" cx=".4" cy=".35"><stop offset="0" stopColor="#f2cdb4" /><stop offset="1" stopColor="#dcae92" /></radialGradient></defs>
            <circle cx="50" cy="50" r="42" fill="url(#sm)" />
          </svg>
          <span>IA genérica</span>
        </div>
        <div className="vis-col">
          <svg viewBox="0 0 100 100" className="skin">
            <defs>
              <radialGradient id="sr" cx=".4" cy=".35"><stop offset="0" stopColor="#efc5a8" /><stop offset="1" stopColor="#d49f82" /></radialGradient>
              <filter id="grain" x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="4" result="n" />
                <feColorMatrix type="matrix" values="0 0 0 0 .45  0 0 0 0 .28  0 0 0 0 .2  0 0 0 .55 0" />
                <feComposite in2="SourceGraphic" operator="in" />
              </filter>
              <clipPath id="clipc"><circle cx="50" cy="50" r="42" /></clipPath>
            </defs>
            <circle cx="50" cy="50" r="42" fill="url(#sr)" />
            <g clipPath="url(#clipc)">
              <rect width="100" height="100" filter="url(#grain)" />
              {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r * 0.6} fill="#b8806a" opacity=".6" />)}
              <circle cx="66" cy="42" r="1.6" fill="#8d5a48" opacity=".8" />
            </g>
          </svg>
          <span>Con Lumia</span>
        </div>
      </div>
      <div className="vis-note">Poros, textura y luz natural</div>
    </div>
  );
}

export function SwapVisual() {
  return (
    <div className="vis">
      <div className="vis-row" style={{ alignItems: "center" }}>
        <div className="vis-col">
          <Person view="front" id="s1" hair="#d9c7a0" skin="#c9a58b" shirt="#c85a54" bg={["#3b3a36", "#5a4b3a"]} />
          <span>Referencia</span>
        </div>
        <div className="vis-arrow">→</div>
        <div className="vis-col">
          <Person view="front" id="s2" hair="#3b2a22" skin="#e2b99c" shirt="#c85a54" bg={["#3b3a36", "#5a4b3a"]} />
          <span>Tu modelo</span>
        </div>
      </div>
      <div className="vis-note">Misma escena, tu cara</div>
    </div>
  );
}

export function ProvidersVisual() {
  const items = [
    { n: "Google Gemini", m: "Nano Banana Pro", on: true },
    { n: "OpenAI", m: "GPT Image 2", on: false },
    { n: "Replicate", m: "Flux 1.1 Pro", on: false },
  ];
  return (
    <div className="vis">
      <div className="ui-list">
        {items.map((i) => (
          <div key={i.n} className={`ui-item ${i.on ? "on" : ""}`}>
            <div><strong>{i.m}</strong><span>{i.n}</span></div>
            {i.on && <em>✓</em>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function KeysVisual() {
  return (
    <div className="vis">
      <div className="ui-field"><span>API Key</span><div>••••••••••••••••••</div></div>
      <div className="ui-ok">✓ Clave válida. Guardada correctamente.</div>
      <div className="vis-note">Cifrada y solo tuya</div>
    </div>
  );
}

export function CollectionsVisual() {
  const tiles = ["#3c4a7a", "#6a4c93", "#2f6f73", "#8a5a44", "#4a5f7a", "#7a4a6a"];
  return (
    <div className="vis">
      <div className="ui-chips"><span className="on">Café y mañana</span><span>Viajes</span><span>Gimnasio</span></div>
      <div className="ui-tiles">
        {tiles.map((c, i) => <div key={i} style={{ background: `linear-gradient(135deg, ${c}, #1c1f2b)` }} />)}
      </div>
    </div>
  );
}
