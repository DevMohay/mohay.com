"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    description:
      "Collaborating with cross-functional and cross-regional teams to ensure product alignment, security, and scalability.",
    highlights: [
      "Reviewed code and mentored junior developers to improve code quality and delivery",
      "Proactively identified architectural issues and ensured timely, optimized feature delivery",
    ],
    technologies: ["Angular", "TailwindCSS", "C#"],
  },
  {
    company: "Brain Station 23 PLC.",
    companyUrl: "https://brainstation-23.com",
    role: "Software Engineer",
    startDate: "2023-07-01",
    endDate: "2024-12-31",
    description:
      "Focused on secure multi-project access and real-time visualization tools.",
    highlights: [
      "Implemented a role-based authorization framework in Angular for secure multi-project access",
      "Integrated AI-driven summarization tools into E&P sector applications to enhance reporting efficiency",
      "Developed a 3D wellbore analysis component using React and Unity for real-time visualization",
    ],
    technologies: ["Angular", "React", "TailwindCSS", "C#", "WebGL (Unity)"],
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
      "Built advanced data visualization and project management tools for well-based industries",
    ],
    technologies: ["React", "Angular", "TailwindCSS", "WebGL (Unity)"],
  },
];

export default function Experience() {
  const containerRef = useRef<HTMLElement>(null);
  const pinStageRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ctx: gsap.Context | undefined;

    const initGSAP = () => {
      ctx = gsap.context(() => {
        const section = containerRef.current;
        const stage = pinStageRef.current;
        if (!section || !stage) return;

        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
          const cards = gsap.utils.toArray<HTMLElement>(".exp-card", stage);
          if (cards.length === 0) return;

          gsap.set(cards, {
            xPercent: 110,
            opacity: 0,
            scale: 0.9,
            filter: "blur(8px)",
            transformOrigin: "center center",
          });

          gsap.set(cards[0], {
            xPercent: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
          });
          setActiveCard(0);
          setScrollProgress(0);

          if (cards.length === 1) return;

          const totalSteps = cards.length - 1;

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              pin: section,
              start: "top top",
              // end টা viewport-based করলে layout/pin refresh এ বেশি stable থাকে
              end: () => `+=${Math.round(window.innerHeight * (cards.length * 0.95))}`,
              pinSpacing: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              refreshPriority: 0,
              onUpdate: (self) => {
                const idx = Math.min(
                  cards.length - 1,
                  Math.round(self.progress * totalSteps),
                );
                setActiveCard(idx);
                setScrollProgress(self.progress);
              },
            },
          });

          cards.forEach((card, index) => {
            if (index === 0) return;
            const previous = cards[index - 1];
            const label = `step-${index}`;

            timeline.addLabel(label);
            timeline.to(
              card,
              {
                xPercent: 0,
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                duration: 1,
                ease: "power2.out",
              },
              label,
            );
            timeline.to(
              previous,
              {
                scale: 0.78,
                opacity: 0,
                filter: "blur(8px)",
                duration: 1,
                ease: "power2.inOut",
              },
              label,
            );
          });

          timeline.to({}, { duration: 0.6 });
        });

        mm.add("(max-width: 767px)", () => {
          setActiveCard(0);
          setScrollProgress(0);
        });

        // IMPORTANT: About-এর pin spacer বসার পর offsets ঠিক রাখতে
        // Experience triggers create হওয়ার পর একবার refresh
        gsap.delayedCall(0.02, () => ScrollTrigger.refresh());

        return () => mm.revert();
      }, containerRef);
    };

    const isLoaded =
      document.documentElement.getAttribute("data-loaded") === "true";

    if (isLoaded) {
      initGSAP();
    } else {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "data-loaded" &&
            document.documentElement.getAttribute("data-loaded") === "true"
          ) {
            observer.disconnect();
            setTimeout(() => {
              initGSAP();
              ScrollTrigger.refresh();
            }, 100);
          }
        });
      });

      observer.observe(document.documentElement, { attributes: true });

      return () => {
        observer.disconnect();
        if (ctx) ctx.revert();
      };
    }

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  const formatYear = (iso: string) => new Date(iso).getFullYear().toString();

  const formatRange = (start: string, end: string | null) => {
    const s = new Date(start).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    const e = end
      ? new Date(end).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        })
      : "Present";
    return `${s} → ${e}`;
  };

  return (
    <section
      ref={containerRef}
      className="relative z-20 py-[var(--section-pad-y)] bg-[var(--bg-inverse)] text-[var(--text-inverse)] overflow-hidden"
      id="experience"
      style={
        {
          "--line": "rgba(244, 241, 234, 0.14)",
          "--line-strong": "rgba(244, 241, 234, 0.32)",
        } as React.CSSProperties
      }
    >
      <span className="absolute left-8 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 font-mono text-[0.66rem] tracking-[0.2em] uppercase text-[var(--text-muted)] opacity-50 hidden xl:block">
        § 02 — Career
      </span>

      <div className="max-w-[1400px] mx-auto px-[var(--shell-pad-x)] flex flex-col gap-[clamp(2rem,5vw,3.5rem)]">
        <header className="grid grid-cols-1 md:grid-cols-[minmax(0,8rem)_minmax(0,1fr)] gap-[clamp(1rem,4vw,3rem)] items-start w-full">
          <span className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-[var(--accent)] mt-2">
            Selected work history
          </span>
          <div className="flex flex-col gap-4">
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-[350] tracking-[-0.03em] leading-[1.05] font-display">
              Six years & counting — building{" "}
              <span className="italic text-[var(--accent)]">at the seam</span> of
              design, code, and people.
            </h2>
          </div>
        </header>

        <ol className="sr-only" role="list" aria-label="Experience timeline">
          {EXPERIENCE_DATA.map((exp) => (
            <li key={exp.company + exp.startDate} className="sr-only">
              {exp.role}
            </li>
          ))}
        </ol>

        <div
          ref={pinStageRef}
          className="relative isolate hidden md:block h-[35vh] w-full overflow-hidden border-t border-[var(--line)]"
        >
          {EXPERIENCE_DATA.map((exp, i) => {
            const isCurrent = exp.endDate === null;
            return (
              <article
                key={exp.company + exp.startDate}
                className="exp-card absolute inset-0 grid w-full grid-cols-1 md:grid-cols-[minmax(8rem,10rem)_minmax(0,1fr)] gap-[clamp(1.2rem,3vw,3rem)] bg-[var(--bg-inverse)] py-[clamp(1.5rem,4vw,3rem)] -mt-20"
                style={{ zIndex: EXPERIENCE_DATA.length - i }}
              >
                <div className="flex md:block items-start gap-3 font-mono text-[0.72rem] tracking-[0.16em] uppercase text-[var(--text-muted)]">
                  <span>0{i + 1}</span>
                  <span>{formatYear(exp.startDate)}</span>
                </div>

                <div className="relative flex flex-col gap-[1rem] min-w-0 border-l border-[var(--line)] pl-[clamp(1rem,2vw,1.75rem)]">
                  <div className="flex justify-between items-center gap-4 flex-wrap font-mono text-[0.72rem] tracking-[0.16em] uppercase text-[var(--text-muted)]">
                    <div className="inline-flex items-center gap-[0.85rem]">
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
                    {exp.role}{" "}
                    <span className="italic font-[300] text-[var(--text-muted)]">
                      at
                    </span>{" "}
                    {exp.companyUrl ? (
                      <a
                        href={exp.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-[0.3rem] text-[var(--accent)] border-b border-transparent transition-all duration-200 hover:border-[var(--accent)]"
                      >
                        {exp.company}
                        <svg
                          className="w-[0.8em] h-[0.8em] opacity-70"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M7 17L17 7M17 7H8M17 7v9" />
                        </svg>
                      </a>
                    ) : (
                      <span className="text-[var(--text-inverse)]">
                        {exp.company}
                      </span>
                    )}
                  </h3>

                  {exp.description && (
                    <p className="m-0 max-w-[60ch] text-[var(--text-secondary)] text-[1rem] leading-[1.65]">
                      {exp.description}
                    </p>
                  )}

                  <ul className="list-none m-0 p-0 flex flex-col gap-[0.65rem] max-w-[64ch]">
                    {exp.highlights.map((h) => (
                      <li
                        key={h}
                        className="grid grid-cols-[2rem_1fr] items-start gap-[0.75rem] text-[0.95rem] text-[var(--text-secondary)] leading-[1.55]"
                      >
                        <span
                          className="block w-full h-px mt-[0.85em] bg-[var(--accent)] opacity-50"
                          aria-hidden="true"
                        />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {exp.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 rounded-full border border-[var(--line)] text-[0.7rem] font-mono tracking-wider uppercase text-[var(--text-inverse)] opacity-85 transition-opacity hover:opacity-100"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="hidden md:block " aria-hidden="true">
          <div className="relative px-[clamp(0.8rem,1.2vw,1.4rem)] pt-2 ">
            <div
              className="absolute  -top-7 z-10 -translate-x-1/2 px-2.5 py-1 rounded-full border border-[var(--line-strong)] bg-transparent text-[0.66rem] font-mono tracking-[0.14em] uppercase text-[var(--accent)] transition-[left] duration-200 "
              style={{ left: `${scrollProgress * 100}%` }}
            >
              {formatYear(
                EXPERIENCE_DATA[
                  Math.min(
                    EXPERIENCE_DATA.length - 1,
                    Math.round(
                      scrollProgress *
                        Math.max(EXPERIENCE_DATA.length - 1, 1),
                    ),
                  )
                ].startDate,
              )}
            </div>

            <div className="relative h-7">
              <span className="absolute left-0 right-0 top-3 h-[2px] bg-[var(--line)]" />
              <span
                className="absolute left-0 top-3 h-[2px] bg-[var(--accent)] transition-[width] duration-200"
                style={{ width: `${scrollProgress * 100}%` }}
              />
              <div className="absolute left-0 right-0 top-1 flex items-center justify-between">
                {EXPERIENCE_DATA.map((_, index) => {
                  const dotThreshold =
                    EXPERIENCE_DATA.length > 1
                      ? index / (EXPERIENCE_DATA.length - 1)
                      : 0;
                  const isPassed = scrollProgress >= dotThreshold;
                  const isActive = index === activeCard;
                  return (
                    <span
                      key={`timeline-dot-${index}`}
                      className={`inline-flex rounded-full border transition-all duration-200 ${
                        isPassed
                          ? "bg-[var(--accent)] border-[var(--accent)]"
                          : "bg-[var(--bg-inverse)] border-[var(--line-strong)]"
                      } ${
                        isActive
                          ? "w-3.5 h-3.5 shadow-[0_0_0_6px_var(--accent-soft)]"
                          : "w-2.5 h-2.5"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden flex flex-col border-t border-[var(--line)]">
          {EXPERIENCE_DATA.map((exp, i) => {
            const isCurrent = exp.endDate === null;
            return (
              <article
                key={`${exp.company}-${exp.startDate}-mobile`}
                className="grid grid-cols-1 gap-4 py-8 border-b border-[var(--line)]"
              >
                <div className="flex items-center justify-between font-mono text-[0.68rem] tracking-[0.14em] uppercase text-[var(--text-muted)]">
                  <span>0{i + 1}</span>
                  <span>{formatRange(exp.startDate, exp.endDate)}</span>
                </div>
                <h3 className="m-0 font-display font-[350] text-[clamp(1.5rem,7vw,2.2rem)] tracking-[-0.02em] leading-[1.12]">
                  {exp.role}{" "}
                  <span className="italic font-[300] text-[var(--text-muted)]">
                    at
                  </span>{" "}
                  <span className="text-[var(--text-inverse)]">{exp.company}</span>
                </h3>
                {isCurrent && (
                  <span className="inline-flex w-fit items-center gap-[0.45rem] text-[0.72rem] font-mono tracking-[0.14em] uppercase text-[var(--accent)]">
                    <span className="w-[7px] h-[7px] rounded-full bg-[var(--accent)]" />
                    Currently
                  </span>
                )}
                {exp.description && (
                  <p className="m-0 text-[var(--text-secondary)] text-[0.98rem] leading-[1.65]">
                    {exp.description}
                  </p>
                )}
                <ul className="list-none m-0 p-0 flex flex-col gap-3">
                  {exp.highlights.map((h) => (
                    <li
                      key={`${h}-mobile`}
                      className="grid grid-cols-[1.6rem_1fr] items-start gap-3 text-[0.92rem] text-[var(--text-secondary)] leading-[1.55]"
                    >
                      <span
                        className="block w-full h-px mt-[0.8em] bg-[var(--accent)] opacity-50"
                        aria-hidden="true"
                      />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((t) => (
                    <span
                      key={`${t}-mobile`}
                      className="px-3 py-1 rounded-full border border-[var(--line)] text-[0.68rem] font-mono tracking-wider uppercase text-[var(--text-inverse)] opacity-85"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

