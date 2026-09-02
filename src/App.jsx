import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGesture } from "@use-gesture/react";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   IAN MUNGWADZI — PORTFOLIO (DARK / CUTTING-MAT / CANVAS)
   The Work section is a pannable/zoomable 2D workshop.
   Everything else scrolls normally.
   ============================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg: #0a0908;
  --bg-alt: #14120f;
  --bg-elev: #1a1815;
  --ink: #f0ede5;
  --ink-2: #a8a29a;
  --ink-3: #6a655e;
  --rule: rgba(240, 237, 229, 0.1);
  --rule-strong: rgba(240, 237, 229, 0.22);
  --grid-fine: rgba(240, 237, 229, 0.035);
  --grid-heavy: rgba(240, 237, 229, 0.09);
  --diagonal: rgba(240, 237, 229, 0.11);
  --accent: #e5651c;
  --accent-hover: #ff7a2b;
  --accent-tint: rgba(229, 101, 28, 0.14);
  --display: 'Space Grotesk', -apple-system, sans-serif;
  --body: 'Inter', -apple-system, sans-serif;
  --mono: 'JetBrains Mono', monospace;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html.lenis, html.lenis body { height: auto; }
.lenis.lenis-smooth { scroll-behavior: auto !important; }
.lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
.lenis.lenis-stopped { overflow: hidden; }
html.modal-open { overflow: hidden; height: 100vh; }

.pro-root {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--body);
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

::selection { background: var(--accent); color: var(--bg); }

/* ---------- Fixed background layers ---------- */
.bg-grid {
  position: fixed; inset: 0; z-index: 0;
  pointer-events: none;
  background-color: var(--bg);
  background-image:
    linear-gradient(var(--grid-heavy) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-heavy) 1px, transparent 1px),
    linear-gradient(var(--grid-fine) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-fine) 1px, transparent 1px);
  background-size: 240px 240px, 240px 240px, 48px 48px, 48px 48px;
}

.bg-mat {
  position: fixed; inset: 0; z-index: 1;
  pointer-events: none;
  transition: opacity 0.2s linear;
}
.bg-mat svg { width: 100%; height: 100%; display: block; }

.reg-mark {
  position: fixed; z-index: 2; pointer-events: none;
  width: 44px; height: 44px;
  border-color: var(--rule-strong);
  font-family: var(--mono); font-size: 9px; letter-spacing: 0.1em;
  color: var(--ink-3);
}
.reg-tl { top: 24px; left: 24px; border-top: 1px solid var(--rule-strong); border-left: 1px solid var(--rule-strong); padding: 6px 0 0 6px; }
.reg-tr { top: 24px; right: 24px; border-top: 1px solid var(--rule-strong); border-right: 1px solid var(--rule-strong); text-align: right; padding: 6px 6px 0 0; }
.reg-bl { bottom: 24px; left: 24px; border-bottom: 1px solid var(--rule-strong); border-left: 1px solid var(--rule-strong); padding: 20px 0 6px 6px; }
.reg-br { bottom: 24px; right: 24px; border-bottom: 1px solid var(--rule-strong); border-right: 1px solid var(--rule-strong); padding: 20px 6px 6px 0; text-align: right; }

@media (max-width: 720px) {
  .reg-mark { display: none; }
}

.scroll-progress {
  position: fixed; top: 0; left: 0; right: 0; height: 2px;
  z-index: 60; background: transparent; pointer-events: none;
}
.scroll-progress .bar {
  height: 100%; background: var(--accent);
  transform-origin: left; transform: scaleX(0);
  box-shadow: 0 0 8px var(--accent);
}

.content { position: relative; z-index: 10; }

.wrap { max-width: 1120px; margin: 0 auto; padding: 0 40px; }
.wrap-narrow { max-width: 780px; margin: 0 auto; padding: 0 40px; }

@media (max-width: 720px) {
  .wrap, .wrap-narrow { padding: 0 24px; }
}

.eyebrow {
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.16em;
  text-transform: uppercase; color: var(--ink-3);
}
.eyebrow .dot {
  display: inline-block; width: 6px; height: 6px;
  background: var(--accent); border-radius: 50%;
  margin-right: 10px; vertical-align: 1px;
  box-shadow: 0 0 8px var(--accent);
}

h1, h2, h3, h4 { font-family: var(--display); font-weight: 600; letter-spacing: -0.015em; color: var(--ink); }

/* ---------- Nav ---------- */
.nav {
  position: fixed; top: 24px; left: 80px; right: 80px; z-index: 40;
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 24px;
  background: rgba(10, 9, 8, 0.75);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--rule);
  transition: border-color 0.2s ease;
}
.nav.scrolled { border-color: var(--rule-strong); }
.nav-logo {
  font-family: var(--display); font-weight: 600; font-size: 14px;
  color: var(--ink); text-decoration: none; letter-spacing: -0.005em;
}
.nav-logo .initials { color: var(--accent); }
.nav-links { display: flex; gap: 24px; align-items: center; }
.nav-links a {
  color: var(--ink-2); text-decoration: none; font-size: 12px; font-weight: 500;
  letter-spacing: 0.03em;
  transition: color 0.15s ease;
}
.nav-links a:hover { color: var(--accent); }
.nav-links .cv-btn {
  border: 1px solid var(--ink); padding: 7px 14px;
  color: var(--ink); font-weight: 500;
  transition: background 0.15s ease, color 0.15s ease;
}
.nav-links .cv-btn:hover { background: var(--ink); color: var(--bg); }

@media (max-width: 900px) { .nav { left: 24px; right: 24px; } }
@media (max-width: 720px) {
  .nav { top: 16px; left: 16px; right: 16px; padding: 12px 16px; }
  .nav-links a:not(.cv-btn) { display: none; }
}

/* ---------- Hero ---------- */
.hero {
  padding: 180px 0 120px;
  border-bottom: 1px solid var(--rule);
  position: relative;
}
.hero-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 80px;
  align-items: end;
}
.hero .eyebrow { margin-bottom: 24px; opacity: 0; }
.status-pill {
  display: inline-flex; align-items: center; gap: 10px;
  background: var(--accent-tint); color: var(--accent);
  padding: 7px 14px; font-size: 11px; font-weight: 500;
  font-family: var(--mono); letter-spacing: 0.05em;
  margin-bottom: 28px;
  border: 1px solid var(--accent-tint);
  opacity: 0;
}
.status-pill .pulse {
  width: 7px; height: 7px; background: var(--accent); border-radius: 50%;
  box-shadow: 0 0 0 0 var(--accent);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(229, 101, 28, 0.6); }
  50% { box-shadow: 0 0 0 8px rgba(229, 101, 28, 0); }
}

.hero-name {
  font-family: var(--display); font-weight: 600;
  font-size: clamp(48px, 8.5vw, 108px);
  line-height: 1;
  letter-spacing: -0.02em;
  margin-bottom: 28px;
  color: var(--ink);
}
.hero-name .word-wrap { display: inline-block; overflow: hidden; padding-bottom: 0.08em; margin-bottom: -0.08em; }
.hero-name .char {
  display: inline-block;
  transform: translateY(105%);
  will-change: transform;
}

.hero .role {
  font-size: clamp(17px, 2vw, 21px);
  color: var(--ink-2); font-weight: 400;
  margin-bottom: 40px; max-width: 640px; line-height: 1.55;
  opacity: 0;
}
.hero .role strong { color: var(--ink); font-weight: 600; }
.hero .meta {
  display: flex; gap: 28px; flex-wrap: wrap;
  font-size: 12px; color: var(--ink-3);
  font-family: var(--mono); letter-spacing: 0.05em;
  padding-top: 24px; border-top: 1px solid var(--rule);
  opacity: 0;
}
.hero .meta span::before {
  content: '';
  display: inline-block; width: 3px; height: 3px; background: var(--ink-3);
  border-radius: 50%; vertical-align: 3px; margin-right: 12px;
}
.hero .meta span:first-child::before { display: none; }

.hero-portrait {
  aspect-ratio: 4 / 5;
  background: var(--bg-alt);
  border: 1px solid var(--rule-strong);
  position: relative; overflow: hidden;
  opacity: 0;
}
.hero-portrait img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  filter: grayscale(0.15);
}
.hero-portrait::before {
  content: 'PORTRAIT / 01'; position: absolute; top: 12px; left: 14px;
  font-family: var(--mono); font-size: 9px; letter-spacing: 0.2em;
  color: var(--ink-3); z-index: 2;
  mix-blend-mode: difference;
}

@media (max-width: 820px) {
  .hero { padding: 140px 0 80px; }
  .hero-grid { grid-template-columns: 1fr; gap: 50px; }
  .hero-portrait { max-width: 280px; aspect-ratio: 1; }
}

/* ---------- Section base ---------- */
.section {
  padding: 140px 0;
  border-bottom: 1px solid var(--rule);
  position: relative;
}
.section-head {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 32px;
  align-items: baseline;
  margin-bottom: 72px;
}
.section-head .num {
  font-family: var(--mono); font-size: 12px; color: var(--accent);
  letter-spacing: 0.15em;
  border-top: 1px solid var(--accent);
  padding-top: 8px;
  opacity: 0;
}
.section-head h2 {
  font-size: clamp(30px, 4.5vw, 46px);
  font-weight: 600; letter-spacing: -0.025em; line-height: 1;
}
.section-head h2 .word-wrap { display: inline-block; overflow: hidden; padding-bottom: 0.12em; margin-bottom: -0.12em; }
.section-head h2 .word {
  display: inline-block; transform: translateY(105%); will-change: transform;
}
.section-head .rule {
  height: 1px; background: var(--rule-strong);
  transform: scaleX(0); transform-origin: left;
  min-width: 100px;
}

@media (max-width: 720px) {
  .section { padding: 90px 0; }
  .section-head { grid-template-columns: 1fr; gap: 16px; margin-bottom: 48px; }
  .section-head .rule { display: none; }
}

/* ---------- About ---------- */
.about-grid { display: grid; grid-template-columns: 1fr 320px; gap: 80px; }
.about-body p {
  font-size: 18px; line-height: 1.65; color: var(--ink);
  margin-bottom: 22px; max-width: 62ch; font-weight: 400;
}
.about-body p:last-child { margin-bottom: 0; }
.about-aside {
  border-left: 1px solid var(--rule); padding-left: 28px;
  font-size: 13px;
}
.about-aside dl { display: grid; gap: 22px; }
.about-aside dt {
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--ink-3); margin-bottom: 6px;
}
.about-aside dd { color: var(--ink); font-weight: 500; }

@media (max-width: 820px) {
  .about-grid { grid-template-columns: 1fr; gap: 40px; }
  .about-aside { border-left: none; border-top: 1px solid var(--rule); padding: 28px 0 0; }
}

/* ============================================================
   WORK CANVAS — the pannable/zoomable workshop
   ============================================================ */

.canvas-container {
  position: relative;
  opacity: 0;
}
.canvas-container.ready { opacity: 1; transition: opacity 0.6s ease; }

.canvas-toolbar {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 14px; flex-wrap: wrap; gap: 12px;
}
.canvas-caption {
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em;
  color: var(--ink-3); text-transform: uppercase;
}
.canvas-caption .k { color: var(--accent); }
.canvas-toolbar .modes {
  display: flex; gap: 0;
}
.canvas-toolbar .modes button {
  background: transparent;
  border: 1px solid var(--rule-strong);
  color: var(--ink-2);
  padding: 6px 12px;
  font-family: var(--mono); font-size: 11px;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  border-right-width: 0;
}
.canvas-toolbar .modes button:last-child { border-right-width: 1px; }
.canvas-toolbar .modes button.active {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--bg);
}
.canvas-toolbar .modes button:hover:not(.active) {
  color: var(--ink);
  border-color: var(--ink-3);
}

.canvas-viewport {
  position: relative;
  width: 100%;
  height: 720px;
  border: 1px solid var(--rule-strong);
  overflow: hidden;
  background: var(--bg-alt);
  cursor: grab;
  touch-action: none;
  -webkit-user-select: none;
  user-select: none;
}
.canvas-viewport.grabbing { cursor: grabbing; }

@media (max-width: 900px) { .canvas-viewport { height: 620px; } }
@media (max-width: 620px) { .canvas-viewport { height: 520px; } }

.canvas-plane {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  transform-origin: 0 0;
  will-change: transform;
  background-image:
    linear-gradient(rgba(240,237,229,0.09) 1px, transparent 1px),
    linear-gradient(90deg, rgba(240,237,229,0.09) 1px, transparent 1px),
    linear-gradient(rgba(240,237,229,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(240,237,229,0.04) 1px, transparent 1px);
  background-size: 240px 240px, 240px 240px, 48px 48px, 48px 48px;
  background-position: 0 0;
}

.canvas-plane::before,
.canvas-plane::after {
  content: '';
  position: absolute;
  width: 1200px; height: 1px;
  background: rgba(240,237,229,0.06);
  transform-origin: 0 0;
  pointer-events: none;
}
.canvas-plane::before {
  left: -600px; top: -400px;
  transform: rotate(15deg);
}
.canvas-plane::after {
  left: -600px; top: -400px;
  transform: rotate(45deg);
}

.canvas-origin {
  position: absolute;
  left: 0; top: 0;
  width: 20px; height: 20px;
  border-left: 1px solid rgba(229,101,28,0.5);
  border-top: 1px solid rgba(229,101,28,0.5);
  pointer-events: none;
}
.canvas-origin::after {
  content: '0,0'; position: absolute;
  top: 4px; left: 6px;
  font-family: var(--mono); font-size: 9px;
  color: rgba(229,101,28,0.7); letter-spacing: 0.1em;
}

.canvas-tile {
  position: absolute;
  background: var(--bg-elev);
  border: 1px solid var(--rule-strong);
  padding: 0;
  cursor: pointer;
  text-align: left;
  color: var(--ink);
  font-family: var(--body);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  width: 340px;
  overflow: hidden;
  opacity: 0;
  will-change: transform, opacity;
}
.canvas-tile.featured { width: 500px; }
.canvas-tile:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(229,101,28,0.08);
}
.canvas-tile:focus-visible {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(229,101,28,0.4);
}

.tile-image {
  aspect-ratio: 16/9;
  overflow: hidden;
  background: var(--bg);
  border-bottom: 1px solid var(--rule);
}
.tile-image img {
  width: 100%; height: 100%; object-fit: cover; display: block;
}
.tile-content { padding: 16px 18px 18px; }
.tile-meta {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  color: var(--ink-3);
  text-transform: uppercase;
  margin-bottom: 8px;
  display: flex; gap: 12px; flex-wrap: wrap;
}
.tile-meta .id { color: var(--accent); }
.tile-content h3 {
  font-size: 19px;
  font-weight: 600;
  margin-bottom: 6px;
  letter-spacing: -0.015em;
  line-height: 1.15;
}
.canvas-tile.featured .tile-content h3 { font-size: 24px; }
.tile-role {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-2);
  letter-spacing: 0.05em;
}

/* Corner marks around tiles (crop marks) */
.canvas-tile::before,
.canvas-tile::after {
  content: '';
  position: absolute;
  width: 12px; height: 12px;
  pointer-events: none;
  opacity: 0.5;
}
.canvas-tile::before {
  top: -6px; left: -6px;
  border-top: 1px solid var(--accent);
  border-left: 1px solid var(--accent);
}
.canvas-tile::after {
  bottom: -6px; right: -6px;
  border-bottom: 1px solid var(--accent);
  border-right: 1px solid var(--accent);
}

/* Canvas controls overlay */
.canvas-controls {
  position: absolute;
  bottom: 16px; right: 16px;
  display: flex; gap: 8px;
  z-index: 10;
}
.canvas-controls button {
  background: rgba(10, 9, 8, 0.85);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--rule-strong);
  color: var(--ink);
  padding: 8px 12px;
  font-family: var(--mono); font-size: 11px;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  min-width: 34px;
}
.canvas-controls button:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.canvas-controls .zoom-group { display: flex; gap: 0; }
.canvas-controls .zoom-group button {
  border-right-width: 0;
}
.canvas-controls .zoom-group button:last-child {
  border-right-width: 1px;
}

.canvas-hint {
  position: absolute;
  top: 16px; left: 16px;
  z-index: 10;
  background: rgba(10, 9, 8, 0.85);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--rule);
  padding: 10px 14px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.05em;
  color: var(--ink-2);
  transition: opacity 0.5s ease;
  pointer-events: none;
  max-width: 90%;
}
.canvas-hint.hidden { opacity: 0; }
.canvas-hint .icn { color: var(--accent); margin-right: 8px; }

.canvas-scale {
  position: absolute;
  bottom: 16px; left: 16px;
  z-index: 10;
  background: rgba(10, 9, 8, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid var(--rule);
  padding: 6px 12px;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--ink-3);
  pointer-events: none;
}
.canvas-scale .v { color: var(--ink); }

/* ---------- Fallback list view ---------- */
.work-list { display: grid; gap: 60px; }
.work-item { display: grid; grid-template-columns: 340px 1fr; gap: 50px; align-items: start; }
.work-item.featured { grid-template-columns: 1fr; gap: 30px; }
.work-media {
  aspect-ratio: 4 / 3;
  background: var(--bg-alt); border: 1px solid var(--rule);
  overflow: hidden;
}
.work-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.work-item.featured .work-media { aspect-ratio: 21 / 9; }
.work-body h3 {
  font-size: 26px; margin-bottom: 8px; font-weight: 600;
  letter-spacing: -0.015em;
}
.work-item.featured .work-body h3 { font-size: 34px; }
.work-body .work-meta {
  display: flex; gap: 18px; flex-wrap: wrap;
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em;
  color: var(--ink-3); text-transform: uppercase;
  margin-bottom: 20px;
}
.work-body .work-meta .role { color: var(--accent); }
.work-body p {
  color: var(--ink-2); line-height: 1.7; margin-bottom: 14px;
  max-width: 62ch; font-size: 15px;
}
.work-body p:last-of-type { margin-bottom: 24px; }
.work-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.work-tag {
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.08em;
  color: var(--ink-2); border: 1px solid var(--rule-strong);
  padding: 5px 11px;
}
@media (max-width: 820px) {
  .work-list { gap: 50px; }
  .work-item { grid-template-columns: 1fr; gap: 24px; }
}

/* ============================================================
   PROJECT MODAL
   ============================================================ */

.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(10, 9, 8, 0.88);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  animation: overlay-in 0.25s ease forwards;
}
@keyframes overlay-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background: var(--bg);
  border: 1px solid var(--rule-strong);
  max-width: 960px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: modal-in 0.35s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
  transform: translateY(20px);
  opacity: 0;
}
@keyframes modal-in {
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  position: sticky; top: 0; z-index: 5;
  background: rgba(10, 9, 8, 0.9);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  padding: 14px 20px;
  border-bottom: 1px solid var(--rule);
  display: flex; justify-content: space-between; align-items: center;
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em;
  color: var(--ink-3); text-transform: uppercase;
}
.modal-header .id { color: var(--accent); }

.modal-close {
  background: transparent;
  border: 1px solid var(--rule-strong);
  color: var(--ink);
  width: 32px; height: 32px;
  cursor: pointer;
  font-family: var(--mono); font-size: 14px;
  line-height: 1;
  transition: border-color 0.15s ease, color 0.15s ease;
  display: flex; align-items: center; justify-content: center;
}
.modal-close:hover { border-color: var(--accent); color: var(--accent); }

.modal-image {
  aspect-ratio: 21/9;
  overflow: hidden;
  border-bottom: 1px solid var(--rule);
}
.modal-image img {
  width: 100%; height: 100%; object-fit: cover; display: block;
}

.modal-content { padding: 48px; }
.modal-content .work-meta {
  display: flex; gap: 18px; flex-wrap: wrap;
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em;
  color: var(--ink-3); text-transform: uppercase;
  margin-bottom: 24px;
}
.modal-content .work-meta .role { color: var(--accent); }
.modal-content h2 {
  font-size: clamp(28px, 4vw, 40px);
  margin-bottom: 28px;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.1;
}
.modal-content p {
  color: var(--ink-2);
  font-size: 16px;
  line-height: 1.7;
  margin-bottom: 18px;
  max-width: 66ch;
}
.modal-content .work-tags {
  margin-top: 32px; padding-top: 24px;
  border-top: 1px solid var(--rule);
  display: flex; flex-wrap: wrap; gap: 8px;
}

@media (max-width: 620px) {
  .modal-content { padding: 32px 24px; }
  .modal-header { padding: 12px 16px; }
}

/* ---------- Capabilities ---------- */
.caps-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 48px 80px;
}
.cap-group h3 {
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--accent);
  padding-bottom: 14px; border-bottom: 1px solid var(--rule-strong);
  margin-bottom: 18px; font-weight: 500;
}
.cap-group ul { list-style: none; }
.cap-group li {
  padding: 10px 0; color: var(--ink); font-size: 15px;
  border-bottom: 1px solid var(--rule);
  display: flex; align-items: baseline; gap: 12px;
}
.cap-group li:last-child { border-bottom: none; }
.cap-group li .name { font-weight: 500; }
.cap-group li .sub { color: var(--ink-3); font-size: 12px; font-family: var(--mono); letter-spacing: 0.02em; }

@media (max-width: 620px) {
  .caps-grid { grid-template-columns: 1fr; gap: 40px; }
}

/* ---------- Timeline ---------- */
.timeline { position: relative; padding-left: 20px; }
.tl-item {
  display: grid; grid-template-columns: 160px 1fr;
  gap: 48px; padding: 28px 0; border-top: 1px solid var(--rule);
  position: relative;
}
.tl-item::before {
  content: ''; position: absolute; left: -20px; top: 36px;
  width: 13px; height: 13px; background: var(--bg);
  border: 2px solid var(--accent); transform: rotate(45deg) scale(0);
  transform-origin: center;
}
.tl-item:last-child { border-bottom: 1px solid var(--rule); }
.tl-when {
  font-family: var(--mono); font-size: 12px; letter-spacing: 0.06em;
  color: var(--ink-3);
}
.tl-body h3 { font-size: 19px; margin-bottom: 6px; font-weight: 600; letter-spacing: -0.01em; }
.tl-body .org { color: var(--accent); font-size: 13px; font-weight: 500; margin-bottom: 10px; font-family: var(--mono); letter-spacing: 0.02em; }
.tl-body p { color: var(--ink-2); font-size: 14px; max-width: 62ch; line-height: 1.65; }

@media (max-width: 620px) {
  .tl-item { grid-template-columns: 1fr; gap: 8px; }
}

/* ---------- Writing ---------- */
.writing-card {
  border: 1px solid var(--rule-strong); padding: 40px;
  display: grid; grid-template-columns: 1fr auto; gap: 40px;
  align-items: center;
  background: var(--bg-alt);
  transition: border-color 0.2s ease, background 0.2s ease;
}
.writing-card:hover { border-color: var(--accent); background: var(--bg-elev); }
.writing-card .tag {
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.18em;
  color: var(--accent); text-transform: uppercase; margin-bottom: 10px;
}
.writing-card h3 { font-size: 24px; margin-bottom: 10px; font-weight: 600; letter-spacing: -0.015em; }
.writing-card p { color: var(--ink-2); font-size: 14px; max-width: 60ch; line-height: 1.65; }
.writing-card .cta {
  color: var(--ink); text-decoration: none; font-size: 12px; font-weight: 500;
  border: 1px solid var(--ink); padding: 12px 22px;
  transition: all 0.15s ease; white-space: nowrap;
  letter-spacing: 0.05em;
}
.writing-card .cta:hover { background: var(--accent); border-color: var(--accent); color: var(--bg); }

@media (max-width: 620px) {
  .writing-card { grid-template-columns: 1fr; padding: 28px; }
}

/* ---------- Contact ---------- */
.contact {
  padding: 140px 0;
  background: var(--bg-alt);
  border-bottom: 1px solid var(--rule);
  position: relative;
}
.contact-inner { max-width: 820px; margin: 0 auto; padding: 0 40px; }
.contact h2 {
  font-size: clamp(44px, 7vw, 76px); font-weight: 600;
  letter-spacing: -0.025em; margin-bottom: 28px; line-height: 1;
  color: var(--ink);
}
.contact h2 .accent { color: var(--accent); }
.contact h2 .word-wrap { display: inline-block; overflow: hidden; padding-bottom: 0.1em; margin-bottom: -0.1em; }
.contact h2 .word { display: inline-block; transform: translateY(105%); will-change: transform; }
.contact-body {
  color: var(--ink-2); font-size: 18px; line-height: 1.65;
  max-width: 56ch; margin-bottom: 50px;
}
.contact-methods { display: grid; gap: 0; }
.contact-method {
  display: grid; grid-template-columns: 140px 1fr auto;
  gap: 28px; padding: 24px 0;
  border-top: 1px solid var(--rule-strong);
  color: var(--ink); text-decoration: none; align-items: center;
  transition: padding 0.25s ease, background 0.15s ease;
}
.contact-method:last-child { border-bottom: 1px solid var(--rule-strong); }
.contact-method:hover { padding-left: 16px; background: linear-gradient(90deg, var(--accent-tint), transparent 40%); }
.contact-method:hover .cm-arrow { transform: translateX(6px); color: var(--accent); }
.contact-method .cm-label {
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.15em;
  text-transform: uppercase; color: var(--ink-3);
}
.contact-method .cm-value { font-size: 17px; font-weight: 500; }
.contact-method .cm-arrow {
  font-family: var(--mono); color: var(--ink-3); font-size: 18px;
  transition: transform 0.25s ease, color 0.15s ease;
}

@media (max-width: 720px) {
  .contact { padding: 90px 0; }
  .contact-method { grid-template-columns: 1fr auto; }
  .contact-method .cm-label { grid-column: 1 / -1; margin-bottom: 4px; }
}

/* ---------- Footer ---------- */
.footer {
  padding: 50px 0 70px;
  font-size: 12px; color: var(--ink-3);
  font-family: var(--mono); letter-spacing: 0.03em;
}
.footer-inner {
  display: flex; justify-content: space-between; gap: 30px; flex-wrap: wrap;
}
.footer a { color: var(--ink-2); text-decoration: none; border-bottom: 1px solid var(--rule); }
.footer a:hover { color: var(--accent); border-bottom-color: var(--accent); }
.eva-easter a { color: var(--ink-3); border-bottom: 1px dotted var(--rule); }

/* ---------- Reduced motion ---------- */
@media (prefers-reduced-motion: reduce) {
  .hero-name .char { transform: none; }
  .section-head h2 .word { transform: none; }
  .contact h2 .word { transform: none; }
  .section-head .num, .hero .eyebrow, .status-pill, .hero .role, .hero .meta, .hero-portrait, .section-head .rule, .tl-item::before, .canvas-container, .canvas-tile { opacity: 1; transform: none !important; }
  .status-pill .pulse { animation: none; }
  .modal, .modal-overlay { animation: none; opacity: 1; transform: none; }
}
`;

/* ============================================================
   CONTENT
   ============================================================ */

const ABOUT = [
  "I'm a final-year Mechanical Engineering student at Northumbria University and Team Principal of the university's debut Formula Student programme. My work sits at the intersection of engineering design, race-side data analysis, and multidisciplinary team leadership.",
  "I'm most at home in the loop between simulation and physical validation — CAD in SolidWorks and Fusion 360, structural work in ABAQUS, data pipelines in Python and MATLAB, and setup decisions made at the trackside with telemetry in front of me.",
  "Targeting graduate race engineering roles for the 2027 intake. Based in Newcastle-upon-Tyne, open to relocating.",
];

const WORK = [
  {
    id: "01",
    featured: true,
    image: "/images/formula-student.jpg",
    canvasX: 0,
    canvasY: 0,
    title: "Northumbria Formula Student",
    role: "Team Principal",
    period: "2025 — Present",
    body: [
      "Founding leadership of Northumbria University's debut Formula Student campaign. Responsible for engineering direction, sponsorship acquisition, and operational deliverables across a multidisciplinary team spanning chassis, powertrain, aerodynamics, electronics, and business.",
      "Building the team's technical baseline from scratch — component selection, design reviews, budget modelling, and the sponsorship pipeline needed to fund it. Working towards FSUK competition readiness.",
    ],
    tags: ["Team Leadership", "SolidWorks", "Project Management", "Sponsorship"],
  },
  {
    id: "02",
    image: "/images/rap-riders.jpg",
    canvasX: 620,
    canvasY: -80,
    title: "RAP Riders Academy",
    role: "Pit Crew / Race Engineer",
    period: "2024",
    body: [
      "Supported rider Hudson Kai Cooper across the Teesside legs of the FIM MiniGP and FreeTech Endurance Junior Talent Cup.",
      "Analysed rider telemetry — GPS traces, throttle and brake application, lap times and sector splits — to identify performance trends and inform race strategy. Adjusted suspension, gearing, and tyre setup in response to live data and rider feedback, improving competitiveness across multiple race weekends.",
    ],
    tags: ["Telemetry", "Data Analysis", "Race Setup", "Live Ops"],
  },
  {
    id: "03",
    image: "/images/lm-wind-power.jpg",
    canvasX: -520,
    canvasY: 360,
    title: "LM Wind Power × GE Renewable Energy",
    role: "Design Engineer Intern",
    period: "2021 — 2022",
    body: [
      "Remote design engineering placement delivered through the Industrial Cadets programme, culminating in a Gold award.",
      "Interpreted finite element stress simulations of wind turbine blade components and recommended design and material changes to improve product lifecycle. Presented findings to a mixed audience of engineers and programme sponsors.",
    ],
    tags: ["FEA", "Materials", "Simulation", "Technical Communication"],
  },
  {
    id: "04",
    image: "/images/papaya-turn-one.jpg",
    canvasX: 560,
    canvasY: 380,
    title: "Papaya Turn One",
    role: "Co-Founder / Director",
    period: "2021 — 2025",
    body: [
      "Co-founded a small motorsport media company and racing team, grown from the QE Motorsport society. Directed brand identity, media output, and early operational strategy.",
      "Working towards the establishment of the UK's first dedicated student racing team — a longer-term project running alongside Formula Student.",
    ],
    tags: ["Motorsport", "Media", "Strategy"],
  },
];

const CAPABILITIES = [
  {
    group: "Engineering & Simulation",
    items: [
      { name: "SolidWorks", sub: "CAD, part & assembly modelling" },
      { name: "Fusion 360", sub: "CAD, generative design" },
      { name: "ABAQUS", sub: "finite element analysis" },
      { name: "MATLAB", sub: "modelling, signal processing" },
    ],
  },
  {
    group: "Programming & Data",
    items: [
      { name: "Python", sub: "data pipelines, analysis, tooling" },
      { name: "C#", sub: "application development" },
      { name: "Data analysis", sub: "telemetry, statistics" },
      { name: "Git / GitHub", sub: "version control, collaboration" },
    ],
  },
  {
    group: "Motorsport",
    items: [
      { name: "Telemetry analysis", sub: "GPS, sector, driver inputs" },
      { name: "Race strategy", sub: "live decision-making" },
      { name: "Setup development", sub: "suspension, gearing, tyres" },
      { name: "Trackside ops", sub: "pit crew experience" },
    ],
  },
  {
    group: "Qualifications & Affiliations",
    items: [
      { name: "Motorsport UK", sub: "Race Marshal" },
      { name: "Industrial Cadet", sub: "Gold level" },
      { name: "IMechE", sub: "Student Member" },
      { name: "EDT", sub: "Most Innovative Project" },
    ],
  },
];

const TIMELINE = [
  { when: "2025 — Present", title: "Team Principal — Formula Student", org: "Northumbria University", body: "Leading the university's debut Formula Student campaign end-to-end." },
  { when: "2023 — Present", title: "BEng Mechanical Engineering", org: "Northumbria University, Newcastle-upon-Tyne", body: "Statics & dynamics, thermodynamics, applied engineering approaches, engineering project management. Student member of the IMechE." },
  { when: "2024", title: "Pit Crew / Race Engineer", org: "RAP Riders Academy", body: "Telemetry analysis and setup work supporting a junior rider across FIM MiniGP and FreeTech Endurance Junior Talent Cup weekends." },
  { when: "2021 — 2025", title: "Co-Founder / Director", org: "Papaya Turn One", body: "Motorsport media company and racing team, grown from the QE Motorsport society." },
  { when: "2021 — 2022", title: "Design Engineer Intern", org: "LM Wind Power / GE Renewable Energy", body: "Remote FEA-driven design work via the Industrial Cadets programme." },
  { when: "2021 — 2023", title: "A-Levels — Chemistry, Physics, Computer Science", org: "Queen Elizabeth Sixth Form College, Darlington", body: "Industrial Cadet Gold. Team awarded Most Innovative Project by EDT. President of QE Radio and QE Motorsport." },
];

/* ============================================================
   HELPERS
   ============================================================ */

function SplitChars({ text }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, wi) => (
        <span className="word-wrap" key={wi}>
          {word.split("").map((c, ci) => (
            <span className="char" key={ci}>{c}</span>
          ))}
          {wi < words.length - 1 && <span className="char">&nbsp;</span>}
        </span>
      ))}
    </>
  );
}

function SplitWords({ text }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span className="word-wrap" key={i}>
          <span className="word">{word}{i < words.length - 1 && "\u00A0"}</span>
        </span>
      ))}
    </>
  );
}

/* ============================================================
   WORK CANVAS COMPONENT
   ============================================================ */

const MIN_SCALE = 0.4;
const MAX_SCALE = 2;
const ZOOM_STEP = 1.25;

function computeInitialTransform(viewport) {
  const isSmall = window.innerWidth < 720;
  return {
    x: viewport.offsetWidth / 2,
    y: viewport.offsetHeight / 2,
    scale: isSmall ? 0.45 : 0.7,
  };
}

function WorkCanvas({ projects, onOpenProject }) {
  const [transform, setTransform] = useState({ x: 400, y: 300, scale: 0.7 });
  const [hintVisible, setHintVisible] = useState(true);
  const [grabbing, setGrabbing] = useState(false);
  const viewportRef = useRef(null);
  const containerRef = useRef(null);
  const readyRef = useRef(false);

  // Initialize view once viewport is measured
  useEffect(() => {
    if (!viewportRef.current) return;
    setTransform(computeInitialTransform(viewportRef.current));
    readyRef.current = true;
    if (containerRef.current) containerRef.current.classList.add("ready");
  }, []);

  // Reveal tiles on scroll into view
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set(".canvas-tile", { opacity: 1 });
      return;
    }
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 75%",
      once: true,
      onEnter: () => {
        gsap.to(".canvas-tile", {
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "power2.out",
          delay: 0.2,
        });
      },
    });
    return () => st.kill();
  }, []);

  // Hide hint after first interaction
  const dismissHint = () => setHintVisible(false);

  // Gesture handling
  useGesture(
    {
      onDragStart: () => {
        setGrabbing(true);
        dismissHint();
      },
      onDrag: ({ movement: [mx, my], memo }) => {
        const start = memo || { x: transform.x, y: transform.y };
        setTransform((t) => ({ ...t, x: start.x + mx, y: start.y + my }));
        return start;
      },
      onDragEnd: () => setGrabbing(false),
      onPinch: ({ offset: [s] }) => {
        dismissHint();
        setTransform((t) => ({ ...t, scale: s }));
      },
      onWheel: ({ delta: [, dy], event }) => {
        if (event.cancelable) event.preventDefault();
        setTransform((t) => ({
          ...t,
          scale: Math.max(MIN_SCALE, Math.min(MAX_SCALE, t.scale - dy * 0.0015)),
        }));
      },
    },
    {
      target: viewportRef,
      eventOptions: { passive: false },
      drag: { filterTaps: true, threshold: 3 },
      pinch: { scaleBounds: { min: MIN_SCALE, max: MAX_SCALE }, from: () => [transform.scale, 0] },
    }
  );

  const resetView = () => {
    if (!viewportRef.current) return;
    setTransform(computeInitialTransform(viewportRef.current));
  };

  const zoomIn = () =>
    setTransform((t) => ({ ...t, scale: Math.min(MAX_SCALE, t.scale * ZOOM_STEP) }));
  const zoomOut = () =>
    setTransform((t) => ({ ...t, scale: Math.max(MIN_SCALE, t.scale / ZOOM_STEP) }));

  return (
    <div className="canvas-container" ref={containerRef}>
      <div className="canvas-toolbar">
        <div className="canvas-caption">
          <span className="k">§</span> Workshop view · {projects.length} projects
        </div>
      </div>

      <div
        className={`canvas-viewport ${grabbing ? "grabbing" : ""}`}
        ref={viewportRef}
        data-lenis-prevent
      >
        <div
          className={`canvas-hint ${!hintVisible ? "hidden" : ""}`}
          aria-hidden="true"
        >
          <span className="icn">◇</span>
          Drag to pan · Pinch or scroll to zoom · Click a tile for details
        </div>

        <div className="canvas-scale">
          Scale <span className="v">{(transform.scale * 100).toFixed(0)}%</span>
        </div>

        <div className="canvas-controls">
          <button onClick={resetView} title="Reset view">RESET</button>
          <div className="zoom-group">
            <button onClick={zoomOut} aria-label="Zoom out">−</button>
            <button onClick={zoomIn} aria-label="Zoom in">+</button>
          </div>
        </div>

        <div
          className="canvas-plane"
          style={{
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
          }}
        >
          <div className="canvas-origin" />
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`canvas-tile ${p.featured ? "featured" : ""}`}
              style={{
                left: `${p.canvasX}px`,
                top: `${p.canvasY}px`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => onOpenProject(p)}
              aria-label={`Open project: ${p.title}`}
            >
              <div className="tile-image">
                <img src={p.image} alt="" />
              </div>
              <div className="tile-content">
                <div className="tile-meta">
                  <span className="id">N°{p.id}</span>
                  <span>{p.period}</span>
                </div>
                <h3>{p.title}</h3>
                <div className="tile-role">{p.role}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PROJECT MODAL
   ============================================================ */

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return;
    document.documentElement.classList.add("modal-open");
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.classList.remove("modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>
            <span className="id">N°{project.id}</span> · {project.role} · {project.period}
          </span>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="modal-image">
          <img src={project.image} alt={project.title} />
        </div>
        <div className="modal-content">
          <h2 id="modal-title">{project.title}</h2>
          {project.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <div className="work-tags">
            {project.tags.map((t) => (
              <span className="work-tag" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function Portfolio() {
  const rootRef = useRef(null);
  const navRef = useRef(null);
  const matRef = useRef(null);
  const progressRef = useRef(null);
  const [openProject, setOpenProject] = useState(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis;
    if (!reduce) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    const onScroll = () => {
      if (navRef.current) navRef.current.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Hero reveal
    if (!reduce) {
      const tl = gsap.timeline({ delay: 0.2 });
      tl.to(".hero .eyebrow", { opacity: 1, duration: 0.6, ease: "power2.out" })
        .to(".status-pill", { opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.3")
        .to(".hero-name .char", { y: 0, duration: 0.9, stagger: 0.025, ease: "expo.out" }, "-=0.2")
        .to(".hero .role", { opacity: 1, duration: 0.7, ease: "power2.out" }, "-=0.5")
        .to(".hero .meta", { opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.4")
        .to(".hero-portrait", { opacity: 1, duration: 1, ease: "power2.out" }, "-=0.8");
    } else {
      gsap.set(".hero-name .char, .hero .eyebrow, .status-pill, .hero .role, .hero .meta, .hero-portrait", { opacity: 1, y: 0 });
    }

    // Section header reveals
    document.querySelectorAll(".section-head").forEach((head) => {
      const words = head.querySelectorAll("h2 .word");
      const num = head.querySelector(".num");
      const rule = head.querySelector(".rule");

      if (reduce) {
        gsap.set([words, num, rule], { opacity: 1, y: 0, scaleX: 1 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: head,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });
      tl.to(num, { opacity: 1, duration: 0.5, ease: "power2.out" })
        .to(words, { y: 0, duration: 0.85, stagger: 0.08, ease: "expo.out" }, "-=0.35")
        .to(rule, { scaleX: 1, duration: 0.8, ease: "power2.out" }, "-=0.6");
    });

    // Contact heading
    if (!reduce) {
      gsap.to(".contact h2 .word", {
        y: 0, duration: 0.95, stagger: 0.08, ease: "expo.out",
        scrollTrigger: { trigger: ".contact h2", start: "top 80%", toggleActions: "play none none reverse" },
      });
    } else {
      gsap.set(".contact h2 .word", { y: 0 });
    }

    // Timeline items reveal
    if (!reduce) {
      gsap.utils.toArray(".tl-item").forEach((item) => {
        gsap.fromTo(item,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 85%", toggleActions: "play none none reverse" },
          }
        );
        gsap.to(item.querySelector("::before"), {
          scrollTrigger: { trigger: item, start: "top 80%", toggleActions: "play none none reverse" },
        });
      });
    }

    // Cutting mat fade
    if (matRef.current && !reduce) {
      gsap.to(matRef.current, {
        opacity: 0, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.5 },
      });
    }

    // Scroll progress
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.1 },
      });
    }

    // Generic reveals
    if (!reduce) {
      gsap.utils.toArray(".reveal-up").forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
          }
        );
      });
    } else {
      gsap.set(".reveal-up", { opacity: 1, y: 0 });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      ScrollTrigger.getAll().forEach((st) => st.kill());
      if (lenis) lenis.destroy();
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, []);

  return (
    <div className="pro-root" ref={rootRef}>
      <style>{CSS}</style>

      <div className="bg-grid" />
      <div className="bg-mat" ref={matRef}>
        <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <g stroke="rgba(240,237,229,0.13)" strokeWidth="1" fill="none">
            <line x1="0" y1="0" x2="1600" y2="428" />
            <line x1="0" y1="0" x2="1600" y2="924" />
            <line x1="0" y1="0" x2="1000" y2="1000" />
            <line x1="0" y1="0" x2="577" y2="1000" />
            <line x1="0" y1="0" x2="268" y2="1000" />
          </g>
          <g stroke="rgba(240,237,229,0.07)" strokeWidth="1" fill="none">
            <line x1="1600" y1="0" x2="0" y2="428" />
            <line x1="1600" y1="0" x2="600" y2="1000" />
            <line x1="1600" y1="0" x2="1023" y2="1000" />
          </g>
          <g stroke="rgba(240,237,229,0.28)" strokeWidth="1">
            {Array.from({ length: 33 }).map((_, i) => {
              const x = i * 48;
              const h = i % 5 === 0 ? 14 : 6;
              return <line key={i} x1={x} y1="0" x2={x} y2={h} />;
            })}
          </g>
          <g stroke="rgba(240,237,229,0.28)" strokeWidth="1">
            {Array.from({ length: 21 }).map((_, i) => {
              const y = i * 48;
              const w = i % 5 === 0 ? 14 : 6;
              return <line key={i} x1="0" y1={y} x2={w} y2={y} />;
            })}
          </g>
          <text x="24" y="42" fontFamily="'JetBrains Mono', monospace" fontSize="10" fill="rgba(240,237,229,0.4)" letterSpacing="1.5">
            A1 / SCALE 1:1
          </text>
        </svg>
      </div>

      <div className="reg-mark reg-tl">01</div>
      <div className="reg-mark reg-tr">A / EN-GB</div>
      <div className="reg-mark reg-bl">v2.0</div>
      <div className="reg-mark reg-br">© 2026</div>

      <div className="scroll-progress"><div className="bar" ref={progressRef} /></div>

      <nav className="nav" ref={navRef}>
        <a href="#top" className="nav-logo">
          <span className="initials">IM</span>&nbsp;&nbsp;Ian Mungwadzi
        </a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#experience">Experience</a>
          <a href="#writing">Writing</a>
          <a href="#contact">Contact</a>
          <a href="/cv.pdf" className="cv-btn" download>CV ↓</a>
        </div>
      </nav>

      <main className="content" id="top">
        <header className="hero">
          <div className="wrap">
            <div className="hero-grid">
              <div>
                <div className="eyebrow"><span className="dot" />Portfolio / 2026</div>
                <div style={{ height: 20 }} />
                <div className="status-pill">
                  <span className="pulse" />Available — graduate roles, 2027 intake
                </div>
                <h1 className="hero-name">
                  <SplitChars text="Ian" />
                  <br />
                  <SplitChars text="Mungwadzi" />
                </h1>
                <p className="role">
                  <strong>Mechanical engineering</strong>, final year at Northumbria University.
                  Team Principal of Northumbria's debut Formula Student programme. Design, simulation,
                  and race-side data analysis.
                </p>
                <div className="meta">
                  <span>BEng Mechanical Engineering</span>
                  <span>Newcastle-upon-Tyne, UK</span>
                  <span>Open to relocation</span>
                </div>
              </div>
              <div className="hero-portrait">
                <img src="/images/headshot.jpg" alt="Ian Mungwadzi" />
              </div>
            </div>
          </div>
        </header>

        <section className="section" id="about">
          <div className="wrap">
            <div className="section-head">
              <span className="num">§01</span>
              <h2><SplitWords text="About" /></h2>
              <span className="rule" />
            </div>
            <div className="about-grid reveal-up">
              <div className="about-body">
                {ABOUT.map((p, i) => <p key={i}>{p}</p>)}
              </div>
              <aside className="about-aside">
                <dl>
                  <div><dt>Currently</dt><dd>Final year, BEng Mechanical Engineering</dd></div>
                  <div><dt>Leading</dt><dd>Northumbria Formula Student</dd></div>
                  <div><dt>Seeking</dt><dd>Race engineering, 2027 graduate intake</dd></div>
                  <div><dt>Based</dt><dd>Newcastle-upon-Tyne, UK</dd></div>
                </dl>
              </aside>
            </div>
          </div>
        </section>

        <section className="section" id="work">
          <div className="wrap">
            <div className="section-head">
              <span className="num">§02</span>
              <h2><SplitWords text="Selected work" /></h2>
              <span className="rule" />
            </div>
            <WorkCanvas projects={WORK} onOpenProject={setOpenProject} />
          </div>
        </section>

        <section className="section" id="capabilities">
          <div className="wrap">
            <div className="section-head">
              <span className="num">§03</span>
              <h2><SplitWords text="Capabilities" /></h2>
              <span className="rule" />
            </div>
            <div className="caps-grid reveal-up">
              {CAPABILITIES.map((c) => (
                <div className="cap-group" key={c.group}>
                  <h3>{c.group}</h3>
                  <ul>
                    {c.items.map((it) => (
                      <li key={it.name}>
                        <span className="name">{it.name}</span>
                        <span className="sub">— {it.sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="experience">
          <div className="wrap">
            <div className="section-head">
              <span className="num">§04</span>
              <h2><SplitWords text="Experience & Education" /></h2>
              <span className="rule" />
            </div>
            <div className="timeline">
              {TIMELINE.map((t, i) => (
                <div className="tl-item" key={i}>
                  <div className="tl-when">{t.when}</div>
                  <div className="tl-body">
                    <h3>{t.title}</h3>
                    <div className="org">{t.org}</div>
                    <p>{t.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="writing">
          <div className="wrap">
            <div className="section-head">
              <span className="num">§05</span>
              <h2><SplitWords text="Writing" /></h2>
              <span className="rule" />
            </div>
            <div className="writing-card reveal-up">
              <div>
                <div className="tag">Essay — Draft</div>
                <h3>A War By Any Other Name</h3>
                <p>
                  An essay on grey zone warfare — the space between diplomacy and open conflict where
                  modern state competition increasingly takes place. Examines contemporary case studies
                  and the policy responses they invite.
                </p>
              </div>
              <a href="/writing/a-war-by-any-other-name.pdf" className="cta" target="_blank" rel="noreferrer">Read (PDF) →</a>
            </div>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="contact-inner">
            <h2>
              <SplitWords text="Let's" /> <span className="accent"><SplitWords text="talk." /></span>
            </h2>
            <p className="contact-body reveal-up">
              I'm actively looking for graduate race engineering opportunities for the 2027 intake,
              and open to conversations about internships, projects, or anything adjacent.
              The quickest way to reach me is by email.
            </p>
            <div className="contact-methods reveal-up">
              <a className="contact-method" href="mailto:me@ianmungwadzi.com">
                <span className="cm-label">Email</span>
                <span className="cm-value">me@ianmungwadzi.com</span>
                <span className="cm-arrow">→</span>
              </a>
              <a className="contact-method" href="https://www.linkedin.com/in/ian-mungwadzi-/" target="_blank" rel="noreferrer">
                <span className="cm-label">LinkedIn</span>
                <span className="cm-value">/in/ian-mungwadzi-</span>
                <span className="cm-arrow">↗</span>
              </a>
              <a className="contact-method" href="https://github.com/Ian-Mungwadzi" target="_blank" rel="noreferrer">
                <span className="cm-label">GitHub</span>
                <span className="cm-value">/Ian-Mungwadzi</span>
                <span className="cm-arrow">↗</span>
              </a>
              <a className="contact-method" href="/cv.pdf" download>
                <span className="cm-label">CV</span>
                <span className="cm-value">Download PDF</span>
                <span className="cm-arrow">↓</span>
              </a>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="wrap">
            <div className="footer-inner">
              <div>
                © 2026 Ian Mungwadzi — Built with <a href="https://react.dev" target="_blank" rel="noreferrer">React</a>, <a href="https://gsap.com" target="_blank" rel="noreferrer">GSAP</a> and <a href="https://vercel.com" target="_blank" rel="noreferrer">Vercel</a>.
              </div>
              <div className="eva-easter">
                <a href="https://eva.ianmungwadzi.com" target="_blank" rel="noreferrer">
                  → Also: a stylised variant of this site (弐号機)
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
    </div>
  );
}
