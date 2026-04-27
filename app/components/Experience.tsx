'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ExperienceItem {
  company: string;
  companyUrl?: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description?: string;
  highlights: string[];
  technologies: string[];
}

const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    company: "Brain Station 23 PLC.",
    companyUrl: "https://brainstation-23.com",
    role: "Senior Software Engineer",
    startDate: "2025-01-01",
    endDate: null,
    description: "Collaborating with cross-functional and cross-regional teams to ensure product alignment, security, and scalability.",
    highlights: [
      "Reviewed code and mentored junior developers to improve code quality and delivery",
      "Proactively identified architectural issues and ensured timely, optimized feature delivery"
    ],
    technologies: ["Angular", "TailwindCSS", "C#"]
  },
  {
    company: "Brain Station 23 PLC.",
    companyUrl: "https://brainstation-23.com",
    role: "Software Engineer",
    startDate: "2023-07-01",
    endDate: "2024-12-31",
    description: "Focused on secure multi-project access and real-time visualization tools.",
    highlights: [
      "Implemented a role-based authorization framework in Angular for secure multi-project access",
      "Integrated AI-driven summarization tools into E&P sector applications to enhance reporting efficiency",
      "Developed a 3D wellbore analysis component using React and Unity for real-time visualization"
    ],
    technologies: ["Angular", "React", "TailwindCSS", "C#", "WebGL (Unity)"]
  },
  {
    company: "Brain Station 23 PLC.",
    companyUrl: "https://brainstation-23.com",
    role: "Associate Software Engineer",
    startDate: "2022-04-01",
    endDate: "2023-06-30",
    highlights: [
      "Led development of high-performance Angular applications, achieving 80%+ performance improvements",
      "Enabled a 230% sales increase through seamless integration of key business features",
      "Built advanced data visualization and project management tools for well-based industries"
    ],
    technologies: ["React", "Angular", "TailwindCSS", "WebGL (Unity)"]
  },
  {
    company: "AITS Idea Ltd.",
    role: "Associate Software Engineer",
    startDate: "2021-07-01",
    endDate: "2022-03-31",
    highlights: [
      "Led development of Angular-based ERP and POS systems, achieving 40% data accuracy improvement",
      "Built high-performance product website for Jain Laboratories Ltd with < 3s load times",
      "Reduced bounce rate by 40% through optimized UI and rapid prototyping"
    ],
    technologies: ["Angular", "TailwindCSS", "Figma"]
  },
  {
    company: "AITS Idea Ltd.",
    role: "Junior Software Engineer",
    startDate: "2021-01-01",
    endDate: "2021-06-30",
    description: "Assisted in the development of web applications and user interfaces.",
    highlights: [
      "Collaborated on frontend modules using Angular and supported bug fixing and performance tuning",
      "Gained hands-on experience with RESTful API integration and responsive design"
    ],
    technologies: ["Angular", "JavaScript", "HTML/CSS"]
  }
];

export default function Experience() {
  const containerRef = useRef<HTMLElement>(null);
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      revealRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const formatYear = (iso: string) => new Date(iso).getFullYear().toString();

  const formatRange = (start: string, end: string | null) => {
    const s = new Date(start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const e = end
      ? new Date(end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : 'Present';
    return `${s} → ${e}`;
  };

  const calculateDuration = (start: string, end: string | null) => {
    const from = new Date(start);
    const to = end ? new Date(end) : new Date();
    const months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
    const years = Math.floor(months / 12);
    const remaining = months % 12;
    const parts: string[] = [];
    if (years > 0) parts.push(`${years}y`);
    if (remaining > 0) parts.push(`${remaining}m`);
    return parts.join(' ') || '< 1m';
  };

  const addToReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative py-[var(--section-pad-y)] bg-[var(--bg-inverse)] text-[var(--text-inverse)] overflow-hidden" 
      id="experience"
      style={{ '--line': 'rgba(244, 241, 234, 0.14)', '--line-strong': 'rgba(244, 241, 234, 0.32)' } as React.CSSProperties}
    >
      <span className="absolute left-8 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 font-mono text-[0.66rem] tracking-[0.2em] uppercase text-[var(--text-muted)] opacity-50 hidden xl:block">
        § 02 — Career
      </span>

      <div className="max-w-[1400px] mx-auto px-[var(--shell-pad-x)] flex flex-col gap-[clamp(3rem,7vw,5rem)]">
        <header ref={addToReveal} className="grid grid-cols-1 md:grid-cols-[minmax(0,8rem)_minmax(0,1fr)] gap-[clamp(1rem,4vw,3rem)] items-start max-w-[60rem]">
          <span className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-[var(--accent)] mt-2">Selected work history</span>
          <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-[350] tracking-[-0.03em] leading-[1.05] font-display">
            Six years & counting — building <span className="italic text-[var(--accent)]">at the seam</span> of design, code, and people.
          </h2>
        </header>

        <ol className="list-none m-0 p-0 flex flex-col" role="list">
          {EXPERIENCE_DATA.map((exp, i) => {
            const isCurrent = exp.endDate === null;
            return (
              <li 
                key={exp.company + exp.startDate}
                ref={addToReveal}
                className="grid grid-cols-1 md:grid-cols-[minmax(7rem,9rem)_minmax(0,1fr)] gap-[clamp(1.5rem,4vw,4rem)] py-[clamp(2rem,5vw,3rem)] border-t border-[var(--line)] first:border-0 relative group"
              >
                {/* Hover effect bar */}
                <div className="absolute top-0 left-0 w-0 h-full bg-[var(--accent)] opacity-0 transition-all duration-400 ease-[var(--ease-out)] group-hover:w-[3px] group-hover:opacity-100" />

                {/* Sticky year label */}
                <div className="md:sticky md:top-24 self-start flex flex-col gap-[0.6rem]" aria-hidden="true">
                  <div className={`w-[0.7rem] h-[0.7rem] border border-[var(--accent)] rounded-full transition-all duration-300 ${isCurrent ? 'bg-[var(--accent)] shadow-[0_0_0_6px_var(--accent-soft)] animate-[pulseRing_2.4s_var(--ease-out)_infinite]' : 'bg-transparent'}`} />
                  <span className="font-display italic font-[350] text-[clamp(2.5rem,5vw,4rem)] leading-[0.95] tracking-[-0.04em]">
                    {formatYear(exp.startDate)}
                  </span>
                  <span className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-[var(--text-muted)]">
                    {calculateDuration(exp.startDate, exp.endDate)}
                  </span>
                </div>

                {/* Body */}
                <article className="flex flex-col gap-[1.2rem] min-w-0">
                  <div className="flex justify-between items-center gap-4 flex-wrap font-mono text-[0.72rem] tracking-[0.16em] uppercase text-[var(--text-muted)]">
                    <div className="inline-flex items-center gap-[0.85rem]">
                      <span>0{i + 1}</span>
                      {isCurrent && (
                        <span className="inline-flex items-center gap-[0.45rem] text-[var(--accent)]">
                          <span className="w-[7px] h-[7px] rounded-full bg-[var(--accent)] animate-[pulseRing_2s_var(--ease-out)_infinite]" />
                          Currently
                        </span>
                      )}
                    </div>
                    <span>{formatRange(exp.startDate, exp.endDate)}</span>
                  </div>

                  <h3 className="m-0 font-display font-[350] text-[clamp(1.6rem,3vw,2.6rem)] tracking-[-0.02em] leading-[1.1]">
                    {exp.role} <span className="italic font-[300] text-[var(--text-muted)]">at</span>{' '}
                    {exp.companyUrl ? (
                      <a 
                        href={exp.companyUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-[0.3rem] text-[var(--accent)] border-b border-transparent transition-all duration-200 hover:border-[var(--accent)]"
                      >
                        {exp.company}
                        <svg className="w-[0.8em] h-[0.8em] opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 17L17 7M17 7H8M17 7v9"/>
                        </svg>
                      </a>
                    ) : (
                      <span className="text-[var(--text-inverse)]">{exp.company}</span>
                    )}
                  </h3>

                  {exp.description && (
                    <p className="m-0 max-w-[60ch] text-[var(--text-secondary)] text-[1rem] leading-[1.65]">
                      {exp.description}
                    </p>
                  )}

                  <ul className="list-none m-0 p-0 flex flex-col gap-[0.65rem] max-w-[64ch]">
                    {exp.highlights.map((h) => (
                      <li key={h} className="grid grid-cols-[2rem_1fr] items-start gap-[0.75rem] text-[0.95rem] text-[var(--text-secondary)] leading-[1.55]">
                        <span className="block w-full h-px mt-[0.85em] bg-[var(--accent)] opacity-50" aria-hidden="true" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {exp.technologies.map((t) => (
                      <span key={t} className="px-3 py-1 rounded-full border border-[var(--line)] text-[0.7rem] font-mono tracking-wider uppercase text-[var(--text-inverse)] opacity-85 transition-opacity hover:opacity-100">
                        {t}
                      </span>
                    ))}
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
