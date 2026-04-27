'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Activity {
  organization: string;
  role: string;
  duration: string;
  highlights: string[];
}

interface Talk {
  title: string;
  event: string;
  year: number;
  role: string;
}

interface Publication {
  title: string;
  publisher: string;
  year: number;
  doi: string;
}

const ACTIVITIES: Activity[] = [
  {
    organization: "DIU Computer & Programming Club (DIU CPC)",
    role: "President",
    duration: "Aug 2018 – Apr 2021",
    highlights: [
      "Re-established the club and taught JavaScript to members",
      "Organized an inter-university event with approx. 1000 participants",
      "Organized 11 intra-university programming contests"
    ]
  },
  {
    organization: "Ex_Coder",
    role: "Team Lead",
    duration: "Jan 2019 – Dec 2020",
    highlights: [
      "Participated in ICPC Dhaka Regional 2019 (Southeast University)",
      "Participated in NCPC 2020 (MIST)"
    ]
  }
];

const TALKS: Talk[] = [
  {
    title: "Prepare for your career: Ultimate Guide to Kickstart Your Journey",
    event: "DIU CPC, Dhaka International University",
    year: 2025,
    role: "Speaker"
  },
  {
    title: "Expectation vs Reality in Bangladesh's Software Job Market",
    event: "DIU CSE Department",
    year: 2024,
    role: "Guest Speaker"
  }
];

const PUBLICATIONS: Publication[] = [
  {
    title: "RHM: Designing a Customized Health Model for the Union of Ramjibon",
    publisher: "IEEE International Conference on Biomedical Engineering, Computer and Information Technology for Health (BECITHCON)",
    year: 2019,
    doi: "10.1109/BECITHCON48839.2019.9063165"
  }
];

export default function Beyond() {
  const containerRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

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

      // Articles reveal
      gsap.utils.toArray('.stack-reveal').forEach((el: any) => {
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

      // Entries stagger reveal
      gsap.utils.toArray('.stack-body').forEach((body: any) => {
        gsap.fromTo(
          body.querySelectorAll('.entry-reveal'),
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: body,
              start: 'top 80%',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const doiUrl = (doi: string) => `https://doi.org/${doi}`;

  return (
    <section ref={containerRef} className="relative py-[var(--section-pad-y)] overflow-hidden" id="beyond">
      <span className="absolute left-8 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 font-mono text-[0.66rem] tracking-[0.2em] uppercase text-[var(--text-muted)] opacity-50 hidden xl:block">
        § 07 — Beyond
      </span>

      <div className="max-w-[1400px] mx-auto px-[var(--shell-pad-x)] flex flex-col gap-[clamp(3rem,6vw,5rem)]">
        <header ref={headRef} className="flex flex-col gap-[0.85rem] max-w-[38rem]">
          <span className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-[var(--accent)]">Off the clock</span>
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-[350] tracking-[-0.03em] leading-[1.05] font-display m-0">
            Community, talks & <span className="italic text-[var(--accent)]">research traces.</span>
          </h2>
        </header>

        {/* Activities */}
        {ACTIVITIES.length > 0 && (
          <article className="stack-reveal grid grid-cols-1 md:grid-cols-[minmax(7rem,12rem)_minmax(0,1fr)] gap-[clamp(1.5rem,4vw,3rem)] items-start border-t border-[var(--line)] pt-[clamp(1.5rem,4vw,2.5rem)]">
            <aside className="md:sticky md:top-24 self-start flex items-start h-full md:min-h-0" aria-hidden="true">
              <span className="font-mono text-[0.74rem] tracking-[0.28em] uppercase text-[var(--text-muted)] md:[writing-mode:vertical-rl] md:rotate-180 whitespace-nowrap border-b md:border-b-0 md:border-l border-[var(--line)] pb-2 md:pb-0 md:pl-4 w-full md:w-auto">
                Leadership · Activities
              </span>
            </aside>
            <div className="stack-body flex flex-col gap-[clamp(1.5rem,4vw,2.5rem)]">
              {ACTIVITIES.map((activity, i) => (
                <div key={activity.organization} className="entry-reveal flex flex-col gap-[0.85rem] pb-[clamp(1.5rem,4vw,2rem)] border-b border-dashed border-[var(--line)] last:border-none last:pb-0">
                  <div className="flex items-baseline justify-between font-mono text-[0.7rem] tracking-[0.16em] uppercase text-[var(--text-muted)]">
                    <span className="text-[var(--accent)]">A.0{i + 1}</span>
                    <span>{activity.duration}</span>
                  </div>
                  <h3 className="m-0 font-display italic font-[350] text-[clamp(1.55rem,3vw,2.4rem)] tracking-[-0.02em] leading-[1.15] text-[var(--text-primary)]">
                    {activity.role}
                    <span className="font-normal not-italic font-[300] text-[var(--text-muted)]"> — </span>
                    <span className="text-[var(--accent)]">{activity.organization}</span>
                  </h3>
                  <ul className="list-none m-0 p-0 flex flex-col gap-[0.55rem] max-w-[60ch]">
                    {activity.highlights.map((h, j) => (
                      <li key={j} className="grid grid-cols-[1.5rem_1fr] gap-[0.65rem] items-start text-[0.95rem] text-[var(--text-secondary)] leading-[1.55]">
                        <span className="block w-full h-px mt-[0.85em] bg-[var(--accent)] opacity-50"></span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </article>
        )}

        {/* Talks */}
        {TALKS.length > 0 && (
          <article className="stack-reveal grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(7rem,12rem)] gap-[clamp(1.5rem,4vw,3rem)] items-start border-t border-[var(--line)] pt-[clamp(1.5rem,4vw,2.5rem)]">
            <aside className="md:sticky md:top-24 self-start flex items-start h-full md:min-h-0 md:order-2 md:justify-self-end" aria-hidden="true">
              <span className="font-mono text-[0.74rem] tracking-[0.28em] uppercase text-[var(--text-muted)] md:[writing-mode:vertical-rl] md:rotate-180 whitespace-nowrap border-b md:border-b-0 md:border-r border-[var(--line)] pb-2 md:pb-0 md:pr-4 w-full md:w-auto text-left md:text-right">
                Talks · Speaking
              </span>
            </aside>
            <div className="stack-body flex flex-col gap-[clamp(1.5rem,4vw,2.5rem)] md:order-1">
              {TALKS.map((talk) => (
                <div key={talk.title} className="entry-reveal grid grid-cols-[auto_1fr] items-baseline gap-4 border-b border-[var(--line)] pb-4 last:border-none last:pb-0">
                  <span className="font-display italic font-[350] text-[clamp(1.5rem,3.5vw,2.5rem)] leading-none text-[var(--accent)] tracking-[-0.03em]">
                    {talk.year}
                  </span>
                  <div className="flex flex-col gap-[0.3rem]">
                    <h3 className="m-0 font-display italic font-[350] text-[clamp(1.15rem,2vw,1.55rem)] leading-[1.25] text-[var(--text-primary)]">
                      {talk.title}
                    </h3>
                    <p className="m-0 font-mono text-[0.78rem] tracking-[0.04em] text-[var(--text-muted)] inline-flex flex-wrap gap-2">
                      <span className="text-[var(--text-secondary)]">{talk.role}</span>
                      <span className="opacity-50">·</span>
                      <span>{talk.event}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        )}

        {/* Publications */}
        {PUBLICATIONS.length > 0 && (
          <article className="stack-reveal grid grid-cols-1 md:grid-cols-[minmax(7rem,12rem)_minmax(0,1fr)] gap-[clamp(1.5rem,4vw,3rem)] items-start border-t border-[var(--line)] pt-[clamp(1.5rem,4vw,2.5rem)]">
            <aside className="md:sticky md:top-24 self-start flex items-start h-full md:min-h-0" aria-hidden="true">
              <span className="font-mono text-[0.74rem] tracking-[0.28em] uppercase text-[var(--text-muted)] md:[writing-mode:vertical-rl] md:rotate-180 whitespace-nowrap border-b md:border-b-0 md:border-l border-[var(--line)] pb-2 md:pb-0 md:pl-4 w-full md:w-auto">
                Publications · Research
              </span>
            </aside>
            <div className="stack-body flex flex-col gap-[clamp(1.5rem,4vw,2.5rem)]">
              {PUBLICATIONS.map((pub, i) => (
                <div key={pub.doi} className="entry-reveal flex flex-col gap-[0.85rem] pb-[clamp(1.5rem,4vw,2rem)] border-b border-dashed border-[var(--line)] last:border-none last:pb-0">
                  <div className="flex items-baseline justify-between font-mono text-[0.7rem] tracking-[0.16em] uppercase text-[var(--text-muted)]">
                    <span className="text-[var(--accent)]">P.0{i + 1}</span>
                    <span>{pub.year}</span>
                  </div>
                  <h3 className="m-0 font-display italic font-[350] text-[clamp(1.15rem,2vw,1.55rem)] leading-[1.25] text-[var(--text-primary)]">
                    {pub.title}
                  </h3>
                  <p className="m-0 text-[0.92rem] text-[var(--text-secondary)]">{pub.publisher}</p>
                  <a
                    href={doiUrl(pub.doi)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-[0.45rem] self-start font-mono text-[0.78rem] tracking-[0.04em] text-[var(--accent)] border-b border-[var(--line)] pb-1 transition-all hover:text-[var(--accent-strong)] hover:border-[var(--accent)]"
                  >
                    doi.org/{pub.doi}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M7 17L17 7M17 7H8M17 7v9"/>
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
