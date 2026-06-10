import { useState, useEffect, useMemo } from "react";
import { useAuth } from './context/AuthContext.jsx';
import { useTarotData } from './hooks/useTarotData.js';
import AuthPage from './pages/AuthPage.jsx';

// ═══════════════════════════════════════════════════════════════
// GLOBAL STYLES
// ═══════════════════════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;500;600&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Josefin+Sans:wght@300;400;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --void: #06040e;
  --deep: #0d0a1a;
  --card: #130f22;
  --surface: #1a1530;
  --hover: #201b38;
  --border: rgba(120,100,200,0.15);
  --border-gold: rgba(212,175,55,0.3);
  --gold: #d4af37;
  --gold-bright: #f0cc6a;
  --gold-dim: #8a6f20;
  --gold-bg: rgba(212,175,55,0.08);
  --amethyst: #9b72cf;
  --amethyst-dim: #4a3070;
  --amethyst-bg: rgba(155,114,207,0.1);
  --silver: #ddd6f0;
  --text: #f5f0ff;
  --text-2: #ddd6f0;
  --text-3: #b8aed4;
  --red: #c0392b;
  --red-bg: rgba(192,57,43,0.15);
  --green: #27ae60;
  --green-bg: rgba(39,174,96,0.12);
  --orange: #e67e22;
  --orange-bg: rgba(230,126,34,0.12);
}

html, body, #root {
  height: 100%;
  width: 100%;
  background: var(--void);
  color: var(--text);
  font-family: 'Josefin Sans', sans-serif;
  font-size: 16px;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

.app { background: var(--void); }
.main { background: var(--void); }
.page { background: var(--void); }

/* ─── SCROLLBAR ─── */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--amethyst-dim); border-radius: 3px; }

/* ─── LAYOUT ─── */
.app { display: flex; min-height: 100vh; position: relative; }

.sidebar {
  width: 230px;
  min-width: 230px;
  background: var(--deep);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 100;
  transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
  overflow: hidden;
}
.sidebar::before {
  content: '';
  position: absolute;
  top: -60px; right: -60px;
  width: 180px; height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(155,114,207,0.08) 0%, transparent 70%);
  pointer-events: none;
}

.logo-area {
  padding: 28px 24px 22px;
  border-bottom: 1px solid var(--border);
  position: relative;
}
.logo-symbol {
  font-family: 'Cinzel Decorative', serif;
  font-size: 11px;
  color: var(--gold);
  letter-spacing: 0.2em;
  margin-bottom: 6px;
  opacity: 0.8;
}
.logo-name {
  font-family: 'Cinzel', serif;
  font-size: 17px;
  color: var(--text);
  letter-spacing: 0.06em;
  line-height: 1.2;
}
.logo-en {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 10px;
  color: var(--text-3);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin-top: 3px;
}

.nav-list { flex: 1; padding: 16px 0; overflow-y: auto; }

.nav-item {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 11px 24px;
  cursor: pointer;
  color: var(--text-2);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: all 0.18s;
  position: relative;
  border-left: 2px solid transparent;
  user-select: none;
}
.nav-item:hover { color: var(--text); background: rgba(255,255,255,0.03); }
.nav-item.active {
  color: var(--gold-bright);
  border-left-color: var(--gold);
  background: var(--gold-bg);
}
.nav-glyph {
  width: 20px;
  text-align: center;
  font-size: 15px;
  opacity: 0.7;
  flex-shrink: 0;
}
.nav-item.active .nav-glyph { opacity: 1; }

.nav-badge {
  margin-left: auto;
  background: var(--amethyst-dim);
  color: var(--amethyst);
  font-size: 10px;
  padding: 1px 7px;
  border-radius: 10px;
  font-weight: 600;
}

.sidebar-foot {
  padding: 14px 24px;
  border-top: 1px solid var(--border);
  font-size: 10px;
  color: var(--text-3);
  letter-spacing: 0.1em;
}
.sidebar-foot div + div { margin-top: 2px; }

/* ─── MAIN ─── */
.main {
  margin-left: 230px;
  flex: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.topbar {
  height: 54px;
  background: rgba(6,4,14,0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 32px;
  gap: 16px;
  position: sticky;
  top: 0;
  z-index: 50;
}
.topbar-left { display: flex; align-items: center; gap: 12px; }
.topbar-page {
  font-family: 'Cinzel', serif;
  font-size: 12px;
  color: var(--text-2);
  letter-spacing: 0.12em;
}
.topbar-sep { color: var(--text-3); font-size: 10px; }
.topbar-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
.search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 6px 12px;
  width: 240px;
  transition: border-color 0.2s;
}
.search-wrap:focus-within { border-color: var(--amethyst-dim); }
.search-wrap input {
  background: none;
  border: none;
  outline: none;
  color: var(--text);
  font-family: 'Josefin Sans', sans-serif;
  font-size: 14px;
  letter-spacing: 0.04em;
  width: 100%;
}
.search-wrap input::placeholder { color: var(--text-3); }
.search-icon { color: var(--text-3); font-size: 13px; flex-shrink: 0; }
.hamburger {
  display: none;
  background: none;
  border: none;
  color: var(--text-2);
  cursor: pointer;
  padding: 4px;
  font-size: 18px;
}
.mobile-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  z-index: 90;
}

/* ─── PAGE ─── */
.page { padding: 32px; flex: 1; }
.page-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}
.page-title {
  font-family: 'Cinzel', serif;
  font-size: 24px;
  color: var(--gold-bright);
  letter-spacing: 0.05em;
}
.page-meta {
  font-size: 13px;
  color: var(--text-2);
  letter-spacing: 0.1em;
  margin-top: 5px;
  font-family: 'Josefin Sans', sans-serif;
}

/* ─── STAT CARDS ─── */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(145px, 1fr));
  gap: 12px;
  margin-bottom: 32px;
}
.stat-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 18px 16px;
  transition: border-color 0.2s, transform 0.15s;
  cursor: default;
  position: relative;
  overflow: hidden;
}
.stat-card::after {
  content: '';
  position: absolute;
  bottom: 0; right: 0;
  width: 60px; height: 60px;
  background: radial-gradient(circle at bottom right, rgba(212,175,55,0.06), transparent 70%);
}
.stat-card.clickable { cursor: pointer; }
.stat-card.clickable:hover { border-color: var(--border-gold); transform: translateY(-1px); }
.stat-label {
  font-size: 10px;
  color: var(--text-3);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.stat-val {
  font-family: 'Cinzel', serif;
  font-size: 30px;
  color: var(--gold);
  line-height: 1;
}
.stat-sub { font-size: 10px; color: var(--text-3); margin-top: 5px; letter-spacing: 0.06em; }

/* ─── SECTION HEADING ─── */
.sec-head {
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-3);
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
  font-family: 'Josefin Sans', sans-serif;
}

/* ─── CARDS / LIST ─── */
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 18px;
}
.card + .card { margin-top: 8px; }

.list-row {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
  transition: border-color 0.18s;
}
.list-row:hover { border-color: rgba(212,175,55,0.2); }
.list-body { flex: 1; min-width: 0; }
.list-actions { display: flex; gap: 6px; align-items: center; flex-shrink: 0; }

/* ─── TAROT CARD MINI ─── */
.card-chip {
  width: 40px;
  height: 64px;
  border-radius: 5px;
  background: var(--deep);
  border: 1px solid var(--border-gold);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 3px;
  gap: 2px;
}
.card-chip-num {
  font-family: 'Cinzel', serif;
  font-size: 8px;
  color: var(--gold-dim);
  line-height: 1;
}
.card-chip-name {
  font-size: 7px;
  color: var(--gold);
  text-align: center;
  line-height: 1.2;
  font-family: 'Cinzel', serif;
  overflow: hidden;
  max-height: 32px;
}

/* ─── BUTTONS ─── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 7px;
  font-family: 'Josefin Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  cursor: pointer;
  border: 1px solid;
  transition: all 0.15s;
  white-space: nowrap;
  user-select: none;
}
.btn-gold {
  background: var(--gold);
  color: var(--void);
  border-color: var(--gold);
}
.btn-gold:hover { background: var(--gold-bright); border-color: var(--gold-bright); }
.btn-ghost {
  background: transparent;
  color: var(--text-2);
  border-color: var(--border);
}
.btn-ghost:hover { background: var(--hover); color: var(--text); border-color: var(--amethyst-dim); }
.btn-danger {
  background: var(--red-bg);
  color: #e74c3c;
  border-color: var(--red);
}
.btn-danger:hover { background: var(--red); color: #fff; }
.btn-sm { padding: 5px 12px; font-size: 11px; border-radius: 5px; }
.btn-icon { padding: 6px 9px; }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ─── FORMS ─── */
.fg { margin-bottom: 16px; }
.fg:last-child { margin-bottom: 0; }
.fl {
  display: block;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-2);
  margin-bottom: 6px;
}
.fi, .fs, .fta {
  width: 100%;
  background: var(--deep);
  border: 1px solid var(--border);
  border-radius: 7px;
  padding: 10px 14px;
  color: var(--text);
  font-family: 'Josefin Sans', sans-serif;
  font-size: 15px;
  outline: none;
  transition: border-color 0.18s;
}
.fi:focus, .fs:focus, .fta:focus { border-color: var(--amethyst-dim); }
.fs {
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%236b5f8a' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 11px center;
  padding-right: 30px;
}
.fta { resize: vertical; min-height: 80px; line-height: 1.65; }
.fgrid { display: grid; gap: 12px; }
.fgrid-2 { grid-template-columns: 1fr 1fr; }
.fgrid-3 { grid-template-columns: 1fr 1fr 1fr; }

/* ─── MODAL ─── */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(6px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.modal {
  background: var(--card);
  border: 1px solid var(--border-gold);
  border-radius: 14px;
  width: 100%;
  max-width: 660px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.modal-wide { max-width: 760px; }
.modal-sm { max-width: 380px; }
.mhead {
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: var(--card);
  flex-shrink: 0;
}
.mhead-title {
  font-family: 'Cinzel', serif;
  font-size: 15px;
  color: var(--gold-bright);
  letter-spacing: 0.05em;
}
.mbody {
  padding: 22px 24px;
  overflow-y: auto;
  flex: 1;
}
.mfoot {
  padding: 15px 24px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  background: var(--card);
  flex-shrink: 0;
}

/* ─── TAGS / BADGES ─── */
.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
}
.tag-amethyst { background: var(--amethyst-bg); color: var(--amethyst); border: 1px solid rgba(155,114,207,0.25); }
.tag-gold     { background: var(--gold-bg); color: var(--gold-bright); border: 1px solid rgba(212,175,55,0.2); }
.tag-gray     { background: rgba(100,90,140,0.15); color: var(--text-2); border: 1px solid var(--border); }
.tag-green    { background: var(--green-bg); color: #6fcf97; border: 1px solid rgba(39,174,96,0.2); }
.tag-red      { background: var(--red-bg); color: #e07070; border: 1px solid rgba(192,57,43,0.25); }
.tag-orange   { background: var(--orange-bg); color: #f0a060; border: 1px solid rgba(230,126,34,0.25); }

.ori {
  display: inline-block;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.08em;
  padding: 2px 7px;
  border-radius: 3px;
}
.ori-up { background: var(--green-bg); color: #6fcf97; }
.ori-rv { background: var(--red-bg); color: #e07070; }

.accuracy-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  padding: 3px 9px;
  border-radius: 20px;
}
.acc-accurate  { background: var(--green-bg); color: #6fcf97; }
.acc-partial   { background: var(--orange-bg); color: #f0a060; }
.acc-wrong     { background: var(--red-bg); color: #e07070; }
.acc-pending   { background: var(--amethyst-bg); color: var(--amethyst); }

/* ─── FILTER BAR ─── */
.fbar { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 18px; align-items: center; }
.fpill {
  padding: 5px 13px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  cursor: pointer;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-2);
  transition: all 0.14s;
  font-family: 'Josefin Sans', sans-serif;
}
.fpill:hover { border-color: var(--amethyst-dim); color: var(--text); }
.fpill.on { background: var(--amethyst-bg); border-color: var(--amethyst-dim); color: var(--amethyst); }

/* ─── STARS ─── */
.stars { display: flex; gap: 2px; }
.star { font-size: 13px; cursor: pointer; transition: color 0.1s; user-select: none; }
.star.on { color: var(--gold); }
.star.off { color: var(--border); }
.star.readonly { cursor: default; }

/* ─── EMPTY STATE ─── */
.empty {
  text-align: center;
  padding: 70px 20px;
  color: var(--text-3);
}
.empty-glyph {
  font-size: 44px;
  margin-bottom: 18px;
  opacity: 0.25;
  font-family: 'Cinzel', serif;
}
.empty-title {
  font-family: 'Cinzel', serif;
  font-size: 15px;
  color: var(--text-2);
  margin-bottom: 8px;
  letter-spacing: 0.05em;
}
.empty-body { font-size: 14px; line-height: 1.8; color: var(--text-2); }

/* ─── DIVIDER ─── */
.divider { height: 1px; background: var(--border); margin: 20px 0; }

/* ─── CHECKBOX ─── */
.ck-wrap {
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
  font-size: 12px;
  color: var(--text-2);
  user-select: none;
}
.ck-wrap input[type=checkbox] { width: 15px; height: 15px; accent-color: var(--gold); cursor: pointer; }

/* ─── CARD DRAW ANIMATION ─── */
@keyframes cardReveal {
  0%   { opacity: 0; transform: translateY(20px) scale(0.95) rotate(-3deg); }
  60%  { transform: translateY(-4px) scale(1.02) rotate(0.5deg); }
  100% { opacity: 1; transform: translateY(0) scale(1) rotate(0); }
}
.card-reveal { animation: cardReveal 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards; }

/* ─── BAR CHART ─── */
.bar-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.bar-label { font-size: 11px; color: var(--text-2); width: 72px; flex-shrink: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bar-track { flex: 1; height: 7px; background: var(--deep); border-radius: 4px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }
.bar-count { font-size: 11px; color: var(--text-3); width: 26px; text-align: right; flex-shrink: 0; }

/* ─── RESPONSIVE ─── */
@media (max-width: 768px) {
  .sidebar { transform: translateX(-100%); }
  .sidebar.open { transform: translateX(0); box-shadow: 4px 0 24px rgba(0,0,0,0.6); }
  .mobile-backdrop.open { display: block; }
  .main { margin-left: 0; }
  .hamburger { display: block; }
  .topbar { padding: 0 16px; }
  .topbar .search-wrap { display: none; }
  .page { padding: 16px; }
  .fgrid-2, .fgrid-3 { grid-template-columns: 1fr; }
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
  .page-head { flex-direction: column; align-items: flex-start; }
}
`;

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const today = () => new Date().toISOString().slice(0, 10);
const ls = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* quota */ } },
};


const SUITS    = ["大阿尔卡那", "权杖", "圣杯", "宝剑", "星币", "其他"];
const Q_TYPES  = ["感情", "事业", "金钱", "学业", "人际", "家庭", "其他"];
const VERIFY   = ["准确", "部分准确", "不准确", "待验证"];
const ACC_CLS  = { "准确": "acc-accurate", "部分准确": "acc-partial", "不准确": "acc-wrong", "待验证": "acc-pending" };

const NAVS = [
  { id: "dashboard", label: "总览",     glyph: "✦" },
  { id: "library",   label: "牌义库",   glyph: "⟁" },
  { id: "daily",     label: "每日抽牌", glyph: "◎" },
  { id: "cases",     label: "客户案例", glyph: "⬡" },
  { id: "review",    label: "复盘中心", glyph: "⊕" },
  { id: "search",    label: "检索",     glyph: "⊗" },
  { id: "stats",     label: "统计",     glyph: "◈" },
];

function CardImage({ card, style }) {
  const [err, setErr] = useState(false);
  const src = card?.image || (card?.id ? `/cards/${card.id}.jpg` : '');
  if (!src || err) {
    const colors = { '大阿尔卡那': '#4a3070', '权杖': '#8b4513', '圣杯': '#1a5276', '宝剑': '#566573', '星币': '#7d6608' };
    return (
      <div style={{ width: 56, height: 84, borderRadius: 6, background: colors[card?.suit] || '#201b38', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#c0b8d8', textAlign: 'center', padding: 4, flexShrink: 0, ...style }}>
        {card?.name?.slice(0, 2) || '?'}
      </div>
    );
  }
  return <img src={src} alt={card?.name} onError={() => setErr(true)} style={{ width: 56, height: 84, objectFit: 'cover', borderRadius: 6, flexShrink: 0, ...style }} />;
}

function CardMeaningPanel({ card, orientation }) {
  if (!card) return null;
  const isUp = orientation === "正位";
  const kw = isUp ? card.uprightKw : card.reversedKw;
  const meaning = isUp ? card.uprightMeaning : card.reversedMeaning;
  if (!kw && !meaning) return null;
  const color = isUp ? "#6fcf97" : "#e07070";
  const label = isUp ? "正位牌义" : "逆位牌义";
  return (
    <div style={{ background: "var(--deep)", borderRadius: 8, padding: "12px 14px", borderLeft: `3px solid ${color}`, marginTop: 12 }}>
      <div style={{ fontSize: 10, color, marginBottom: 6, fontWeight: 600, letterSpacing: "0.1em" }}>{label}</div>
      {kw && <div style={{ fontSize: 11, color, marginBottom: meaning ? 6 : 0 }}>{kw}</div>}
      {meaning && <p style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.75, margin: 0 }}>{meaning}</p>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SHARED MICRO-COMPONENTS
// ═══════════════════════════════════════════════════════════════

function Stars({ value = 0, onChange, readOnly = false }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n}
          className={`star ${n <= value ? "on" : "off"} ${readOnly ? "readonly" : ""}`}
          onClick={() => !readOnly && onChange?.(n)}>★</span>
      ))}
    </div>
  );
}

function TagList({ tags }) {
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {(tags || []).filter(Boolean).map(t => <span key={t} className="tag tag-gray">{t}</span>)}
    </div>
  );
}

function TagInput({ value = [], onChange }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const t = draft.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setDraft("");
  };
  return (
    <div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: value.length ? 8 : 0 }}>
        {value.map(t => (
          <span key={t} className="tag tag-amethyst" style={{ cursor: "pointer" }}
            onClick={() => onChange(value.filter(x => x !== t))}>{t} ×</span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <input className="fi" value={draft} onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="输入标签，按 Enter 添加" style={{ flex: 1 }} />
        <button type="button" className="btn btn-ghost btn-sm" onClick={add}>+</button>
      </div>
    </div>
  );
}

function CardPicker({ cards, selected = [], onChange }) {
  const [q, setQ] = useState("");
  const shown = cards.filter(c => !q || c.name.includes(q) || (c.enName || "").toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <input className="fi" value={q} onChange={e => setQ(e.target.value)} placeholder="搜索牌名..." style={{ marginBottom: 8 }} />
      <div style={{ maxHeight: 180, overflowY: "auto", border: "1px solid var(--border)", borderRadius: 7, background: "var(--deep)" }}>
        {shown.length === 0 ? <div style={{ padding: "10px 12px", color: "var(--text-3)", fontSize: 12 }}>无匹配</div> :
          shown.map(c => {
            const on = selected.includes(c.id);
            return (
              <div key={c.id}
                style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", borderBottom: "1px solid var(--border)", background: on ? "rgba(155,114,207,0.08)" : "transparent", transition: "background 0.12s" }}
                onClick={() => onChange(on ? selected.filter(x => x !== c.id) : [...selected, c.id])}>
                <input type="checkbox" checked={on} onChange={() => {}} style={{ accentColor: "var(--gold)", width: 14, height: 14 }} />
                <span style={{ fontSize: 12, color: "var(--text)" }}>{c.name}</span>
                {c.enName && <span style={{ fontSize: 10, color: "var(--text-3)" }}>{c.enName}</span>}
                <span className="tag tag-gray" style={{ marginLeft: "auto" }}>{c.suit}</span>
              </div>
            );
          })}
      </div>
      {selected.length > 0 && (
        <div style={{ marginTop: 7, display: "flex", gap: 4, flexWrap: "wrap" }}>
          {selected.map(id => { const c = cards.find(x => x.id === id); return c ? <span key={id} className="tag tag-gold">{c.name}</span> : null; })}
        </div>
      )}
    </div>
  );
}

function Confirm({ msg, onOk, onCancel }) {
  return (
    <div className="overlay" onClick={onCancel}>
      <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
        <div className="mhead"><span className="mhead-title">确认操作</span></div>
        <div className="mbody" style={{ textAlign: "center", padding: "28px 24px" }}>
          <div style={{ fontSize: 32, marginBottom: 14, opacity: 0.6 }}>⚠</div>
          <p style={{ color: "var(--text)", marginBottom: 6, fontSize: 14 }}>{msg}</p>
          <p style={{ fontSize: 11, color: "var(--text-3)" }}>此操作不可撤销</p>
        </div>
        <div className="mfoot" style={{ justifyContent: "center" }}>
          <button className="btn btn-ghost" onClick={onCancel}>取消</button>
          <button className="btn btn-danger" onClick={onOk}>确认删除</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CARD FORM (Library)
// ═══════════════════════════════════════════════════════════════
const newCard = () => ({
  id: uid(), name: "", enName: "", number: "", suit: "大阿尔卡那",
  uprightKw: "", reversedKw: "", uprightMeaning: "", reversedMeaning: "",
  loveMeaning: "", careerMeaning: "", moneyMeaning: "", studyMeaning: "", socialMeaning: "",
  myNote: "", realExpr: "", mistakes: "", tags: [],
});

function CardForm({ init, onSave, onClose }) {
  const [f, setF] = useState(init || newCard());
  const s = (k) => (e) => setF(p => ({ ...p, [k]: e.target.value }));
  const valid = f.name.trim().length > 0;
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={e => e.stopPropagation()}>
        <div className="mhead">
          <span className="mhead-title">{init ? "编辑牌义" : "新增塔罗牌"}</span>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="mbody">
          <div className="fgrid fgrid-3 fg">
            <div className="fg" style={{ marginBottom: 0 }}>
              <label className="fl">牌名 *</label>
              <input className="fi" value={f.name} onChange={s("name")} placeholder="如：愚者" />
            </div>
            <div className="fg" style={{ marginBottom: 0 }}>
              <label className="fl">英文名</label>
              <input className="fi" value={f.enName} onChange={s("enName")} placeholder="The Fool" />
            </div>
            <div className="fg" style={{ marginBottom: 0 }}>
              <label className="fl">编号</label>
              <input className="fi" value={f.number} onChange={s("number")} placeholder="0" />
            </div>
          </div>
          <div className="fgrid fgrid-3 fg">
            <div className="fg" style={{ marginBottom: 0 }}>
              <label className="fl">牌组</label>
              <select className="fs" value={f.suit} onChange={s("suit")}>
                {SUITS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="fg" style={{ marginBottom: 0 }}>
              <label className="fl">正位关键词</label>
              <input className="fi" value={f.uprightKw} onChange={s("uprightKw")} placeholder="新开始、自由..." />
            </div>
            <div className="fg" style={{ marginBottom: 0 }}>
              <label className="fl">逆位关键词</label>
              <input className="fi" value={f.reversedKw} onChange={s("reversedKw")} placeholder="鲁莽、逃避..." />
            </div>
          </div>
          <div className="fgrid fgrid-2 fg">
            <div className="fg" style={{ marginBottom: 0 }}>
              <label className="fl">正位牌义</label>
              <textarea className="fta" value={f.uprightMeaning} onChange={s("uprightMeaning")} />
            </div>
            <div className="fg" style={{ marginBottom: 0 }}>
              <label className="fl">逆位牌义</label>
              <textarea className="fta" value={f.reversedMeaning} onChange={s("reversedMeaning")} />
            </div>
          </div>
          <div className="divider" />
          <div className="sec-head">场景含义</div>
          <div className="fgrid fgrid-2 fg">
            {[["loveMeaning","感情"],["careerMeaning","事业"],["moneyMeaning","金钱"],["studyMeaning","学业"],["socialMeaning","人际"]].map(([k,l]) => (
              <div key={k} className="fg" style={{ marginBottom: 0 }}>
                <label className="fl">{l}</label>
                <textarea className="fta" style={{ minHeight: 64 }} value={f[k]} onChange={s(k)} />
              </div>
            ))}
          </div>
          <div className="divider" />
          <div className="sec-head">个人笔记</div>
          {[["myNote","我的个人理解"],["realExpr","常见现实表现"],["mistakes","容易误判的地方"]].map(([k,l]) => (
            <div key={k} className="fg">
              <label className="fl">{l}</label>
              <textarea className="fta" value={f[k]} onChange={s(k)} />
            </div>
          ))}
          <div className="fg">
            <label className="fl">标签</label>
            <TagInput value={f.tags} onChange={v => setF(p => ({ ...p, tags: v }))} />
          </div>
        </div>
        <div className="mfoot">
          <button className="btn btn-ghost" onClick={onClose}>取消</button>
          <button className="btn btn-gold" onClick={() => valid && onSave(f)} disabled={!valid}>保存</button>
        </div>
      </div>
    </div>
  );
}


function UserNoteForm({ init, onSave, onClose }) {
  const [f, setF] = useState({ myNote: init?.myNote || "", realExpr: init?.realExpr || "", mistakes: init?.mistakes || "" });
  const s = (k) => (e) => setF(p => ({ ...p, [k]: e.target.value }));
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="mhead">
          <span className="mhead-title">编辑笔记 · {init?.name}</span>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="mbody">
          {[["myNote","我的个人理解"],["realExpr","常见现实表现"],["mistakes","容易误判的地方"]].map(([k,l]) => (
            <div key={k} className="fg">
              <label className="fl">{l}</label>
              <textarea className="fta" value={f[k]} onChange={s(k)} />
            </div>
          ))}
        </div>
        <div className="mfoot">
          <button className="btn btn-ghost" onClick={onClose}>取消</button>
          <button className="btn btn-gold" onClick={() => onSave({ ...init, ...f })}>保存</button>
        </div>
      </div>
    </div>
  );
}

function CardDetail({ card, onEdit, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={e => e.stopPropagation()}>
        <div className="mhead">
          <div>
            <span className="mhead-title">{card.name}</span>
            {card.enName && <span style={{ marginLeft: 10, fontSize: 12, color: "var(--text-3)", fontFamily: "EB Garamond, serif", fontStyle: "italic" }}>{card.enName}</span>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={onEdit}>编辑笔记</button>
            <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="mbody">
          <div style={{ display: "flex", gap: 16, marginBottom: 16, alignItems: "flex-start" }}>
            <CardImage card={card} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {card.suit && <span className="tag tag-gold">{card.suit}</span>}
                {card.number && <span className="tag tag-gray">No.{card.number}</span>}
                <TagList tags={card.tags} />
              </div>
            </div>
          </div>
          {(card.uprightKw || card.reversedKw) && (
            <div className="fgrid fgrid-2 fg">
              {card.uprightKw && <div><span style={{ fontSize: 10, color: "var(--text-3)", display: "block", marginBottom: 4 }}>正位关键词</span><span style={{ color: "#6fcf97", fontSize: 13 }}>{card.uprightKw}</span></div>}
              {card.reversedKw && <div><span style={{ fontSize: 10, color: "var(--text-3)", display: "block", marginBottom: 4 }}>逆位关键词</span><span style={{ color: "#e07070", fontSize: 13 }}>{card.reversedKw}</span></div>}
            </div>
          )}
          {(card.uprightMeaning || card.reversedMeaning) && (
            <div className="fgrid fgrid-2 fg">
              {[["uprightMeaning","正位牌义","#6fcf97"],["reversedMeaning","逆位牌义","#e07070"]].map(([k,l,c]) =>
                card[k] ? (
                  <div key={k} style={{ background: "var(--deep)", borderRadius: 8, padding: "12px 14px", borderLeft: `3px solid ${c}` }}>
                    <div style={{ fontSize: 10, color: c, marginBottom: 6, fontWeight: 600, letterSpacing: "0.1em" }}>{l}</div>
                    <p style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.75 }}>{card[k]}</p>
                  </div>
                ) : null
              )}
            </div>
          )}
          {["loveMeaning","careerMeaning","moneyMeaning","studyMeaning","socialMeaning"].some(k => card[k]) && (
            <>
              <div className="sec-head">场景含义</div>
              <div className="fgrid fgrid-2 fg">
                {[["loveMeaning","感情"],["careerMeaning","事业"],["moneyMeaning","金钱"],["studyMeaning","学业"],["socialMeaning","人际"]].map(([k,l]) =>
                  card[k] ? (
                    <div key={k} style={{ background: "var(--deep)", borderRadius: 8, padding: "10px 12px" }}>
                      <div style={{ fontSize: 10, color: "var(--gold-dim)", marginBottom: 5, fontWeight: 600 }}>{l}</div>
                      <p style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.7 }}>{card[k]}</p>
                    </div>
                  ) : null
                )}
              </div>
            </>
          )}
          {(card.authorNote || card.authorRealExpr || card.authorMistakes) && (
            <>
              <div className="sec-head">作者解读</div>
              {[["authorNote","个人理解"],["authorRealExpr","现实表现"],["authorMistakes","误判提醒"]].map(([k,l]) =>
                card[k] ? (
                  <div key={k} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, color: "var(--text-3)", marginBottom: 4 }}>{l}</div>
                    <p style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.75 }}>{card[k]}</p>
                  </div>
                ) : null
              )}
            </>
          )}
          {(card.myNote || card.realExpr || card.mistakes) && (
            <>
              <div className="sec-head">我的笔记</div>
              {[["myNote","个人理解"],["realExpr","现实表现"],["mistakes","误判提醒"]].map(([k,l]) =>
                card[k] ? (
                  <div key={k} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, color: "var(--text-3)", marginBottom: 4 }}>{l}</div>
                    <p style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.75 }}>{card[k]}</p>
                  </div>
                ) : null
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DRAW FORM
// ═══════════════════════════════════════════════════════════════
const newDraw = () => ({
  id: uid(), date: today(), question: "", cardId: "", orientation: "正位",
  interpretation: "", event: "", tags: [], needReview: false,
  reviewed: false, actualEvent: "", reviewNote: "", accuracy: "待验证", score: 0,
});

function DrawForm({ init, cards, onSave, onClose }) {
  const [f, setF] = useState(init || newDraw());
  const [drawn, setDrawn] = useState(!!init?.cardId);
  const s = (k) => (e) => setF(p => ({ ...p, [k]: typeof e === "object" && e.target ? e.target.value : e }));
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const drawRandom = () => {
    if (!cards.length) return;
    const c = cards[Math.floor(Math.random() * cards.length)];
    const ori = Math.random() > 0.5 ? "正位" : "逆位";
    setF(p => ({ ...p, cardId: c.id, orientation: ori }));
    setDrawn(true);
  };

  const selCard = cards.find(c => c.id === f.cardId);
  const valid = f.cardId && f.date;
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="mhead">
          <span className="mhead-title">{init ? "编辑记录" : "今日抽牌"}</span>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="mbody">
          <div className="fgrid fgrid-2 fg">
            <div className="fg" style={{ marginBottom: 0 }}>
              <label className="fl">日期</label>
              <input type="date" className="fi" value={f.date} onChange={s("date")} />
            </div>
          </div>
          <div className="fg" style={{ marginTop: 14 }}>
            <label className="fl">我的问题</label>
            <input className="fi" value={f.question} onChange={s("question")} placeholder="今天想问塔罗什么？" />
          </div>
          <div className="fg">
            <label className="fl">抽取的牌</label>
            {!drawn ? (
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <button className="btn btn-gold" onClick={drawRandom} disabled={!cards.length}>✦ 随机抽牌</button>
                {!cards.length && <span style={{ fontSize: 11, color: "var(--text-3)" }}>请先在牌义库中录入牌</span>}
                <select className="fs" style={{ width: 160 }} value={f.cardId}
                  onChange={e => { set("cardId", e.target.value); if (e.target.value) setDrawn(true); }}>
                  <option value="">手动选择...</option>
                  {cards.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            ) : (
              <div className={`card ${drawn && !init ? "card-reveal" : ""}`} style={{ display: "flex", gap: 16, alignItems: "center", background: "var(--surface)", borderColor: "var(--border-gold)" }}>
                <CardImage card={selCard} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Cinzel, serif", fontSize: 16, color: "var(--gold-bright)", marginBottom: 6 }}>{selCard?.name}</div>
                  <span className={`ori ${f.orientation === "正位" ? "ori-up" : "ori-rv"}`}>{f.orientation}</span>
                  <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                    <button className="btn btn-ghost btn-sm" onClick={drawRandom}>重新抽</button>
                    <select className="fs" style={{ width: "auto", padding: "4px 26px 4px 8px", fontSize: 11 }}
                      value={f.orientation} onChange={e => set("orientation", e.target.value)}>
                      <option>正位</option><option>逆位</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            {drawn && selCard && <CardMeaningPanel card={selCard} orientation={f.orientation} />}
          </div>
          <div className="fg">
            <label className="fl">当下解读</label>
            <textarea className="fta" value={f.interpretation} onChange={s("interpretation")} placeholder="这张牌在这个问题下，我的解读是..." />
          </div>
          <div className="fg">
            <label className="fl">当天事件</label>
            <textarea className="fta" style={{ minHeight: 64 }} value={f.event} onChange={s("event")} placeholder="今天实际发生了什么？" />
          </div>
          <div className="fg">
            <label className="fl">标签</label>
            <TagInput value={f.tags} onChange={v => set("tags", v)} />
          </div>
          <label className="ck-wrap">
            <input type="checkbox" checked={f.needReview} onChange={e => set("needReview", e.target.checked)} />
            加入复盘队列
          </label>
        </div>
        <div className="mfoot">
          <button className="btn btn-ghost" onClick={onClose}>取消</button>
          <button className="btn btn-gold" onClick={() => valid && onSave(f)} disabled={!valid}>保存</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CASE FORM
// ═══════════════════════════════════════════════════════════════
const newCase = () => ({
  id: uid(), clientCode: "", date: today(), theme: "", qType: "感情",
  spread: "", cardIds: [], interpretation: "", feedback: "",
  accuracy: "待验证", score: 0, tags: [], reviewed: false, reviewNote: "",
});

function CaseForm({ init, cards, onSave, onClose }) {
  const [f, setF] = useState(init || newCase());
  const s = (k) => (e) => setF(p => ({ ...p, [k]: e.target.value }));
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const valid = f.clientCode.trim() && f.date;
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={e => e.stopPropagation()}>
        <div className="mhead">
          <span className="mhead-title">{init ? "编辑案例" : "新增客户案例"}</span>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="mbody">
          <div className="fgrid fgrid-3 fg">
            <div className="fg" style={{ marginBottom: 0 }}>
              <label className="fl">客户代号 *</label>
              <input className="fi" value={f.clientCode} onChange={s("clientCode")} placeholder="A01" />
            </div>
            <div className="fg" style={{ marginBottom: 0 }}>
              <label className="fl">咨询日期</label>
              <input type="date" className="fi" value={f.date} onChange={s("date")} />
            </div>
            <div className="fg" style={{ marginBottom: 0 }}>
              <label className="fl">问题类型</label>
              <select className="fs" value={f.qType} onChange={s("qType")}>
                {Q_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="fgrid fgrid-2 fg">
            <div className="fg" style={{ marginBottom: 0 }}>
              <label className="fl">咨询主题</label>
              <input className="fi" value={f.theme} onChange={s("theme")} placeholder="例：前任是否会回头" />
            </div>
            <div className="fg" style={{ marginBottom: 0 }}>
              <label className="fl">使用牌阵</label>
              <input className="fi" value={f.spread} onChange={s("spread")} placeholder="例：三张牌阵" />
            </div>
          </div>
          <div className="fg">
            <label className="fl">使用的牌（可多选）</label>
            <CardPicker cards={cards} selected={f.cardIds} onChange={v => set("cardIds", v)} />
          </div>
          <div className="fg">
            <label className="fl">当时解读</label>
            <textarea className="fta" value={f.interpretation} onChange={s("interpretation")} />
          </div>
          <div className="fg">
            <label className="fl">后续反馈</label>
            <textarea className="fta" style={{ minHeight: 64 }} value={f.feedback} onChange={s("feedback")} />
          </div>
          <div className="fgrid fgrid-2 fg">
            <div className="fg" style={{ marginBottom: 0 }}>
              <label className="fl">验证结果</label>
              <select className="fs" value={f.accuracy} onChange={s("accuracy")}>
                {VERIFY.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="fg" style={{ marginBottom: 0 }}>
              <label className="fl">准确度评分</label>
              <div style={{ padding: "9px 0" }}>
                <Stars value={f.score} onChange={v => set("score", v)} />
              </div>
            </div>
          </div>
          <div className="fg">
            <label className="fl">标签</label>
            <TagInput value={f.tags} onChange={v => set("tags", v)} />
          </div>
          <label className="ck-wrap">
            <input type="checkbox" checked={f.reviewed} onChange={e => set("reviewed", e.target.checked)} />
            已完成复盘
          </label>
        </div>
        <div className="mfoot">
          <button className="btn btn-ghost" onClick={onClose}>取消</button>
          <button className="btn btn-gold" onClick={() => valid && onSave(f)} disabled={!valid}>保存</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// REVIEW MODAL
// ═══════════════════════════════════════════════════════════════
function ReviewModal({ item, type, cards, onSave, onClose }) {
  const [f, setF] = useState({ ...item });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const cardName = type === "draw" ? (cards.find(c => c.id === f.cardId)?.name || "未知") : null;
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="mhead">
          <span className="mhead-title">复盘 · {type === "draw" ? "每日抽牌" : "客户案例"}</span>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="mbody">
          <div className="card" style={{ marginBottom: 18, background: "var(--deep)", borderColor: "var(--border-gold)" }}>
            <div style={{ fontSize: 10, color: "var(--text-3)", marginBottom: 4 }}>{f.date}</div>
            {type === "draw" ? (
              <>
                <div style={{ fontFamily: "Cinzel, serif", color: "var(--gold-bright)", marginBottom: 6, fontSize: 14 }}>
                  {cardName} · <span className={`ori ${f.orientation === "正位" ? "ori-up" : "ori-rv"}`}>{f.orientation}</span>
                </div>
                {f.question && <p style={{ fontSize: 12, color: "var(--text-2)" }}>问题：{f.question}</p>}
                {f.interpretation && <p style={{ fontSize: 12, color: "var(--text-2)", marginTop: 4 }}>解读：{f.interpretation}</p>}
              </>
            ) : (
              <>
                <div style={{ fontFamily: "Cinzel, serif", color: "var(--gold-bright)", marginBottom: 6, fontSize: 14 }}>
                  {f.clientCode} <span className="tag tag-amethyst">{f.qType}</span>
                </div>
                {f.theme && <p style={{ fontSize: 12, color: "var(--text-2)" }}>主题：{f.theme}</p>}
                {f.interpretation && <p style={{ fontSize: 12, color: "var(--text-2)", marginTop: 4 }}>解读：{f.interpretation}</p>}
              </>
            )}
          </div>
          {type === "draw" && (
            <div className="fg">
              <label className="fl">实际发生的事情</label>
              <textarea className="fta" value={f.actualEvent || ""} onChange={e => set("actualEvent", e.target.value)} placeholder="事后来看，实际上发生了什么？" />
            </div>
          )}
          {type === "case" && (
            <div className="fg">
              <label className="fl">后续反馈补充</label>
              <textarea className="fta" value={f.feedback || ""} onChange={e => set("feedback", e.target.value)} />
            </div>
          )}
          <div className="fg">
            <label className="fl">复盘结论</label>
            <textarea className="fta" value={f.reviewNote || ""} onChange={e => set("reviewNote", e.target.value)} placeholder="这次解读的收获与反思..." />
          </div>
          <div className="fgrid fgrid-2 fg">
            <div className="fg" style={{ marginBottom: 0 }}>
              <label className="fl">验证结果</label>
              <select className="fs" value={f.accuracy || "待验证"} onChange={e => set("accuracy", e.target.value)}>
                {VERIFY.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="fg" style={{ marginBottom: 0 }}>
              <label className="fl">准确度评分</label>
              <div style={{ padding: "9px 0" }}>
                <Stars value={f.score || 0} onChange={v => set("score", v)} />
              </div>
            </div>
          </div>
          <label className="ck-wrap" style={{ marginTop: 8 }}>
            <input type="checkbox" checked={f.reviewed || false} onChange={e => set("reviewed", e.target.checked)} />
            标记为已复盘
          </label>
        </div>
        <div className="mfoot">
          <button className="btn btn-ghost" onClick={onClose}>取消</button>
          <button className="btn btn-gold" onClick={() => onSave(f)}>保存复盘</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE: DASHBOARD
// ═══════════════════════════════════════════════════════════════
function Dashboard({ cards, draws, cases, goTo }) {
  const pendingCount = draws.filter(d => d.needReview && !d.reviewed).length
    + cases.filter(c => !c.reviewed && c.accuracy === "待验证").length;
  const scored = [...draws.filter(d => d.score > 0), ...cases.filter(c => c.score > 0)];
  const avg = scored.length ? (scored.reduce((a, b) => a + b.score, 0) / scored.length).toFixed(1) : "—";

  const recent = [...draws.map(d => ({ ...d, _t: "draw" })), ...cases.map(c => ({ ...c, _t: "case" }))]
    .sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);

  const stats = [
    { label: "抽牌记录", val: draws.length, sub: "条", page: "daily" },
    { label: "客户案例", val: cases.length, sub: "个", page: "cases" },
    { label: "待复盘", val: pendingCount, sub: "条", page: "review" },
  ];

  const navTabs = [
    { id: "library", label: "牌义库",   glyph: "⟁" },
    { id: "daily",   label: "每日抽牌", glyph: "◎" },
    { id: "cases",   label: "客户案例", glyph: "⬡" },
    { id: "review",  label: "复盘中心", glyph: "⊕", badge: pendingCount },
    { id: "search",  label: "检索",     glyph: "⊗" },
    { id: "stats",   label: "统计",     glyph: "◈" },
  ];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">✦ 牌感日记</h1>
          <div className="page-meta">Tarot Journal · {new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 28, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "8px 10px" }}>
        {navTabs.map(t => (
          <div key={t.id} onClick={() => goTo(t.id)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 6, cursor: "pointer", border: "1px solid transparent", transition: "all 0.15s", position: "relative" }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.borderColor = "var(--border-gold)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.borderColor = "transparent"; }}>
            <span style={{ fontSize: 13, opacity: 0.7 }}>{t.glyph}</span>
            <span style={{ fontFamily: "Cinzel, serif", fontSize: 11, color: "var(--gold-bright)", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{t.label}</span>
            {t.badge > 0 && <span style={{ background: "var(--amethyst-dim)", color: "var(--amethyst)", fontSize: 9, fontWeight: 600, padding: "0px 5px", borderRadius: 8, lineHeight: "16px" }}>{t.badge}</span>}
          </div>
        ))}
      </div>

      <div className="stat-grid">
        {stats.map(s => (
          <div key={s.label} className={`stat-card ${s.page ? "clickable" : ""}`} onClick={() => s.page && goTo(s.page)}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-val">{s.val}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>
      <div className="sec-head">最近动态</div>
      {recent.length === 0 ? (
        <div className="empty">
          <div className="empty-glyph">✦</div>
          <div className="empty-title">一切从第一张牌开始</div>
          <div className="empty-body">前往「牌义库」录入你的第一张塔罗牌<br />然后开始每日抽牌，记录你与牌的对话</div>
        </div>
      ) : recent.map(item => {
        const card = item._t === "draw" ? cards.find(c => c.id === item.cardId) : null;
        return (
          <div key={item.id} className="list-row">
            <div style={{ width: 34, height: 34, borderRadius: 7, background: item._t === "draw" ? "var(--amethyst-bg)" : "var(--gold-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, border: "1px solid " + (item._t === "draw" ? "rgba(155,114,207,0.2)" : "var(--border-gold)") }}>
              {item._t === "draw" ? "◎" : "⬡"}
            </div>
            <div className="list-body">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <span style={{ fontFamily: "Cinzel, serif", fontSize: 13, color: "var(--gold-bright)" }}>
                  {item._t === "draw" ? (card?.name || "未知牌") : item.clientCode}
                </span>
                {item._t === "draw" && <span className={`ori ${item.orientation === "正位" ? "ori-up" : "ori-rv"}`}>{item.orientation}</span>}
                {item._t === "case" && <span className="tag tag-amethyst">{item.qType}</span>}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>
                {item.date}{item._t === "draw" && item.question ? " · " + item.question : ""}{item._t === "case" && item.theme ? " · " + item.theme : ""}
              </div>
            </div>
            {item.accuracy && item.accuracy !== "待验证" && <span className={`accuracy-badge ${ACC_CLS[item.accuracy]}`}>{item.accuracy}</span>}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE: LIBRARY
// ═══════════════════════════════════════════════════════════════
function Library({ cards, setCards }) {
  const [q, setQ] = useState("");
  const [suit, setSuit] = useState("全部");
  const [form, setForm] = useState(null);
  const [view, setView] = useState(null);

  const shown = useMemo(() => cards.filter(c => {
    const mq = !q || c.name.includes(q) || (c.enName || "").toLowerCase().includes(q.toLowerCase())
      || (c.uprightKw || "").includes(q) || (c.reversedKw || "").includes(q)
      || (c.tags || []).some(t => t.includes(q));
    const ms = suit === "全部" || c.suit === suit;
    return mq && ms;
  }), [cards, q, suit]);

  const save = (f) => {
    setCards(prev => prev.map(c => c.id === f.id ? f : c));
    setForm(null);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">牌义库</h1>
          <div className="page-meta">共 {cards.length} 张 · 显示 {shown.length} 张</div>
        </div>
      </div>
      <input className="fi" style={{ marginBottom: 14 }} value={q} onChange={e => setQ(e.target.value)} placeholder="搜索牌名、英文名、关键词、标签..." />
      <div className="fbar">
        {["全部", ...SUITS].map(s => <button key={s} className={`fpill ${suit === s ? "on" : ""}`} onClick={() => setSuit(s)}>{s}</button>)}
      </div>
      {shown.length === 0 ? (
        <div className="empty">
          <div className="empty-glyph">⟁</div>
          <div className="empty-title">{cards.length === 0 ? "牌义库加载中" : "没有符合条件的牌"}</div>
          <div className="empty-body">{cards.length === 0 ? "系统已内置 78 张塔罗牌，正在从云端加载..." : "尝试调整搜索条件"}</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 10 }}>
          {shown.map(c => (
            <div key={c.id} className="card" style={{ cursor: "pointer", transition: "border-color 0.18s, transform 0.15s", borderColor: "var(--border)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-gold)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = ""; }}
              onClick={() => setView(c)}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <CardImage card={c} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "Cinzel, serif", fontSize: 14, color: "var(--text)", marginBottom: 3 }}>{c.name}</div>
                  {c.enName && <div style={{ fontSize: 10, color: "var(--text-3)", marginBottom: 6, fontStyle: "italic", fontFamily: "EB Garamond, serif" }}>{c.enName}</div>}
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
                    <span className="tag tag-gold">{c.suit}</span>
                  </div>
                  {c.uprightKw && <div style={{ fontSize: 10, color: "#6fcf97", marginBottom: 2 }}>↑ {c.uprightKw}</div>}
                  {c.reversedKw && <div style={{ fontSize: 10, color: "#e07070" }}>↓ {c.reversedKw}</div>}
                </div>
              </div>
              {(c.tags || []).length > 0 && <div style={{ marginTop: 10 }}><TagList tags={c.tags} /></div>}
              <div style={{ display: "flex", gap: 6, marginTop: 12, justifyContent: "flex-end" }} onClick={e => e.stopPropagation()}>
                <button className="btn btn-ghost btn-sm" onClick={() => setForm(c)}>编辑笔记</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {form && <UserNoteForm init={form} onSave={save} onClose={() => setForm(null)} />}
      {view && <CardDetail card={view} onEdit={() => { setForm(view); setView(null); }} onClose={() => setView(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE: DAILY DRAW
// ═══════════════════════════════════════════════════════════════
function Daily({ cards, draws, setDraws }) {
  const [form, setForm] = useState(null);
  const [del, setDel] = useState(null);
  const [rfilt, setRfilt] = useState("全部");

  const shown = useMemo(() =>
    draws.filter(d => {
      if (rfilt === "待复盘") return d.needReview && !d.reviewed;
      if (rfilt === "已复盘") return d.reviewed;
      return true;
    }).sort((a, b) => b.date.localeCompare(a.date)),
    [draws, rfilt]
  );

  const save = (f) => {
    setDraws(prev => form === "new" ? [f, ...prev] : prev.map(d => d.id === f.id ? f : d));
    setForm(null);
  };
  const doDelete = (id) => { setDraws(prev => prev.filter(d => d.id !== id)); setDel(null); };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">每日抽牌</h1>
          <div className="page-meta">{draws.length} 条记录</div>
        </div>
        <button className="btn btn-gold" onClick={() => setForm("new")}>◎ 今日抽牌</button>
      </div>
      <div className="fbar">
        {["全部","待复盘","已复盘"].map(f => <button key={f} className={`fpill ${rfilt === f ? "on" : ""}`} onClick={() => setRfilt(f)}>{f}</button>)}
      </div>
      {shown.length === 0 ? (
        <div className="empty">
          <div className="empty-glyph">◎</div>
          <div className="empty-title">还没有抽牌记录</div>
          <div className="empty-body">{cards.length === 0 ? "请先在牌义库中录入至少一张牌" : "点击「今日抽牌」开始你的第一次占卜"}</div>
        </div>
      ) : shown.map(d => {
        const card = cards.find(c => c.id === d.cardId);
        return (
          <div key={d.id} className="list-row">
            <div className="card-chip">
              {card?.number && <div className="card-chip-num">{card.number}</div>}
              <div className="card-chip-name">{card?.name || "?"}</div>
            </div>
            <div className="list-body">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "Cinzel, serif", fontSize: 13, color: "var(--gold-bright)" }}>{card?.name || "未知牌"}</span>
                <span className={`ori ${d.orientation === "正位" ? "ori-up" : "ori-rv"}`}>{d.orientation}</span>
                {d.needReview && !d.reviewed && <span className="tag tag-orange">待复盘</span>}
                {d.reviewed && <span className="tag tag-green">已复盘</span>}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 4 }}>{d.date}{d.question ? " · " + d.question : ""}</div>
              {d.interpretation && <p style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.65 }}>{d.interpretation}</p>}
              <div style={{ marginTop: 6, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                {d.accuracy && d.accuracy !== "待验证" && <span className={`accuracy-badge ${ACC_CLS[d.accuracy]}`}>{d.accuracy}</span>}
                {d.score > 0 && <Stars value={d.score} readOnly />}
              </div>
              {(d.tags || []).length > 0 && <div style={{ marginTop: 6 }}><TagList tags={d.tags} /></div>}
            </div>
            <div className="list-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setForm(d)}>编辑</button>
              <button className="btn btn-danger btn-sm" onClick={() => setDel(d.id)}>删除</button>
            </div>
          </div>
        );
      })}
      {form && <DrawForm init={form === "new" ? undefined : form} cards={cards} onSave={save} onClose={() => setForm(null)} />}
      {del && <Confirm msg="确认删除这条抽牌记录？" onOk={() => doDelete(del)} onCancel={() => setDel(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE: CASES
// ═══════════════════════════════════════════════════════════════
function Cases({ cards, cases, setCases }) {
  const [form, setForm] = useState(null);
  const [del, setDel] = useState(null);
  const [qtFilt, setQtFilt] = useState("全部");
  const [accFilt, setAccFilt] = useState("全部");

  const shown = useMemo(() => cases.filter(c => {
    const mq = qtFilt === "全部" || c.qType === qtFilt;
    const ma = accFilt === "全部" || c.accuracy === accFilt;
    return mq && ma;
  }).sort((a, b) => b.date.localeCompare(a.date)), [cases, qtFilt, accFilt]);

  const save = (f) => {
    setCases(prev => form === "new" ? [f, ...prev] : prev.map(c => c.id === f.id ? f : c));
    setForm(null);
  };
  const doDelete = (id) => { setCases(prev => prev.filter(c => c.id !== id)); setDel(null); };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">客户案例</h1>
          <div className="page-meta">{cases.length} 个案例</div>
        </div>
        <button className="btn btn-gold" onClick={() => setForm("new")}>+ 新增案例</button>
      </div>
      <div className="fbar">{["全部", ...Q_TYPES].map(f => <button key={f} className={`fpill ${qtFilt === f ? "on" : ""}`} onClick={() => setQtFilt(f)}>{f}</button>)}</div>
      <div className="fbar" style={{ marginTop: -10 }}>{["全部", ...VERIFY].map(f => <button key={f} className={`fpill ${accFilt === f ? "on" : ""}`} onClick={() => setAccFilt(f)}>{f}</button>)}</div>
      {shown.length === 0 ? (
        <div className="empty">
          <div className="empty-glyph">⬡</div>
          <div className="empty-title">暂无案例记录</div>
          <div className="empty-body">记录客户咨询案例，追踪准确度，提升解牌能力</div>
        </div>
      ) : shown.map(c => {
        const cCards = (c.cardIds || []).map(id => cards.find(x => x.id === id)).filter(Boolean);
        return (
          <div key={c.id} className="list-row">
            <div style={{ width: 42, height: 42, borderRadius: 8, background: "var(--gold-bg)", border: "1px solid var(--border-gold)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Cinzel, serif", fontSize: 13, color: "var(--gold)", flexShrink: 0 }}>
              {c.clientCode.slice(0, 2)}
            </div>
            <div className="list-body">
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "Cinzel, serif", fontSize: 13, color: "var(--gold-bright)" }}>{c.clientCode}</span>
                <span className="tag tag-amethyst">{c.qType}</span>
                <span className={`accuracy-badge ${ACC_CLS[c.accuracy]}`}>{c.accuracy}</span>
                {c.reviewed && <span className="tag tag-green">已复盘</span>}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 4 }}>{c.date}{c.theme ? " · " + c.theme : ""}{c.spread ? " · " + c.spread : ""}</div>
              {cCards.length > 0 && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 4 }}>
                  {cCards.map(x => <span key={x.id} className="tag tag-gold">{x.name}</span>)}
                </div>
              )}
              {c.score > 0 && <Stars value={c.score} readOnly />}
              {(c.tags || []).length > 0 && <div style={{ marginTop: 6 }}><TagList tags={c.tags} /></div>}
            </div>
            <div className="list-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setForm(c)}>编辑</button>
              <button className="btn btn-danger btn-sm" onClick={() => setDel(c.id)}>删除</button>
            </div>
          </div>
        );
      })}
      {form && <CaseForm init={form === "new" ? undefined : form} cards={cards} onSave={save} onClose={() => setForm(null)} />}
      {del && <Confirm msg="确认删除这个案例？" onOk={() => doDelete(del)} onCancel={() => setDel(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE: REVIEW
// ═══════════════════════════════════════════════════════════════
function Review({ cards, draws, setDraws, cases, setCases }) {
  const [tab, setTab] = useState("pending");
  const [rev, setRev] = useState(null); // { item, type }

  const pendingDraws = draws.filter(d => d.needReview && !d.reviewed);
  const pendingCases = cases.filter(c => !c.reviewed);
  const doneDraws = draws.filter(d => d.reviewed);
  const doneCases = cases.filter(c => c.reviewed);

  const saveReview = ({ item, type }) => {
    if (type === "draw") setDraws(prev => prev.map(d => d.id === item.id ? item : d));
    else setCases(prev => prev.map(c => c.id === item.id ? item : c));
    setRev(null);
  };

  const DrawRow = ({ d }) => {
    const card = cards.find(c => c.id === d.cardId);
    return (
      <div className="list-row">
        <div className="card-chip"><div className="card-chip-name">{card?.name || "?"}</div></div>
        <div className="list-body">
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3 }}>
            <span style={{ fontFamily: "Cinzel, serif", color: "var(--gold-bright)", fontSize: 13 }}>{card?.name || "未知"}</span>
            <span className={`ori ${d.orientation === "正位" ? "ori-up" : "ori-rv"}`}>{d.orientation}</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 3 }}>{d.date}{d.question ? " · " + d.question : ""}</div>
          {d.reviewed && d.reviewNote && <p style={{ fontSize: 11, color: "var(--text-2)" }}>{d.reviewNote}</p>}
          {d.reviewed && d.accuracy && <span className={`accuracy-badge ${ACC_CLS[d.accuracy]}`} style={{ marginTop: 6, display: "inline-block" }}>{d.accuracy}</span>}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setRev({ item: d, type: "draw" })}>{d.reviewed ? "查看" : "复盘"}</button>
      </div>
    );
  };

  const CaseRow = ({ c }) => (
    <div className="list-row">
      <div style={{ width: 38, height: 38, borderRadius: 7, background: "var(--gold-bg)", border: "1px solid var(--border-gold)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Cinzel, serif", fontSize: 12, color: "var(--gold)", flexShrink: 0 }}>
        {c.clientCode.slice(0, 2)}
      </div>
      <div className="list-body">
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3 }}>
          <span style={{ fontFamily: "Cinzel, serif", color: "var(--gold-bright)", fontSize: 13 }}>{c.clientCode}</span>
          <span className="tag tag-amethyst">{c.qType}</span>
          <span className={`accuracy-badge ${ACC_CLS[c.accuracy]}`}>{c.accuracy}</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-3)" }}>{c.date}{c.theme ? " · " + c.theme : ""}</div>
        {c.reviewed && c.score > 0 && <div style={{ marginTop: 4 }}><Stars value={c.score} readOnly /></div>}
      </div>
      <button className="btn btn-ghost btn-sm" onClick={() => setRev({ item: c, type: "case" })}>{c.reviewed ? "查看" : "复盘"}</button>
    </div>
  );

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">复盘中心</h1>
          <div className="page-meta">待复盘 {pendingDraws.length + pendingCases.length} 条</div>
        </div>
      </div>
      <div className="fbar">
        <button className={`fpill ${tab === "pending" ? "on" : ""}`} onClick={() => setTab("pending")}>待复盘 ({pendingDraws.length + pendingCases.length})</button>
        <button className={`fpill ${tab === "done" ? "on" : ""}`} onClick={() => setTab("done")}>已复盘 ({doneDraws.length + doneCases.length})</button>
      </div>
      {tab === "pending" ? (
        pendingDraws.length + pendingCases.length === 0 ? (
          <div className="empty">
            <div className="empty-glyph">⊕</div>
            <div className="empty-title">所有记录都已复盘</div>
            <div className="empty-body">在抽牌记录或案例中勾选「加入复盘队列」可将其加入</div>
          </div>
        ) : (
          <>
            {pendingDraws.length > 0 && <><div className="sec-head">每日抽牌 · 待复盘</div>{pendingDraws.map(d => <DrawRow key={d.id} d={d} />)}</>}
            {pendingCases.length > 0 && <><div className="sec-head" style={{ marginTop: 20 }}>客户案例 · 待复盘</div>{pendingCases.map(c => <CaseRow key={c.id} c={c} />)}</>}
          </>
        )
      ) : (
        doneDraws.length + doneCases.length === 0 ? (
          <div className="empty"><div className="empty-glyph">⊕</div><div className="empty-title">还没有复盘记录</div></div>
        ) : (
          <>
            {doneDraws.length > 0 && <><div className="sec-head">每日抽牌 · 已复盘</div>{doneDraws.map(d => <DrawRow key={d.id} d={d} />)}</>}
            {doneCases.length > 0 && <><div className="sec-head" style={{ marginTop: 20 }}>客户案例 · 已复盘</div>{doneCases.map(c => <CaseRow key={c.id} c={c} />)}</>}
          </>
        )
      )}
      {rev && <ReviewModal item={rev.item} type={rev.type} cards={cards} onSave={(item) => saveReview({ item, type: rev.type })} onClose={() => setRev(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE: SEARCH
// ═══════════════════════════════════════════════════════════════
function Search({ cards, draws, cases, initialQuery = "" }) {
  const [q, setQ] = useState(initialQuery);
  const [typeFilt, setTypeFilt] = useState("全部");

  useEffect(() => { if (initialQuery) setQ(initialQuery); }, [initialQuery]);
  const [qtFilt, setQtFilt] = useState("全部");
  const [accFilt, setAccFilt] = useState("全部");
  const [revFilt, setRevFilt] = useState("全部");

  const noFilters = !q.trim() && typeFilt === "全部" && qtFilt === "全部" && accFilt === "全部" && revFilt === "全部";
  const lq = q.toLowerCase();
  const ms = (s) => !q || (s || "").toLowerCase().includes(lq);

  const rCards = (typeFilt === "全部" || typeFilt === "牌") ? cards.filter(c =>
    ms(c.name) || ms(c.enName) || ms(c.uprightKw) || ms(c.reversedKw) || (c.tags || []).some(ms)
  ) : [];

  const rDraws = (typeFilt === "全部" || typeFilt === "抽牌") ? draws.filter(d => {
    const cn = cards.find(c => c.id === d.cardId)?.name || "";
    const mq2 = ms(d.question) || ms(d.interpretation) || ms(cn) || (d.tags || []).some(ms);
    const ma = accFilt === "全部" || d.accuracy === accFilt;
    const mr = revFilt === "全部" || (revFilt === "待复盘" ? d.needReview && !d.reviewed : d.reviewed);
    return mq2 && ma && mr;
  }) : [];

  const rCases = (typeFilt === "全部" || typeFilt === "案例") ? cases.filter(c => {
    const ccs = (c.cardIds || []).map(id => cards.find(x => x.id === id)).filter(Boolean);
    const mq2 = ms(c.clientCode) || ms(c.theme) || ms(c.interpretation) || ccs.some(x => ms(x.name)) || (c.tags || []).some(ms);
    const mqt = qtFilt === "全部" || c.qType === qtFilt;
    const ma = accFilt === "全部" || c.accuracy === accFilt;
    const mr = revFilt === "全部" || (revFilt === "待复盘" ? !c.reviewed : c.reviewed);
    return mq2 && mqt && ma && mr;
  }) : [];

  const total = rCards.length + rDraws.length + rCases.length;

  return (
    <div className="page">
      <div className="page-head"><div><h1 className="page-title">检索分类</h1></div></div>
      <input className="fi" style={{ marginBottom: 14, fontSize: 15 }} value={q} onChange={e => setQ(e.target.value)} placeholder="全站搜索：牌名、标签、代号、关键词..." />
      <div className="fbar">{["全部","牌","抽牌","案例"].map(f => <button key={f} className={`fpill ${typeFilt === f ? "on" : ""}`} onClick={() => setTypeFilt(f)}>{f}</button>)}</div>
      <div className="fbar" style={{ marginTop: -10 }}>{["全部", ...Q_TYPES].map(f => <button key={f} className={`fpill ${qtFilt === f ? "on" : ""}`} onClick={() => setQtFilt(f)}>{f}</button>)}</div>
      <div className="fbar" style={{ marginTop: -10 }}>
        {["全部", ...VERIFY].map(f => <button key={f} className={`fpill ${accFilt === f ? "on" : ""}`} onClick={() => setAccFilt(f)}>{f}</button>)}
        {["待复盘","已复盘"].map(f => <button key={f} className={`fpill ${revFilt === f ? "on" : ""}`} onClick={() => setRevFilt(p => p === f ? "全部" : f)}>{f}</button>)}
      </div>
      {noFilters ? (
        <div className="empty"><div className="empty-glyph">⊗</div><div className="empty-title">输入关键词开始检索</div><div className="empty-body">支持按牌名、标签、问题类型、验证结果等多维度筛选</div></div>
      ) : total === 0 ? (
        <div className="empty"><div className="empty-glyph">⊗</div><div className="empty-title">没有找到相关内容</div></div>
      ) : (
        <>
          <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 16, letterSpacing: "0.1em" }}>找到 {total} 条结果</div>
          {rCards.length > 0 && (
            <><div className="sec-head">牌义库 ({rCards.length})</div>
            {rCards.map(c => (
              <div key={c.id} className="list-row">
                <div className="card-chip"><div className="card-chip-name">{c.name}</div></div>
                <div className="list-body">
                  <div style={{ fontFamily: "Cinzel, serif", color: "var(--gold-bright)", marginBottom: 3, fontSize: 13 }}>{c.name} {c.enName && <span style={{ fontSize: 11, color: "var(--text-3)", fontStyle: "italic" }}>{c.enName}</span>}</div>
                  <div style={{ display: "flex", gap: 4 }}><span className="tag tag-gold">{c.suit}</span><TagList tags={c.tags} /></div>
                </div>
              </div>
            ))}</>
          )}
          {rDraws.length > 0 && (
            <><div className="sec-head" style={{ marginTop: 16 }}>抽牌记录 ({rDraws.length})</div>
            {rDraws.map(d => {
              const card = cards.find(c => c.id === d.cardId);
              return (
                <div key={d.id} className="list-row">
                  <div className="list-body">
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3 }}>
                      <span style={{ fontFamily: "Cinzel, serif", color: "var(--gold-bright)", fontSize: 13 }}>{card?.name || "未知"}</span>
                      <span className={`ori ${d.orientation === "正位" ? "ori-up" : "ori-rv"}`}>{d.orientation}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-3)" }}>{d.date}{d.question ? " · " + d.question : ""}</div>
                  </div>
                  {d.accuracy && <span className={`accuracy-badge ${ACC_CLS[d.accuracy || "待验证"]}`}>{d.accuracy || "待验证"}</span>}
                </div>
              );
            })}</>
          )}
          {rCases.length > 0 && (
            <><div className="sec-head" style={{ marginTop: 16 }}>客户案例 ({rCases.length})</div>
            {rCases.map(c => (
              <div key={c.id} className="list-row">
                <div className="list-body">
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3 }}>
                    <span style={{ fontFamily: "Cinzel, serif", color: "var(--gold-bright)", fontSize: 13 }}>{c.clientCode}</span>
                    <span className="tag tag-amethyst">{c.qType}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-3)" }}>{c.date}{c.theme ? " · " + c.theme : ""}</div>
                </div>
                <span className={`accuracy-badge ${ACC_CLS[c.accuracy]}`}>{c.accuracy}</span>
              </div>
            ))}</>
          )}
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE: STATS
// ═══════════════════════════════════════════════════════════════
function Stats({ cards, draws, cases }) {
  const freq = useMemo(() => {
    const f = {};
    draws.forEach(d => { if (d.cardId) f[d.cardId] = (f[d.cardId] || 0) + 1; });
    cases.forEach(c => { (c.cardIds || []).forEach(id => { f[id] = (f[id] || 0) + 1; }); });
    return Object.entries(f).map(([id, n]) => ({ card: cards.find(x => x.id === id), n }))
      .filter(x => x.card).sort((a, b) => b.n - a.n);
  }, [cards, draws, cases]);

  const qtDist = useMemo(() => {
    const d = {}; Q_TYPES.forEach(t => d[t] = 0);
    cases.forEach(c => { d[c.qType] = (d[c.qType] || 0) + 1; });
    return Object.entries(d).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  }, [cases]);

  const suitDist = useMemo(() => {
    const d = {}; SUITS.forEach(s => d[s] = 0);
    cards.forEach(c => { d[c.suit] = (d[c.suit] || 0) + 1; });
    return Object.entries(d).filter(([, v]) => v > 0);
  }, [cards]);

  const monthly = useMemo(() => {
    const m = {};
    [...draws, ...cases].forEach(x => { const k = x.date.slice(0, 7); m[k] = (m[k] || 0) + 1; });
    return Object.entries(m).sort().slice(-6);
  }, [draws, cases]);

  const scored = [...draws.filter(d => d.score > 0), ...cases.filter(c => c.score > 0)];
  const avg = scored.length ? (scored.reduce((a, b) => a + b.score, 0) / scored.length).toFixed(2) : "—";
  const maxMonth = Math.max(...monthly.map(([, v]) => v), 1);
  const maxFreq = freq[0]?.n || 1;

  return (
    <div className="page">
      <div className="page-head"><div><h1 className="page-title">统计分析</h1></div></div>
      <div className="stat-grid">
        {[
          { label: "牌义库总数", val: cards.length },
          { label: "抽牌总次数", val: draws.length },
          { label: "客户案例数", val: cases.length },
          { label: "待复盘数", val: draws.filter(d => d.needReview && !d.reviewed).length + cases.filter(c => !c.reviewed).length },
          { label: "平均准确度", val: avg, sub: "满分 5.0" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-val">{s.val}</div>
            {s.sub && <div className="stat-sub">{s.sub}</div>}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div className="card">
          <div className="sec-head">牌组分布</div>
          {suitDist.length === 0 ? <div style={{ color: "var(--text-3)", fontSize: 12 }}>暂无数据</div> :
            suitDist.map(([s, n]) => (
              <div key={s} className="bar-row">
                <span className="bar-label">{s}</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${(n / cards.length) * 100}%`, background: "var(--gold)" }} /></div>
                <span className="bar-count">{n}</span>
              </div>
            ))}
        </div>
        <div className="card">
          <div className="sec-head">咨询类型分布</div>
          {qtDist.length === 0 ? <div style={{ color: "var(--text-3)", fontSize: 12 }}>暂无案例数据</div> :
            qtDist.map(([t, n]) => (
              <div key={t} className="bar-row">
                <span className="bar-label">{t}</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${(n / cases.length) * 100}%`, background: "var(--amethyst)" }} /></div>
                <span className="bar-count">{n}</span>
              </div>
            ))}
        </div>
      </div>

      {monthly.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="sec-head">近 6 个月记录量</div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 100, paddingTop: 12 }}>
            {monthly.map(([m, v]) => (
              <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 11, color: "var(--gold-bright)", fontFamily: "Cinzel, serif" }}>{v}</span>
                <div style={{ width: "100%", background: "var(--amethyst-dim)", borderRadius: "4px 4px 0 0", height: `${Math.max((v / maxMonth) * 68, 4)}px`, border: "1px solid var(--amethyst)", borderBottom: "none" }} />
                <span style={{ fontSize: 10, color: "var(--text-3)" }}>{m.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {freq.length > 0 && (
        <div className="card">
          <div className="sec-head">出现次数最多的牌 (Top 10)</div>
          {freq.slice(0, 10).map(({ card: c, n }, i) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: i < 9 ? "1px solid var(--border)" : "none" }}>
              <span style={{ fontSize: 11, color: "var(--text-3)", width: 22, flexShrink: 0 }}>#{i + 1}</span>
              <div className="card-chip" style={{ width: 30, height: 48 }}><div className="card-chip-name" style={{ fontSize: 6 }}>{c.name}</div></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Cinzel, serif", fontSize: 13, color: "var(--text)" }}>{c.name}</div>
                {c.enName && <div style={{ fontSize: 10, color: "var(--text-3)" }}>{c.enName}</div>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: `${(n / maxFreq) * 70}px`, height: 6, background: "var(--gold-dim)", borderRadius: 3, transition: "width 0.4s" }} />
                <span style={{ fontFamily: "Cinzel, serif", fontSize: 14, color: "var(--gold)", minWidth: 20, textAlign: "right" }}>{n}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════
function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--void)", color: "var(--text-2)" }}>
      <style>{CSS}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "Cinzel, serif", fontSize: 24, color: "var(--gold)", marginBottom: 12 }}>✦</div>
        <div style={{ fontSize: 12, letterSpacing: "0.15em" }}>加载中...</div>
      </div>
    </div>
  );
}

function AppShell({ cards, draws, cases, setCards, setDraws, setCases, user, signOut, importOffer, importLocalData, dismissImport }) {
  const [page, setPage] = useState("dashboard");
  const [sideOpen, setSideOpen] = useState(false);
  const [gSearch, setGSearch] = useState("");

  const goTo = (p) => { setPage(p); setSideOpen(false); };

  const pendingCount = draws.filter(d => d.needReview && !d.reviewed).length
    + cases.filter(c => !c.reviewed && c.accuracy === "待验证").length;

  const pageTitle = NAVS.find(n => n.id === page)?.label || "";
  const props = { cards, draws, cases, setCards, setDraws, setCases, goTo };
  const email = user?.email || "";
  const shortEmail = email.length > 22 ? email.slice(0, 20) + "…" : email;

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className={`mobile-backdrop ${sideOpen ? "open" : ""}`} onClick={() => setSideOpen(false)} />

        <nav className={`sidebar ${sideOpen ? "open" : ""}`}>
          <div className="logo-area">
            <div className="logo-symbol">✦ ✦ ✦</div>
            <div className="logo-name">牌感日记</div>
            <div className="logo-en">Tarot Journal</div>
          </div>
          <div className="nav-list">
            {NAVS.map(n => (
              <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => goTo(n.id)}>
                <span className="nav-glyph">{n.glyph}</span>
                {n.label}
                {n.id === "review" && pendingCount > 0 && <span className="nav-badge">{pendingCount}</span>}
              </div>
            ))}
          </div>
          <div className="sidebar-foot">
            <div style={{ color: "var(--text-2)", marginBottom: 6 }} title={email}>{shortEmail}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <button className="btn btn-ghost btn-sm" onClick={signOut}>退出</button>
            </div>
            <div style={{ color: "var(--text-3)" }}>数据云端同步</div>
          </div>
        </nav>

        <main className="main">
          <div className="topbar">
            <div className="topbar-left">
              <button className="hamburger" onClick={() => setSideOpen(o => !o)}>☰</button>
              <span style={{ color: "var(--text-3)", fontSize: 13 }}>{NAVS.find(n => n.id === page)?.glyph}</span>
              <span className="topbar-sep">·</span>
              <span className="topbar-page">{pageTitle}</span>
            </div>
            <div className="topbar-right">
              <div className="search-wrap">
                <span className="search-icon">⊗</span>
                <input value={gSearch}
                  onChange={e => setGSearch(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && gSearch.trim()) goTo("search"); }}
                  placeholder="全站检索..." />
              </div>
            </div>
          </div>

          {page === "dashboard" && <Dashboard {...props} />}
          {page === "library"   && <Library   {...props} />}
          {page === "daily"     && <Daily     {...props} />}
          {page === "cases"     && <Cases     {...props} />}
          {page === "review"    && <Review    {...props} />}
          {page === "search"    && <Search key={gSearch} {...props} initialQuery={gSearch} />}
          {page === "stats"     && <Stats     {...props} />}
        </main>
      </div>

      {importOffer && (
        <div className="overlay">
          <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
            <div className="mhead"><span className="mhead-title">导入本地数据</span></div>
            <div className="mbody" style={{ textAlign: "center", padding: "24px" }}>
              <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.8, marginBottom: 8 }}>检测到浏览器中有旧的本地数据（抽牌记录、案例、笔记）。</p>
              <p style={{ fontSize: 11, color: "var(--text-3)" }}>是否导入到云端账户？</p>
            </div>
            <div className="mfoot" style={{ justifyContent: "center" }}>
              <button className="btn btn-ghost" onClick={dismissImport}>跳过</button>
              <button className="btn btn-gold" onClick={importLocalData}>导入</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AppInner({ user, signOut }) {
  const { cards, draws, cases, setCards, setDraws, setCases, loading, importOffer, importLocalData, dismissImport } = useTarotData(user);
  if (loading) return <LoadingScreen />;
  return (
    <AppShell
      cards={cards} draws={draws} cases={cases}
      setCards={setCards} setDraws={setDraws} setCases={setCases}
      user={user} signOut={signOut}
      importOffer={importOffer} importLocalData={importLocalData} dismissImport={dismissImport}
    />
  );
}

export default function App() {
  const { user, loading: authLoading, signOut, supabaseConfigured } = useAuth();
  if (authLoading) return <LoadingScreen />;
  if (!supabaseConfigured || !user) return <><style>{CSS}</style><AuthPage /></>;
  return <AppInner user={user} signOut={signOut} />;
}
