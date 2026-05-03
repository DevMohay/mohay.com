'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import bgImage from '../../public/Picture.jpg'

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
const NAME_TEXT = 'Mohayminul';

const ROLE_ROTATION_INTERVAL_MS = 2_400;
const CLOCK_UPDATE_INTERVAL_MS  = 1_000;
const DHAKA_TIMEZONE            = 'Asia/Dhaka';

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function AvailabilityPill() {
  return (
    <span className="status-pill">
      <span className="w-2 h-2 rounded-full bg-[var(--status-online)] relative after:content-[''] after:absolute after:inset-[-3px] after:rounded-full after:border after:border-[var(--status-online)] after:opacity-50 after:animate-[pulseRing_2s_var(--ease-out)_infinite]" />
      Available · Q3 '26
    </span>
  );
}

function ScrollCue({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
  return (
    <a
      href="#about"
      onClick={onClick}
      aria-label="Scroll to next section"
      className="hidden md:flex flex-col items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
    >
      <div className="flex flex-col">
        <span className="font-mono text-[0.65rem] uppercase tracking-widest">Scroll</span>
        <div className="flex flex-col justify-end items-end">
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

  // ── Refs for GSAP targets ──
  const nameRef        = useRef<HTMLHeadingElement>(null);
  const nameSpanRef    = useRef<HTMLSpanElement>(null);
  const charRefs       = useRef<(HTMLSpanElement | null)[]>([]);
  const leadDotRef     = useRef<HTMLSpanElement>(null);
  const trailDotRef    = useRef<HTMLSpanElement>(null);
  const dotRef         = useRef<HTMLSpanElement>(null);
  const pillRef        = useRef<HTMLDivElement>(null);
  const clockRef       = useRef<HTMLSpanElement>(null);
  const metaRef        = useRef<HTMLElement>(null);
  const bottomRightMetaRef = useRef<HTMLDivElement>(null);
  const taglineRef     = useRef<HTMLParagraphElement>(null);
  const ctaRef         = useRef<HTMLDivElement>(null);
  const dividerRef     = useRef<HTMLDivElement>(null);

  // ── Entrance animation with GSAP ──
  useEffect(() => {
    // Wait for loading to complete before starting animation
    const isLoaded = document.documentElement.getAttribute('data-loaded') === 'true';
    
    if (!isLoaded) {
      // Set up listener for when loading completes
      const handleLoadComplete = () => {
        // Trigger animation after a small delay
        setTimeout(() => {
          startAnimation();
        }, 100);
        document.documentElement.removeEventListener('data-loaded', handleLoadComplete);
      };

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'data-loaded' &&
            document.documentElement.getAttribute('data-loaded') === 'true'
          ) {
            observer.disconnect();
            setTimeout(() => {
              startAnimation();
            }, 100);
          }
        });
      });

      observer.observe(document.documentElement, { attributes: true });
      return () => observer.disconnect();
    }

    startAnimation();

    function startAnimation() {
      // Safety: make sure charRefs are populated
      const chars   = charRefs.current.filter(Boolean) as HTMLSpanElement[];
      const leadDot = leadDotRef.current;
      const trailDot = trailDotRef.current;

      if (!chars.length) return;

      const ctx = gsap.context(() => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;

        const getOffset = (el: HTMLElement | null) => {
          if (!el) return { x: 0, y: 0 };
          const rect = el.getBoundingClientRect();
          return {
            x: cx - (rect.left + rect.width / 2),
            y: cy - (rect.top + rect.height / 2),
          };
        };

        const pillOffset = getOffset(pillRef.current);
        const metaOffset = getOffset(metaRef.current);
        const brOffset = getOffset(bottomRightMetaRef.current);

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Leading accent dot — drops in first
      tl.fromTo(
        leadDot,
        { opacity: 0, y: -60, scale: 0.4 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(2)' },
        0,
      );

      // 2. Name characters — smooth stagger from below with slight rotation
      tl.fromTo(
        chars,
        {
          opacity: 0,
          y: '110%',
          rotationX: -40,
          transformOrigin: '50% 100%',
        },
        {
          opacity: 1,
          y: '0%',
          rotationX: 0,
          duration: 0.75,
          stagger: {
            each: 0.055,
            ease: 'power2.inOut',
          },
          ease: 'back.out(1.4)',
        },
        0.1, // slight overlap with dot
      );

      // 3. Trailing accent dot — pops in after last char
      tl.fromTo(
        trailDot,
        { opacity: 0, scale: 0, x: -10 },
        { opacity: 1, scale: 1, x: 0, duration: 0.4, ease: 'back.out(3)' },
        `-=0.2`, // slightly before name finishes
      );

      // 4. UI chrome: Top-left pill + clock flying from center
      tl.fromTo(
        pillRef.current,
        { opacity: 0, x: pillOffset.x, y: pillOffset.y, scale: 0.5 },
        { opacity: 1, x: 0, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' },
        0.25
      );
      
      tl.fromTo(
        clockRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        "-=0.6"
      );

      // 5. Right meta column flying from center
      tl.fromTo(
        metaRef.current,
        { opacity: 0, x: metaOffset.x, y: metaOffset.y, scale: 0.5 },
        { opacity: 1, x: 0, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' },
        0.3
      );

      // 6. Bottom-right meta flying from center
      tl.fromTo(
        bottomRightMetaRef.current,
        { opacity: 0, x: brOffset.x, y: brOffset.y, scale: 0.5 },
        { opacity: 1, x: 0, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' },
        0.35
      );

      // 7. Footer row — divider line wipes in, then tagline + CTAs
      tl.fromTo(
        dividerRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.7, ease: 'power2.inOut' },
        0.8,
      );

      tl.fromTo(
        [taglineRef.current, ctaRef.current],
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.12, ease: 'power2.out' },
        1.0,
      );

      // 7. Dot swing animation
      if (dotRef.current) {
        gsap.to(dotRef.current, {
          y: -12,
          duration: 0.7,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1,
        });
      }
    });

    return () => ctx.revert();
    }
  }, []);

  // Role rotation
  useEffect(() => {
    const roleTimer = setInterval(
      () => setActiveRoleIndex((prev) => (prev + 1) % ROLE_PHRASES.length),
      ROLE_ROTATION_INTERVAL_MS,
    );
    return () => clearInterval(roleTimer);
  }, []);

  // Clock
  useEffect(() => {
    setClockLabel(getDhakaTimeLabel());
    const clockTimer = setInterval(
      () => setClockLabel(getDhakaTimeLabel()),
      CLOCK_UPDATE_INTERVAL_MS,
    );
    return () => clearInterval(clockTimer);
  }, []);

  const handleNameHover = () => {
    if (!charRefs.current.length) return;
    
    // Prevent restarting if already animating to avoid jumping
    if (gsap.isTweening(charRefs.current[0])) return;

    gsap.to(charRefs.current, {
      keyframes: [
        { y: '-100%', opacity: 0, duration: 0.25, ease: 'power2.in' },
        { y: '100%', opacity: 0, duration: 0.01 },
        { y: '0%', opacity: 1, duration: 0.25, ease: 'power2.out' }
      ],
      stagger: 0.04,
    });
  };

  const scrollTo = (selector: string, e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-svh pt-[clamp(7rem,14vh,10rem)] pb-12 flex items-stretch overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 bg-[var(--bg)] pointer-events-none" aria-hidden="true" />

      <div className="max-w-[1400px] mx-auto px-[var(--shell-pad-x)] flex flex-col w-full relative z-10">

        {/* ── Top meta row ── */}
        <div className="flex justify-between items-center gap-4 flex-wrap">

          <div ref={pillRef} className="flex flex-col gap-1.5" style={{ opacity: 0 }}>
            <AvailabilityPill />
            <span
              ref={clockRef}
              className="font-mono text-[0.72rem] tracking-[0.16em] text-[var(--text-muted)] uppercase"
              style={{ opacity: 0 }}
            >
              {clockLabel}
            </span>
          </div>

          <aside
            ref={metaRef}
            className="flex flex-col items-end gap-[0.85rem] text-right"
            style={{ opacity: 0 }}
          >
            <span className="font-mono text-[0.7rem] tracking-[0.22em] uppercase text-[var(--text-muted)]">
              Currently
            </span>
            <RoleTicker activeIndex={activeRoleIndex} />
            <span className="w-px h-16 bg-gradient-to-b from-[var(--accent)] to-transparent" aria-hidden="true" />
          </aside>
        </div>

        {/* ── Editorial body ── */}
          {/* Background Image Behind Text */}
          {/* <div className="absolute   w-screen h-screen flex justify-center opacity-20 pointer-events-none mix-blend-screen transition-opacity duration-700">
            <Image
              src={bgImage}
              alt="Mohayminul Background"
              fill
              className="object-cover  grayscale blur-[2px]"
              priority
            />
          </div> */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-end gap-[clamp(1.5rem,4vw,4rem)] mt-[clamp(3rem,8vh,5rem)] flex-1 relative">


          {/* Name lockup — GSAP animated */}
          <div className="min-w-0 py-8 relative z-10">
            <h1
              ref={nameRef}
              className="text-[clamp(3.5rem,10vw,8.5rem)] leading-[0.9] font-display font-[350] flex flex-col"
              style={{ perspective: '800px' }}
            >
              {/* Leading dot */}
              <span
                ref={leadDotRef}
                className="[font-variation-settings:'opsz'_144,'SOFT'_30,'WONK'_1] text-[var(--accent)]"
                style={{ opacity: 0, display: 'inline-block' }}
              >
                .
              </span>

              {/* Name chars — each individually ref'd for GSAP stagger */}
              <span
                ref={nameSpanRef}
                className="ml-[clamp(1rem,4vw)] italic text-[var(--text-primary)] [font-variation-settings:'opsz'_144,'SOFT'_90,'WONK'_1 ] cursor-pointer transition-all"
                style={{ display: 'inline-block',overflow:'hidden', position: 'relative', paddingBottom:16 }}
                aria-label={NAME_TEXT}
                onMouseEnter={handleNameHover}
              >
                {NAME_TEXT.split('').map((letter, i) => (
                  <span key={i} style={{ display: 'inline-block', position: 'relative' }}>
                    <span style={{ display: 'inline-block', verticalAlign: 'bottom' }}>
                      <span
                        ref={(el) => { charRefs.current[i] = el; }}
                        style={{
                          display: 'inline-block',
                          opacity: 0,
                          minWidth: letter === ' ' ? '0.3em' : 'auto',
                          willChange: 'transform, opacity',
                        }}
                      >
                        {letter}
                      </span>
                    </span>
                    {letter === 'i' && (
                      <span
                        ref={dotRef}
                        style={{
                          display: 'inline-block',
                          position: 'absolute',
                          top: '-0.3em',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '0.2em',
                          height: '0.2em',
                          borderRadius: '50%',
                          backgroundColor: 'var(--accent)',
                          marginLeft: '-0.05em',
                        }}
                        aria-hidden="true"
                      />
                    )}
                  </span>
                ))}

                {/* Trailing accent dot */}
                <span
                  ref={trailDotRef}
                  className="text-[var(--accent)] inline-block"
                  style={{ opacity: 0, display: 'inline-block' }}
                >
                  .
                </span>
              </span>
            </h1>
          </div>

          {/* Right meta */}
          <div ref={bottomRightMetaRef} className="flex flex-col items-end gap-[0.85rem] text-right" style={{ opacity: 0 }}>
            <span className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-[var(--text-muted)]">
              {PORTFOLIO_META}
              <div className="flex justify-end">
                <ScrollCue onClick={(e) => scrollTo('#about', e)} />
              </div>
            </span>
          </div>
        </div>

        {/* ── Footer row ── */}
        <div className="mt-[clamp(3rem,8vh,5rem)] pt-6">

          {/* Divider — GSAP scaleX wipe */}
          <div
            ref={dividerRef}
            className="border-t border-[var(--line)] mb-6"
            style={{ transform: 'scaleX(0)', transformOrigin: 'left center' }}
          />

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] items-end gap-x-8 gap-y-6">

            <p
              ref={taglineRef}
              className="m-0 font-display italic text-[clamp(1.05rem,1.4vw,1.35rem)] font-normal leading-[1.55] text-[var(--text-secondary)] max-w-[30ch]"
              style={{ opacity: 0 }}
            >
              <span className="text-[var(--accent)] not-italic font-display text-[1.4em]">"</span>
              Building scalable web apps with Angular, Node & beyond
              <span className="text-[var(--accent)] not-italic font-display text-[1.4em]">"</span>
            </p>

            <div
              ref={ctaRef}
              className="flex flex-wrap items-center gap-4"
              style={{ opacity: 0 }}
            >
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

          </div>
        </div>

      </div>
    </section>
  );
}