'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface EducationItem {
  institution: string;
  degree: string;
  location: string;
  endDate: string;
}

const EDUCATION_DATA: EducationItem[] = [
  {
    institution: "Dhaka International University",
    degree: "B.S. in Computer Science & Engineering",
    location: "Dhaka, Bangladesh",
    endDate: "2020-12-31"
  }
];

export default function Education() {
  const containerRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Head reveal
      if (headRef.current) {
        gsap.fromTo(
          headRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Ribbon section reveal
      if (ribbonRef.current) {
        gsap.fromTo(
          ribbonRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ribbonRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Ribbon fill animation
      if (fillRef.current) {
        gsap.fromTo(
          fillRef.current,
          { width: '0%' },
          {
            width: '100%',
            duration: 1.6,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: ribbonRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Beads stagger reveal
      gsap.fromTo(
        '.bead',
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.ribbon-list',
            start: 'top 80%',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const formatYear = (iso: string) => new Date(iso).getFullYear().toString();

  return (
    <section ref={containerRef} className="relative py-[var(--section-pad-y)] overflow-hidden" id="education">
      <span className="absolute left-8 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 font-mono text-[0.66rem] tracking-[0.2em] uppercase text-[var(--text-muted)] opacity-50 hidden xl:block">
        § 03 — Schooling
      </span>

      <div className="max-w-[1400px] mx-auto px-[var(--shell-pad-x)] flex flex-col gap-[clamp(2.5rem,6vw,4rem)]">
        <div ref={headRef} className="flex flex-col gap-[0.85rem] max-w-[36rem]">
          <span className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-[var(--accent)]">Where it started</span>
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-[350] tracking-[-0.03em] leading-[1.05] font-display">
            The page <span className="italic text-[var(--accent)]">before page one.</span>
          </h2>
        </div>

        <div ref={ribbonRef} className="relative py-8">
          {/* Horizontal line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-[var(--line)] -translate-y-1/2 flex items-center justify-between hidden md:flex">
            <span className="w-[6px] h-[6px] rounded-full bg-[var(--text-muted)]"></span>
            <span ref={fillRef} className="absolute top-0 left-0 h-full bg-[var(--accent)] w-0 origin-left"></span>
            <span className="w-[6px] h-[6px] rounded-full bg-[var(--text-muted)]"></span>
          </div>

          <ol className="list-none m-0 p-0 grid grid-flow-row md:grid-flow-col md:auto-cols-fr gap-8 md:gap-6 relative z-10" role="list">
            {EDUCATION_DATA.map((edu) => (
              <li key={edu.institution} className="bead grid grid-rows-[auto_auto_auto] justify-items-center md:justify-items-center text-center gap-[0.85rem] relative group max-w-[32rem] mx-auto md:mx-0">
                <span className="font-mono text-[0.72rem] tracking-[0.18em] uppercase text-[var(--text-muted)]">
                  {formatYear(edu.endDate)}
                </span>
                
                <span className="w-3.5 h-3.5 rounded-full bg-[var(--bg-base)] border-2 border-[var(--accent)] relative z-20 transition-all duration-300 group-hover:bg-[var(--accent)] group-hover:scale-125" aria-hidden="true"></span>
                
                <div className="mt-1 flex flex-col gap-[0.35rem]">
                  <h3 className="m-0 font-display italic font-normal text-[clamp(1.2rem,2vw,1.65rem)] tracking-[-0.01em] text-[var(--text-primary)] leading-[1.2]">
                    {edu.degree}
                  </h3>
                  <p className="m-0 text-[0.9rem] text-[var(--text-secondary)] inline-flex flex-wrap items-center justify-center gap-2">
                    <span className="text-[var(--text-primary)] font-medium">{edu.institution}</span>
                    <span className="opacity-50">·</span>
                    <span>{edu.location}</span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
