"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import profile from "../../public/Picture.jpg";
import TextHover from "../../ui/TextHover";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: "6+", label: "Years shipping" },
  { value: "40+", label: "Projects in flight" },
  { value: "5", label: "Conference talks" },
  { value: "∞", label: "Cups of coffee" },
];

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const revealRefs = useRef<(HTMLElement | null)[]>([]);
  const headerRef = useRef<HTMLElement>(null);

  const archRef = useRef<HTMLSpanElement[]>(null);
  const thoughtRef = useRef<HTMLSpanElement[]>(null);
  const userRef = useRef<HTMLSpanElement[]>(null);
  const teamRef = useRef<HTMLSpanElement[]>(null);

  const headerLabelRef = useRef<HTMLSpanElement>(null);
  const headerRightBlockRef = useRef<HTMLDivElement>(null);

  const triggerWordHover = (chars: HTMLSpanElement[] | null) => {
    if (!chars || !chars.length) return;
    if (gsap.isTweening(chars[0])) return;
    gsap.to(chars, {
      keyframes: [
        { y: "-100%", opacity: 0, duration: 0.25, ease: "power2.in" },
        { y: "100%", opacity: 0, duration: 0.01 },
        { y: "0%", opacity: 1, duration: 0.25, ease: "power2.out" },
      ],
      stagger: 0.04,
    });
  };

  useEffect(() => {
    let ctx: gsap.Context;

    const initGSAP = () => {
      ctx = gsap.context(() => {
        // ── Header: set hidden FIRST, then animate on scroll ──
        if (
          headerRef.current &&
          headerLabelRef.current &&
          headerRightBlockRef.current
        ) {
          // hide before any scroll
          gsap.set(headerLabelRef.current, { opacity: 0, x: -100 });
          gsap.set(headerRightBlockRef.current, { opacity: 0, x: -150 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 95%",
              toggleActions: "play none none reset",
            },
          });

          tl.to(headerLabelRef.current, {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
          }).to(
            headerRightBlockRef.current,
            {
              opacity: 1,
              x: 0,
              duration: 1.2,
              ease: "power3.out",
            },
            "-=0.6",
          );
        }

        // ── Reveal animations ──
        revealRefs.current.forEach((el) => {
          if (!el) return;
          gsap.set(el, { opacity: 0, y: 30 });
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reset",
            },
          });
        });

        // ── Category slide animations ──
        const categories = document.querySelectorAll(".reveal-category");
        if (categories.length > 0) {
          gsap.set(categories, { opacity: 0, y: 20 });
          gsap.to(categories, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: categories[0],
              start: "top 80%",
              toggleActions: "play none none reset",
            },
          });
        }

        // ── Stats stagger ──
        gsap.set(".stat-item", { opacity: 0, y: 100 });
        gsap.to(".stat-item", {
          opacity: 1,
          y: 100,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".stats-strip",
            start: "top 90%",
            toggleActions: "play none none reset",
          },
        });
      }, containerRef);
    };

    // Check if the initial loading screen has finished
    const isLoaded =
      document.documentElement.getAttribute("data-loaded") === "true";

    if (isLoaded) {
      initGSAP();
    } else {
      // Hide elements initially so they don't flash while the loader is active
      if (headerLabelRef.current)
        gsap.set(headerLabelRef.current, { opacity: 0 });
      if (headerRightBlockRef.current)
        gsap.set(headerRightBlockRef.current, { opacity: 0 });

      // Wait for the loader to finish setting data-loaded="true"
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "data-loaded" &&
            document.documentElement.getAttribute("data-loaded") === "true"
          ) {
            observer.disconnect();
            // Wait a tiny bit for layout to settle, refresh ScrollTrigger, and start
            setTimeout(() => {
              ScrollTrigger.refresh();
              initGSAP();
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

  const addToReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative border py-10 overflow-hidden"
      id="about"
    >
      <span className="absolute left-8 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 font-mono text-[0.66rem] tracking-[0.2em] uppercase text-[var(--text-muted)] opacity-50 hidden xl:block">
        § 01 — About
      </span>

      <div className="max-w-[1400px] mx-auto px-[var(--shell-pad-x)] flex flex-col gap-16">
        {/* ── Header ── */}
        <header
          ref={headerRef}
          className="flex flex-col md:flex-row items-start"
        >
          {/* Left label */}
          <span
            ref={headerLabelRef}
            className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-[var(--accent)] md:writing-mode-vertical shrink-0 md:mt-2 whitespace-nowrap"
          >
            Engineering that thinks ahead.
          </span>

          {/* Right block */}
          <div ref={headerRightBlockRef} className="w-full justify-end flex">
            <div>
              <h2 className="text-5xl font-bold tracking-wide [word-spacing:0.1em] leading-[1.05] font-display px-1">
                <span
                  className="block transition-colors duration-300 hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] cursor-pointer"
                  onMouseEnter={() => triggerWordHover(archRef.current)}
                >
                  Clean <TextHover ref={archRef} text="architecture" />.
                </span>
                <span
                  className="block transition-colors duration-300 hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] cursor-pointer"
                  onMouseEnter={() => triggerWordHover(thoughtRef.current)}
                >
                  <TextHover ref={thoughtRef} text="Thoughtful" /> interfaces.
                </span>
                <span
                  className="block italic text-[var(--accent)] hover:text-[var(--accent-ink)] transition-colors duration-300 hover:bg-[var(--accent)] cursor-pointer"
                  onMouseEnter={() => triggerWordHover(userRef.current)}
                >
                  Felt by the <TextHover ref={userRef} text="user" />.
                </span>
                <span
                  className="block transition-colors duration-300 hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] cursor-pointer"
                  onMouseEnter={() => triggerWordHover(teamRef.current)}
                >
                  And Built for the <TextHover ref={teamRef} text="team" />.
                </span>
              </h2>
            </div>
          </div>
        </header>

        {/* ── Prose + Visual ── */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-[clamp(2rem,6vw,5rem)] items-start">
          {/* Prose */}
          <article
            ref={addToReveal}
            className="max-w-[38rem] text-[1.05rem] text-[var(--text-secondary)] leading-[1.7]"
          >
            <p className="mb- after:content-[''] after:table after:clear-both">
              <span className="float-left font-display italic font-normal text-[4.5em] leading-[0.85] pt-[0.15em] pr-[0.18em] text-[var(--accent)]">
                I
              </span>
              'm a dedicated Software Engineer with a deep-rooted foundation in
              Computer Science, currently pursuing my B.Sc. in CSE after
              completing a Diploma in Engineering. My core expertise revolves
              around building high-performance, cross-platform applications
              using Next.js and React Native.
            </p>

            {/* Category Slides */}
            <div className="space-y-2 ">
              {/* Architecture & State */}
              <div className="reveal-category border-b border-[var(--line)]">
                <h3 className="font-display text-[1.3rem] font-semibold text-[var(--accent)] ">
                  Architecture & State
                </h3>
                <p className="text-[var(--text-secondary)] leading-[1.7]">
                  I ensure seamless data flow and performance by integrating
                  TanStack Query for efficient caching, coupled with Zod for
                  strict schema validation, making the codebase predictable and
                  secure.
                </p>
              </div>

              {/* Database & Logic */}
              <div className="reveal-category border-b border-[var(--line)]">
                <h3 className="font-display text-[1.3rem] font-semibold text-[var(--accent)]">
                  Database & Logic
                </h3>
                <p className="text-[var(--text-secondary)] leading-[1.7]">
                  On the backend, I leverage the power of Prisma or Drizzle ORM
                  to maintain type-safe interactions with databases like
                  PostgreSQL or MongoDB, ensuring that the data layer is as
                  scalable as the UI.
                </p>
              </div>

              {/* Performance & UI */}
              <div className="reveal-category border-b border-[var(--line)]">
                <h3 className="font-display text-[1.3rem] font-semibold text-[var(--accent)]">
                  Performance & UI
                </h3>
                <p className="text-[var(--text-secondary)] leading-[1.7]">
                  My focus is always on lightweight UI design and fast data
                  rendering, optimized to run smoothly across any device—from
                  high-end desktops to mobile platforms.
                </p>
              </div>

              {/* Security */}
              <div className="reveal-category border-b border-[var(--line)]">
                <h3 className="font-display text-[1.3rem] font-semibold text-[var(--accent)]">
                  Security
                </h3>
                <p className="text-[var(--text-secondary)] leading-[1.7]">
                  I implement secure, industry-standard authentication using
                  NextAuth.js or Clerk, keeping user data protected while
                  maintaining a friction-less experience.
                </p>
              </div>

              {/* Philosophy */}
              <div className="reveal-category ">
                <p className="text-[var(--text-secondary)] leading-[1.7] italic">
                  Whether I am designing an intuitive frontend or a reliable
                  backend, my goal remains the same: to bridge the gap between
                  complex requirements and clean, high-performance execution
                  that stands the test of time.
                </p>
              </div>
            </div>

            <div className="w-full ">
              <ul className="list-none m-0 p-0 pt-6 border-t border-[var(--line)] flex flex-wrap gap-x-10 gap-y-6">
                <li className="flex flex-col gap-1">
                  <span className="font-mono text-[0.66rem] tracking-[0.2em] uppercase text-[var(--text-muted)]">
                    Based
                  </span>
                  <span className="text-[0.95rem] text-[var(--text-primary)]">
                    BOGURA, Bangladesh
                  </span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="font-mono text-[0.66rem] tracking-[0.2em] uppercase text-[var(--text-muted)]">
                    Education
                  </span>
                  <span className="text-[0.95rem] text-[var(--text-primary)]">
                    B.Sc. in CSE / Diploma in Engineering
                  </span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="font-mono text-[0.66rem] tracking-[0.2em] uppercase text-[var(--text-muted)]">
                    Status
                  </span>
                  <span className="text-[0.95rem] text-[var(--accent)]">
                    Open to projects
                  </span>
                </li>
              </ul>
            </div>
          </article>

          {/* Visual */}
          <aside
            ref={addToReveal}
            className="md:sticky md:top-24 flex flex-col gap-6"
          >
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

            <div
              className="flex items-center gap-4 text-[var(--text-secondary)]"
              aria-hidden="true"
            >
              <span className="font-display italic text-[2.5rem] leading-none text-[var(--accent)]">
                MH
              </span>
              <svg
                className="w-36 h-10 opacity-70"
                viewBox="0 0 200 60"
                preserveAspectRatio="none"
              >
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

        {/* ── Pull quote ── */}
        <blockquote
          ref={addToReveal}
          className="m-0 py-[clamp(2rem,5vw,4rem)] border-y border-[var(--line)] grid grid-cols-[minmax(2rem,5rem)_1fr] gap-6 items-start"
        >
          <span className="font-display italic text-[clamp(5rem,12vw,9rem)] leading-[0.6] text-[var(--accent)]">
            "
          </span>
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

        {/* ── Stats strip ── */}
        <ul className="stats-strip list-none m-0 p-0 grid grid-cols-2 md:grid-cols-4 border-y border-[var(--line)]">
          {STATS.map((stat) => (
            <li
              key={stat.label}
              className="stat-item flex flex-col items-center justify-center py-10 px-4 text-center border-r border-[var(--line)] last:border-0 md:even:border-r"
            >
              <span className="text-[clamp(2rem,4vw,3.5rem)] font-display italic font-medium leading-none text-[var(--text-primary)] mb-2">
                {stat.value}
              </span>
              <span className="font-mono text-[0.66rem] tracking-[0.2em] uppercase text-[var(--text-muted)]">
                {stat.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
