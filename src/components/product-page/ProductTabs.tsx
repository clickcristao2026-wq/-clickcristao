import { useRef, useState } from "react";

export function ProductTabs({ tabs }: { tabs: { label: string; content: string }[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return <section className="pp-tabs" aria-label="Informações do produto">
    <div role="tablist" aria-label="Detalhes do produto" className="pp-tablist">{tabs.map((tab, i) => <button type="button" key={tab.label} role="tab" ref={el => { refs.current[i] = el; }} id={`product-tab-${i}`} aria-controls={`product-panel-${i}`} aria-selected={i === active} tabIndex={i === active ? 0 : -1} onClick={() => setActive(i)} onKeyDown={e => {
      let next = active;
      if (e.key === "ArrowRight") next = (active + 1) % tabs.length;
      else if (e.key === "ArrowLeft") next = (active - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = tabs.length - 1;
      else return;
      e.preventDefault(); setActive(next); refs.current[next]?.focus();
    }}>{tab.label}</button>)}</div>
    <div role="tabpanel" id={`product-panel-${active}`} aria-labelledby={`product-tab-${active}`} tabIndex={0}>{tabs[active].content.split("\n\n").map((text, i) => <p key={i}>{text}</p>)}</div>
  </section>;
}
