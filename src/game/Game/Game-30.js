// Game 30 — isfinite
// Lines 16426-16666 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
function Fo() {
  if (typeof document > `u` || document.getElementById(jo)) return;
  let e = document.createElement(`style`);
  ((e.id = jo),
    (e.textContent = `
.sea-lookdev {
  --sea-bg: rgba(10, 14, 22, 0.94);
  --sea-panel: rgba(14, 20, 30, 0.98);
  --sea-border: rgba(255, 255, 255, 0.12);
  --sea-text: #e8eef7;
  --sea-muted: #9aa8bc;
  --sea-accent: #5ec8ff;
  --sea-folder: rgba(255, 255, 255, 0.03);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 10050;
  display: none;
  width: min(340px, 100vw);
  color: var(--sea-text);
  font: 11px/1.25 ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
  pointer-events: none;
}
.sea-lookdev.is-open { display: flex; pointer-events: auto; }
.sea-lookdev__shell {
  display: flex;
  flex: 1;
  min-width: 0;
  width: 100%;
  background: var(--sea-bg);
  border-left: 1px solid var(--sea-border);
  backdrop-filter: blur(10px);
  box-shadow: -12px 0 40px rgba(0, 0, 0, 0.35);
}
.sea-lookdev__main {
  flex: 1;
  min-width: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: var(--sea-panel);
}
.sea-lookdev__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--sea-border);
  flex: 0 0 auto;
}
.sea-lookdev__title {
  margin: 0;
  font-size: 12px;
  font-weight: 650;
  letter-spacing: 0.02em;
}
.sea-lookdev__subtitle {
  margin: 1px 0 0;
  color: var(--sea-muted);
  font-size: 10px;
}
.sea-lookdev__close {
  appearance: none;
  border: 1px solid var(--sea-border);
  background: transparent;
  color: var(--sea-text);
  border-radius: 4px;
  width: 26px;
  height: 26px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}
.sea-lookdev__close:hover { border-color: var(--sea-accent); color: var(--sea-accent); }
.sea-lookdev__body {
  flex: 1;
  overflow: auto;
  padding: 4px 6px 16px;
  width: 100%;
  box-sizing: border-box;
}
.sea-lookdev__folders {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
}
.sea-lookdev__folder {
  width: 100%;
  border: 1px solid var(--sea-border);
  border-radius: 5px;
  background: var(--sea-folder);
  overflow: hidden;
}
.sea-lookdev__folder-head {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border: 0;
  background: transparent;
  color: var(--sea-text);
  cursor: pointer;
  text-align: left;
  font: inherit;
  font-weight: 650;
}
.sea-lookdev__folder-head:hover { background: rgba(255,255,255,0.04); }
.sea-lookdev__chevron {
  width: 0.9em;
  color: var(--sea-muted);
  flex: 0 0 auto;
}
.sea-lookdev__folder-title { flex: 1; min-width: 0; }
.sea-lookdev__folder-badge {
  color: var(--sea-muted);
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.sea-lookdev__folder.is-disabled .sea-lookdev__folder-title { opacity: 0.55; }
.sea-lookdev__folder-body {
  display: none;
  padding: 0 8px 8px;
  border-top: 1px solid var(--sea-border);
  width: 100%;
  box-sizing: border-box;
}
.sea-lookdev__folder.is-open .sea-lookdev__folder-body { display: block; }
.sea-lookdev__folder.is-open .sea-lookdev__chevron { transform: rotate(90deg); }
.sea-lookdev__enabled {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: 6px 0 6px;
  padding: 5px 8px;
  border: 1px solid var(--sea-border);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.03);
  width: 100%;
  box-sizing: border-box;
}
.sea-lookdev__enabled span { font-weight: 600; font-size: 11px; }
.sea-lookdev__enabled input { width: 14px; height: 14px; accent-color: var(--sea-accent); }
.sea-lookdev__controls {
  display: grid;
  gap: 5px;
  width: 100%;
}
.sea-lookdev__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 2px 8px;
  align-items: center;
  width: 100%;
}
.sea-lookdev__row label {
  color: var(--sea-muted);
  font-size: 10px;
  letter-spacing: 0.01em;
}
.sea-lookdev__row .sea-lookdev__value {
  color: var(--sea-text);
  font-variant-numeric: tabular-nums;
  font-size: 10px;
}
.sea-lookdev__row input[type="range"] {
  grid-column: 1 / -1;
  width: 100%;
  height: 14px;
  margin: 0;
  accent-color: var(--sea-accent);
}
.sea-lookdev__row input[type="color"] {
  width: 36px;
  height: 20px;
  padding: 0;
  border: 1px solid var(--sea-border);
  border-radius: 4px;
  background: transparent;
}
.sea-lookdev__row select,
.sea-lookdev__row button {
  grid-column: 1 / -1;
  width: 100%;
  border: 1px solid var(--sea-border);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.25);
  color: var(--sea-text);
  padding: 5px 8px;
  font: inherit;
  box-sizing: border-box;
}
.sea-lookdev__row button { cursor: pointer; text-align: left; }
.sea-lookdev__row button:hover { border-color: var(--sea-accent); }
.sea-lookdev__row--check { grid-template-columns: 1fr auto; }
.sea-lookdev__row--check input { width: 14px; height: 14px; accent-color: var(--sea-accent); }
.sea-lookdev__note {
  color: var(--sea-muted);
  font-size: 10px;
  padding: 4px 6px;
  border-left: 2px solid var(--sea-accent);
  background: rgba(94, 200, 255, 0.06);
}
.sea-lookdev__empty {
  color: var(--sea-muted);
  padding: 12px 6px;
}
`),
    document.head.appendChild(e));
}
function Io(e) {
  return typeof e == `string` && e.startsWith(`#`)
    ? e
    : `#${(Number(e) >>> 0).toString(16).padStart(6, `0`)}`;
}
function Lo(e) {
  let t = String(e || ``).replace(`#`, ``),
    n = Number.parseInt(t, 16);
  return Number.isFinite(n) ? n : 0;
}
function Ro(e, t) {
  if (!Number.isFinite(e)) return `—`;
  let n = String(t ?? 0.01).includes(`.`) ? String(t).split(`.`)[1].length : 0;
  return e.toFixed(Math.min(n, 4));
}
function zo(e) {
  let t = new Map(No.map((e, t) => [e, t]));
  return [...e].sort((e, n) => {
    let r = t.has(e.id) ? t.get(e.id) : 1e3,
      i = t.has(n.id) ? t.get(n.id) : 1e3;
    return r === i
      ? String(e.title || ``).localeCompare(String(n.title || ``))
      : r - i;
  });
}
