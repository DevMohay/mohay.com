'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import profile from '../../public/Picture.jpg'

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: '6+', label: 'Years shipping' },
  { value: '40+', label: 'Projects in flight' },
  { value: '5', label: 'Conference talks' },
  { value: '∞', label: 'Cups of coffee' },
];

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // reveal animations
      revealRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // Stats stagger
      gsap.fromTo(
        '.stat-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.stats-strip',
            start: 'top 90%',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const addToReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <section ref={containerRef} className="relative py-[var(--section-pad-y)] overflow-hidden" id="about">
      <span className="absolute left-8 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 font-mono text-[0.66rem] tracking-[0.2em] uppercase text-[var(--text-muted)] opacity-50 hidden xl:block">
        § 01 — About
      </span>

      <div className="max-w-[1400px] mx-auto px-[var(--shell-pad-x)] flex flex-col gap-[clamp(3rem,7vw,6rem)]">
        <header ref={addToReveal} className="grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] items-start gap-[clamp(1rem,4vw,3rem)] max-w-[56rem]">
          <span className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-[var(--accent)] mt-2">The human</span>
          <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-[350] tracking-[-0.03em] leading-[1.05] font-display">
            Engineering that respects <span className="italic text-[var(--accent)]">the reader</span> —
            interfaces that breathe, code that ages well.
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-[clamp(2rem,6vw,5rem)] items-start">
          {/* Prose column */}
          <article ref={addToReveal} className="max-w-[38rem] text-[1.05rem] text-[var(--text-secondary)] leading-[1.7]">
            <p className="mb-[1.4rem] after:content-[''] after:table after:clear-both">
              <span className="float-left font-display italic font-normal text-[4.5em] leading-[0.85] pt-[0.15em] pr-[0.18em] text-[var(--accent)]">I</span>
              'm a Senior Software Engineer with over 6 years of experience crafting high-quality web applications. Currently at Brain Station 23 PLC, I specialize in Angular and front-end architecture, but I am proficient across the full stack—from designing intuitive UIs to building reliable NestJS backends and managing cloud deployments.
            </p>
            <p className="mb-[1.4rem]">
              When I’m not in someone else’s codebase you’ll find me shipping side
              projects, writing on{' '}
              <a href="https://medium.com/@mehaxan" target="_blank" rel="noopener noreferrer" className="text-[var(--text-primary)] border-b border-[var(--accent)] transition-all hover:bg-[var(--accent)] hover:text-[var(--accent-ink)]">
                Medium
              </a>
              , or sketching interfaces in the margins. I believe great software
              sits at the intersection of solid engineering and thoughtful design.
            </p>

            <ul className="list-none m-0 p-0 mt-8 pt-6 border-t border-[var(--line)] flex flex-wrap gap-x-10 gap-y-6">
              <li className="flex flex-col gap-1">
                <span className="font-mono text-[0.66rem] tracking-[0.2em] uppercase text-[var(--text-muted)]">Based</span>
                <span className="text-[0.95rem] text-[var(--text-primary)]">Dhaka, Bangladesh</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="font-mono text-[0.66rem] tracking-[0.2em] uppercase text-[var(--text-muted)]">Role</span>
                <span className="text-[0.95rem] text-[var(--text-primary)]">Senior Software Engineer</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="font-mono text-[0.66rem] tracking-[0.2em] uppercase text-[var(--text-muted)]">Status</span>
                <span className="text-[0.95rem] text-[var(--accent)]">Open to projects</span>
              </li>
            </ul>
          </article>

          {/* Visual column */}
          <aside ref={addToReveal} className="md:sticky md:top-24 flex flex-col gap-6">
            <figure className="relative m-0 aspect-[4/5] overflow-hidden bg-[var(--bg-surface)] border border-[var(--line)] shadow-[var(--shadow-soft)] group">
              <Image
                src={profile}
                alt="Mehedi Hasan"
                fill
                className="object-cover grayscale-[15%] contrast-[1.05] transition-all duration-700 group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-105"
                sizes="(max-w-768px) 100vw, 40vw"
              />
              <figcaption className="absolute bottom-3 left-3 right-3 flex justify-between font-mono text-[0.66rem] tracking-[0.12em] uppercase text-white bg-[rgba(14,14,12,0.55)] backdrop-blur-[6px] p-2 px-[0.6rem] rounded">
                <span>Fig. 01</span>
                <span>Mehedi Hasan, est. Dhaka</span>
              </figcaption>
            </figure>

            <div className="flex items-center gap-4 text-[var(--text-secondary)]" aria-hidden="true">
              <span className="font-display italic text-[2.5rem] leading-none text-[var(--accent)]">MH</span>
              <svg className="w-36 h-10 opacity-70" viewBox="0 0 200 60" preserveAspectRatio="none">
                <path
                  d="M5,40 C30,5 60,55 90,30 C120,5 150,55 195,25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </aside>
        </div>

        {/* Pull quote */}
        <blockquote ref={addToReveal} className="m-0 py-[clamp(2rem,5vw,4rem)] border-y border-[var(--line)] grid grid-cols-[minmax(2rem,5rem)_1fr] gap-6 items-start">
          <span className="font-display italic text-[clamp(5rem,12vw,9rem)] leading-[0.6] text-[var(--accent)]">“</span>
          <div>
            <p className="m-0 font-display italic text-[clamp(1.5rem,3vw,2.5rem)] font-[350] text-[var(--text-primary)] [font-variation-settings:'opsz'_144,'SOFT'_80,'WONK'_1] max-w-[30ch]">
              Building scalable web apps with Angular, Node & beyond
            </p>
            <footer className="mt-6 flex items-center gap-4 font-mono text-[0.72rem] tracking-[0.16em] uppercase text-[var(--text-muted)]">
              <span className="w-8 h-px bg-[var(--text-muted)]"></span>
              <span>— Mehedi, on the job</span>
            </footer>
          </div>
        </blockquote>

        {/* Stats strip */}
        <ul className="stats-strip list-none m-0 p-0 grid grid-cols-2 md:grid-cols-4 border-y border-[var(--line)]">
          {STATS.map((stat) => (
            <li key={stat.label} className="stat-item flex flex-col items-center justify-center py-10 px-4 text-center border-r border-[var(--line)] last:border-0 md:even:border-r">
              <span className="text-[clamp(2rem,4vw,3.5rem)] font-display italic font-medium leading-none text-[var(--text-primary)] mb-2">{stat.value}</span>
              <span className="font-mono text-[0.66rem] tracking-[0.2em] uppercase text-[var(--text-muted)]">{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
