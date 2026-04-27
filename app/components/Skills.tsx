'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type SkillLevel = 'expert' | 'proficient' | 'familiar';

interface SkillItem {
  name: string;
  level: SkillLevel;
}

interface SkillCategory {
  category: string;
  items: SkillItem[];
}

const SKILLS_DATA: SkillCategory[] = [
  {
    category: "Frontend",
    items: [
      { name: "Angular", level: "expert" },
      { name: "React", level: "proficient" },
      { name: "TypeScript", level: "expert" },
      { name: "TailwindCSS", level: "expert" },
      { name: "Ionic", level: "proficient" },
      { name: "RxJS", level: "expert" }
    ]
  },
  {
    category: "Backend",
    items: [
      { name: "NestJS", level: "proficient" },
      { name: "NodeJS", level: "proficient" },
      { name: "C#", level: "proficient" },
      { name: "PostgresSQL", level: "proficient" },
      { name: "MongoDB", level: "proficient" }
    ]
  },
  {
    category: "DevOps & Tools",
    items: [
      { name: "Azure DevOps", level: "proficient" },
      { name: "Docker", level: "proficient" },
      { name: "GitHub Actions", level: "proficient" },
      { name: "Cloudflare Page", level: "proficient" },
      { name: "Figma", level: "proficient" },
      { name: "Railway", level: "proficient" }
    ]
  }
];

export default function Skills() {
  const containerRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const stripRefs = useRef<(HTMLDivElement | null)[]>([]);

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

      // Strips reveal
      stripRefs.current.forEach((strip, i) => {
        if (!strip) return;
        gsap.fromTo(
          strip,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: strip,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const getLevelLabel = (level: SkillLevel) => {
    switch (level) {
      case 'expert': return 'Expert';
      case 'proficient': return 'Proficient';
      default: return 'Familiar';
    }
  };

  const addToStrips = (el: HTMLDivElement | null) => {
    if (el && !stripRefs.current.includes(el)) {
      stripRefs.current.push(el);
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative py-[var(--section-pad-y)] bg-[var(--bg-inverse)] text-[var(--text-inverse)] overflow-hidden" 
      id="skills"
      style={{ '--line': 'rgba(244, 241, 234, 0.14)', '--line-strong': 'rgba(244, 241, 234, 0.32)' } as React.CSSProperties}
    >
      <span className="absolute left-8 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 font-mono text-[0.66rem] tracking-[0.2em] uppercase text-[var(--text-muted)] opacity-50 hidden xl:block">
        § 05 — Stack
      </span>

      <div className="max-w-[1400px] mx-auto px-[var(--shell-pad-x)] flex flex-col gap-[clamp(2.5rem,5vw,4rem)] mb-12">
        <header ref={headRef} className="flex flex-col gap-4 max-w-[48rem]">
          <span className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-[var(--accent)]">Tools of the trade</span>
          <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-[350] tracking-[-0.03em] leading-[1.05] font-display text-[var(--text-inverse)]">
            The <span className="italic text-[var(--accent)]">moving parts</span> behind the work.
          </h2>
          <p className="m-0 text-[var(--text-secondary)] text-lg max-w-[36rem]">
            A rolling inventory of the languages, frameworks and habits I lean on every day — paused on hover.
          </p>
        </header>
      </div>

      <div className="flex flex-col border-t border-[var(--line)]" role="list">
        {SKILLS_DATA.map((cat, i) => (
          <div 
            key={cat.category}
            ref={addToStrips}
            className="group relative grid grid-cols-1 md:grid-cols-[minmax(8rem,12rem)_minmax(0,1fr)] items-center border-bottom border-[var(--line)] border-b py-5 overflow-hidden"
            role="listitem"
          >
            <span className="inline-flex items-baseline gap-[0.85rem] px-[var(--shell-pad-x)] md:pr-6 font-display italic font-normal text-[clamp(1.2rem,2vw,1.65rem)] tracking-[-0.01em] text-[var(--text-inverse)] whitespace-nowrap mb-4 md:mb-0">
              <span className="font-mono not-italic text-[0.75rem] tracking-[0.16em] text-[var(--text-muted)]">0{i + 1}</span>
              {cat.category}
            </span>

            <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
              <div 
                className={`flex items-center gap-4 whitespace-nowrap px-4 will-change-transform animate-[marqueeLeft_38s_linear_infinite] group-hover:[animation-play-state:paused] ${i % 2 === 1 ? 'animate-[marqueeRight_38s_linear_infinite]' : ''}`}
              >
                {/* Main set */}
                {cat.items.map((item) => (
                  <SkillToken key={item.name} item={item} label={getLevelLabel(item.level)} />
                ))}
                {/* Duplicate set for loop */}
                {cat.items.map((item) => (
                  <SkillToken key={`${item.name}-dup`} item={item} label={getLevelLabel(item.level)} />
                ))}
                {/* Triple set for safety on large screens */}
                {cat.items.map((item) => (
                  <SkillToken key={`${item.name}-dup2`} item={item} label={getLevelLabel(item.level)} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SkillToken({ item, label }: { item: SkillItem; label: string }) {
  const isExpert = item.level === 'expert';
  const isProficient = item.level === 'proficient';

  return (
    <div className="inline-flex items-center gap-[0.55rem] px-4 py-[0.55rem] rounded-full border border-[var(--line)] bg-[rgba(244,241,234,0.04)] text-[0.92rem] transition-all duration-250 hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] hover:border-[var(--accent)] hover:-translate-y-[1px] group/token">
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-250 ${isExpert ? 'bg-[var(--accent)] shadow-[0_0_0_3px_var(--accent-soft)]' : isProficient ? 'bg-[var(--text-inverse)] opacity-85' : 'bg-[var(--text-muted)]'} group-hover/token:bg-[var(--accent-ink)] group-hover/token:shadow-none`}></span>
      <span className="font-medium tracking-[0.01em]">{item.name}</span>
      <span className="font-mono text-[0.68rem] tracking-[0.14em] uppercase text-[var(--text-muted)] pl-[0.4rem] border-l border-[var(--line)] group-hover/token:text-[var(--accent-ink)] group-hover/token:opacity-75 group-hover/token:border-[var(--accent-ink)]">
        {label}
      </span>
    </div>
  );
}
