/* global React, ReactDOM, IsometricWorld, useTweaks, TweaksPanel, TweakSection, TweakSlider, TweakToggle, TweakRadio */
const { useState, useEffect } = React;

function Hero({ docked }) {
  return (
    <div className={`hero ${docked ? "dock" : "center"}`}>
      <div className="hero-row">
        <div className="hero-name">Prachi</div>
        <div className="hero-box">Mittal</div>
      </div>
      <div className="hero-tag">Product Designer · Architect</div>
    </div>
  );
}

function CornerPanel() {
  return (
    <div className="corner-panel">
      <h4>About</h4>
      <p>
        Prachi designs digital products and physical spaces. Twelve shipped
        surfaces below — mapped by who they're for and how complex they got.
        Architecture is the cottage in the back.
      </p>
      <div className="links">
        <a href="mailto:hello@mittal.design">hello@</a>
        <a href="#" className="ghost">Resume</a>
        <a href="#" className="ghost">LinkedIn</a>
        <a href="#" className="ghost">Dribbble</a>
      </div>
    </div>
  );
}

function DetailCard({ tile, onClose, x, y }) {
  if (!tile) return null;
  return (
    <div className="detail-card" style={{ left: `${x}px`, top: `${y}px` }}>
      <button className="close" onClick={onClose}>×</button>
      <div className="eyebrow">{tile.sub}</div>
      <h3>{tile.label}</h3>
      <p>{tile.desc}</p>
      <div className="meta">
        {(tile.tags || []).map(t => <span key={t} className="chip">{t}</span>)}
      </div>
    </div>
  );
}

function PortfolioWorld({ variant }) {
  const [docked, setDocked] = useState(false);
  const [selected, setSelected] = useState(null);
  const [cardPos, setCardPos] = useState({ x: 0, y: 0 });

  // Tweakable knobs — only the FIRST artboard owns the panel & posts to host
  const [t, setTweak] = useTweaks(window.PORTFOLIO_TWEAKS_DEFAULTS);

  useEffect(() => {
    const tm = setTimeout(() => setDocked(true), 2400);
    return () => clearTimeout(tm);
  }, []);

  const onSelect = (tile) => {
    setSelected(tile);
    setCardPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <IsometricWorld
        variant={variant}
        onSelect={onSelect}
        selectedId={selected?.id}
        spacing={t.spacing}
        flat={t.flat}
        hoverPush={t.hoverPush}
      />
      <Hero docked={docked}/>
      <CornerPanel/>
      {selected && (
        <div
          style={{ position: "absolute", inset: 0, zIndex: 25, background: "rgba(0,0,0,0.2)" }}
          onClick={() => setSelected(null)}
        >
          <div onClick={e => e.stopPropagation()}>
            <DetailCard tile={selected} onClose={() => setSelected(null)} x={cardPos.x} y={cardPos.y}/>
          </div>
        </div>
      )}
      {variant === "bright" && (
        <TweaksPanel title="Tweaks">
          <TweakSection label="Layout"/>
          <TweakToggle
            label="Flat tiles"
            value={t.flat}
            onChange={(v) => setTweak("flat", v)}
          />
          <TweakSlider
            label="Tile spacing"
            value={t.spacing}
            min={1.0} max={2.0} step={0.02}
            onChange={(v) => setTweak("spacing", v)}
          />
          <TweakSlider
            label="Hover push"
            value={t.hoverPush}
            min={0} max={60} step={1} unit="px"
            onChange={(v) => setTweak("hoverPush", v)}
          />
        </TweaksPanel>
      )}
    </div>
  );
}

window.PortfolioWorld = PortfolioWorld;
