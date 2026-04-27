'use client';

import React, { useState, useEffect } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLE_PHRASES = [
  'Associate Software Engineer',
  'Full-Stack Web & App Developer',
  'UI / UX Designer',
  'DevOps Enthusiast',
  'React & Next.js Craftsman',
  'Problem Solver',
  'Open Source Contributor',
] as const;

const PORTFOLIO_META = 'A portfolio · No. 06 · 2026';

const ROLE_ROTATION_INTERVAL_MS = 2_400;
const CLOCK_UPDATE_INTERVAL_MS  = 1_000;
const DHAKA_TIMEZONE            = 'Asia/Dhaka';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns the current Dhaka time as "BANGLADESH HH:MM:SS".
 * Falls back to "BANGLADESH" on any Intl error.
 */
function getDhakaTimeLabel(): string {
  try {
    const time = new Date().toLocaleTimeString('en-GB', {
      hour:     '2-digit',
      minute:   '2-digit',
      second:   '2-digit',
      timeZone: DHAKA_TIMEZONE,
    });
    return `BANGLADESH  ${time}`;
  } catch {
    return 'BANGLADESH';
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Animated role ticker — slides vertically through ROLE_PHRASES */
function RoleTicker({ activeIndex }: { activeIndex: number }) {
  return (
    <div
      className="h-[1.4em] overflow-hidden font-mono text-[clamp(0.85rem,1vw,1rem)] font-medium tracking-[0.02em] text-[var(--accent)]"
      aria-live="polite"
      aria-label={`Currently: ${ROLE_PHRASES[activeIndex]}`}
    >
      <ul
        className="list-none m-0 p-0 flex flex-col transition-transform duration-600 ease-[var(--ease-out)]"
        style={{ transform: `translateY(-${activeIndex * 1.4}em)` }}
        aria-hidden="true"
      >
        {ROLE_PHRASES.map((role) => (
          <li key={role} className="h-[1.4em] leading-[1.4em] whitespace-nowrap">
            {role}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Status pill showing availability */
function AvailabilityPill() {
  return (
    <span className="status-pill">
      <span className="w-2 h-2 rounded-full bg-[var(--status-online)] relative after:content-[''] after:absolute after:inset-[-3px] after:rounded-full after:border after:border-[var(--status-online)] after:opacity-50 after:animate-[pulseRing_2s_var(--ease-out)_infinite]" />
      Available · Q3 '26
    </span>
  );
}

/** Animated scroll cue — visible on md+ screens */


    
function ScrollCue({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
  
  return (
    <a
      href="#about"
      onClick={onClick}
      aria-label="Scroll to next section"
      className="hidden md:flex flex-col items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
    >
      <div className='flex flex-col'>

      <span className="font-mono text-[0.65rem] uppercase tracking-widest">Scroll</span>
      <div className="flex flex-col justify-end items-end -gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg
            key={i}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="chevron-animate"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        ))}
            </div>
      </div>
    </a>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Hero() {
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  const [clockLabel, setClockLabel]           = useState('');

  // Role rotation & clock — two independent, clearly separated effects
  useEffect(() => {
    const roleTimer = setInterval(
      () => setActiveRoleIndex((prev) => (prev + 1) % ROLE_PHRASES.length),
      ROLE_ROTATION_INTERVAL_MS,
    );
    return () => clearInterval(roleTimer);
  }, []);

  useEffect(() => {
    setClockLabel(getDhakaTimeLabel());
    const clockTimer = setInterval(
      () => setClockLabel(getDhakaTimeLabel()),
      CLOCK_UPDATE_INTERVAL_MS,
    );
    return () => clearInterval(clockTimer);
  }, []);

  /** Smooth-scroll helper used by CTA links */
  const scrollTo = (selector: string, e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-svh pt-[clamp(7rem,14vh,10rem)] pb-12 flex items-stretch overflow-hidden"
    >
      {/* ── Plain background — no blobs, no pointer tracking ── */}
      <div className="absolute inset-0 -z-10 bg-[var(--bg)] pointer-events-none" aria-hidden="true" />

      <div className="max-w-[1400px] mx-auto px-[var(--shell-pad-x)] flex flex-col w-full relative z-10">

        {/* ── Top meta row ── */}
        <div className="flex justify-between items-center gap-4 flex-wrap">

          {/* Left: availability + clock stacked */}
          <div className="flex flex-col gap-1.5">
            <AvailabilityPill />
            <span className="font-mono text-[0.72rem] tracking-[0.16em] text-[var(--text-muted)] uppercase">
              {clockLabel}
            </span>
          </div>

          {/* Right: portfolio meta label */}
          <aside className="flex flex-col items-end gap-[0.85rem] text-right borde">
            <span className="font-mono text-[0.7rem] tracking-[0.22em] uppercase text-[var(--text-muted)]">
              Currently
            </span>
            <RoleTicker activeIndex={activeRoleIndex} />
            <span className="w-px h-16 bg-gradient-to-b from-[var(--accent)] to-transparent" aria-hidden="true" />
          </aside>
        </div>

        {/* ── Editorial body ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-end gap-[clamp(1.5rem,4vw,4rem)] mt-[clamp(3rem,8vh,5rem)] flex-1">

          {/* Name lockup */}
          <div className="min-w-0 overflow-hidden py-4">
            <h1 className="text-[clamp(3.5rem,10vw,8.5rem)] leading-[0.9] font-display font-[350] flex flex-col">
              <span className="[font-variation-settings:'opsz'_144,'SOFT'_30,'WONK'_1] text-[var(--accent)]">.</span>
              <span className="ml-[clamp(1rem,4vw)] italic text-[var(--text-primary)] [font-variation-settings:'opsz'_144,'SOFT'_90,'WONK'_1]">
                {"Mohayminul".split("").map((letter, i) => (
                  <span
                    key={i}
                    className="letter-wave inline-block"
                    style={{ 
                      animationDelay: `${i * 0.08}s`,
                      display: 'inline-block',
                      minWidth: letter === " " ? "0.3em" : "auto"
                    }}
                  >
                    {letter}
                  </span>
                ))}
                <span 
                  className="text-[var(--accent)] letter-wave inline-block" 
                  style={{ 
                    animationDelay: `${"Mohayminul".length * 0.08}s`,
                    display: 'inline-block'
                  }}
                >.</span>
              </span>
            </h1>
          </div>

          {/* Role ticker — right side */}

          <div className="flex flex-col  items-end gap-[0.85rem] text-right">
          <span className="font-mono  text-[0.7rem] tracking-[0.2em] uppercase text-[var(--text-muted)]">
            {PORTFOLIO_META}
            <div className='flex justify-end '>

            <ScrollCue  onClick={(e) => scrollTo('#about', e)} />
            </div>
          </span>
          </div>
          
        </div>

        {/* ── Footer row ── */}
        <div className="mt-[clamp(3rem,8vh,5rem)] grid grid-cols-1 md:grid-cols-[1fr_auto_auto] items-end gap-x-8 gap-y-6 pt-6 border-t border-[var(--line)]">

          {/* Tagline */}
          <p className="m-0 font-display italic text-[clamp(1.05rem,1.4vw,1.35rem)] font-normal leading-[1.55] text-[var(--text-secondary)] max-w-[30ch]">
            <span className="text-[var(--accent)] not-italic font-display text-[1.4em]">"</span>
            Building scalable web apps with Angular, Node & beyond
            <span className="text-[var(--accent)] not-italic font-display text-[1.4em]">"</span>
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              onClick={(e) => scrollTo('#projects', e)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] font-medium transition-transform duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-[var(--accent-soft)]"
            >
              See selected work
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>

            <a
              href="https://docs.google.com/document/d/1Ut6godpffjoHIBBgRMyNo_RtDo3vRdh2bHXuqrfm7wQ/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--line)] text-[var(--text-primary)] font-medium transition-all duration-300 hover:bg-[var(--bg-surface)] hover:border-[var(--line-strong)]"
            >
              Résumé
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </a>
          </div>

          {/* Scroll cue */}
          
        </div>

      </div>
    </section>
  );
}