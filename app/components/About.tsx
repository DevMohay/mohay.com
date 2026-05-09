"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import profile from "../../public/Picture.jpg";
import TextHover from "../../ui/TextHover";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: "4+", label: "Years Of Experience" },
  { value: "5", label: "Live App on Play Store" },
  { value: "30+", label: "web sites" },
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
    let ctx: gsap.Context | undefined;

    const wrapTextLetters = (element: HTMLElement) => {
      if (!element) return;

      const textNodes: Node[] = [];
      const walk = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
      let node: Node | null;
      while ((node = walk.nextNode())) {
        textNodes.push(node);
      }

      textNodes.forEach((textNode) => {
        const text = textNode.nodeValue || "";
        if (text.trim() === "") return;

        const fragment = document.createDocumentFragment();
        text.split("").forEach((char) => {
          if (char === " ") {
            fragment.appendChild(document.createTextNode(" "));
          } else {
            const span = document.createElement("span");
            span.textContent = char;
            span.className = "text-letter inline-block";
            fragment.appendChild(span);
          }
        });
        textNode.parentNode?.replaceChild(fragment, textNode);
      });
    };

    const initGSAP = () => {
      ctx = gsap.context(() => {
        // 1) DOM mutation (wrap letters) -> create ScrollTriggers AFTER this,
        //    so they calculate correct positions on first run.
        const paras = document.querySelectorAll("#articale article p");
        paras.forEach((p) => wrapTextLetters(p as HTMLElement));

        const letters = document.querySelectorAll(".text-letter");
        gsap.set(letters, { opacity: 0.25 });

        const categories = document.querySelectorAll(".reveal-category");
        gsap.set(categories, { opacity: 0, y: 80 });

        const articleBox = document.querySelector("#articale article");
        const asideBox = document.querySelector("#articale aside");

        gsap.set("#articale", { position: "relative" });

        // 2) Initial Entrance (before pinning)
        gsap.fromTo(
          [articleBox, asideBox],
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "#articale",
              start: "top 95%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          },
        );

        // 3) Pinned Article timeline
        const tlArticale = gsap.timeline({
          scrollTrigger: {
            trigger: "#articale",
            start: "top 10%",
            end: () => {
              const articleHeight =
                articleBox instanceof HTMLElement ? articleBox.scrollHeight : 0;
              const asideHeight =
                asideBox instanceof HTMLElement ? asideBox.scrollHeight : 0;
              const base = Math.max(articleHeight, asideHeight, window.innerHeight);
              return `+=${Math.round(base * 0.9)}`;
            },
            pin: true,
            pinSpacing: true,
            scrub: 1,
            markers: false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // pinned sections should refresh early so following triggers (Experience etc.)
            // calculate after the pin-spacer is applied.
            refreshPriority: 1,
            preventOverlaps: "section-pins",
          },
        });

        tlArticale.to(
          letters,
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
          },
          0,
        );

        if (categories.length > 0) {
          const totalDuration = letters.length * 0.1;
          categories.forEach((cat, i) => {
            const startTime = (totalDuration / (categories.length + 1)) * (i + 1);
            tlArticale.to(
              cat,
              {
                opacity: 1,
                y: 0,
                duration: 2,
                ease: "power2.out",
              },
              startTime,
            );
          });
        }

        // 4) Header animation
        if (
          headerRef.current &&
          headerLabelRef.current &&
          headerRightBlockRef.current
        ) {
          gsap.set(headerLabelRef.current, { opacity: 0, x: -100 });
          gsap.set(headerRightBlockRef.current, { opacity: 0, x: -150 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 95%",
              toggleActions: "play none none reset",
              invalidateOnRefresh: true,
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

        // 5) Generic reveal animations
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
              invalidateOnRefresh: true,
            },
          });
        });

        // 6) Stats stagger
        // gsap.set(".stat-item", { opacity: 0, y: 100 });
        // gsap.to(".stat-item", {
        //   opacity: 1,
        //   y: 100,
        //   duration: 0.8,
        //   stagger: 0.1,
        //   ease: "power2.out",
        //   scrollTrigger: {
        //     trigger: ".stats-strip",
        //     start: "top 90%",
        //     toggleActions: "play none none reset",
        //     invalidateOnRefresh: true,
        //   },
        // });

        // IMPORTANT: Refresh AFTER all About ScrollTriggers (including pin) are created.
        // This makes sure next sections (Experience etc.) get correct offsets after pin-spacer.
        gsap.delayedCall(0.02, () => ScrollTrigger.refresh());
      }, containerRef);
    };

    const isLoaded =
      document.documentElement.getAttribute("data-loaded") === "true";

    if (isLoaded) {
      initGSAP();
    } else {
      if (headerLabelRef.current) gsap.set(headerLabelRef.current, { opacity: 0 });
      if (headerRightBlockRef.current)
        gsap.set(headerRightBlockRef.current, { opacity: 0 });

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

  const addToReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <section ref={containerRef} className="relative  py-10 overflow-hidden" id="about">
      <span className="absolute left-8 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 font-mono text-[0.66rem] tracking-[0.2em] uppercase text-[var(--text-muted)] opacity-50 hidden xl:block">
        § 01 — About
      </span>

      <div className="max-w-[1400px] mx-auto px-[var(--shell-pad-x)] flex flex-col">
        {/* ── Header ── */}
        <header ref={headerRef} className="flex flex-col md:flex-row items-start mb-10">
          <span
            ref={headerLabelRef}
            className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-[var(--accent)] md:writing-mode-vertical shrink-0 md:mt-2 whitespace-nowrap"
          >
            Engineering that thinks ahead.
          </span>

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
        <div
          id="articale"
          className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]  items-start mb-10"
        >
          <article className="max-w-[38rem] text-[1.05rem] text-[var(--text-secondary)] leading-[1.7]">
            <p className="mb- after:content-[''] after:table after:clear-both">
              <span className="float-left font-display italic font-normal text-[4.5em] leading-[0.85] pt-[0.15em] pr-[0.18em] text-[var(--accent)]">
                I
              </span>
              'm a dedicated Software Engineer with a deep-rooted foundation in Computer Science, currently pursuing my
              B.Sc. in CSE after completing a Diploma in Engineering. My core expertise revolves around building
              high-performance, cross-platform applications using Next.js and React Native.
            </p>

            <div className="space-y-2 ">
              <div className="reveal-category border-b border-[var(--line)]">
                <h3 className="font-display text-[1.3rem] font-semibold text-[var(--accent)] ">
                  Architecture & State
                </h3>
                <p className="text-[var(--text-secondary)] leading-[1.7]">
                  I ensure seamless data flow and performance by integrating TanStack Query for efficient caching,
                  coupled with Zod for strict schema validation, making the codebase predictable and secure.
                </p>
              </div>

              <div className="reveal-category border-b border-[var(--line)]">
                <h3 className="font-display text-[1.3rem] font-semibold text-[var(--accent)]">Database & Logic</h3>
                <p className="text-[var(--text-secondary)] leading-[1.7]">
                  On the backend, I leverage the power of Prisma or Drizzle ORM to maintain type-safe interactions with
                  databases like PostgreSQL or MongoDB, ensuring that the data layer is as scalable as the UI.
                </p>
              </div>

              <div className="reveal-category border-b border-[var(--line)]">
                <h3 className="font-display text-[1.3rem] font-semibold text-[var(--accent)]">Performance & UI</h3>
                <p className="text-[var(--text-secondary)] leading-[1.7]">
                  My focus is always on lightweight UI design and fast data rendering, optimized to run smoothly across
                  any device—from high-end desktops to mobile platforms.
                </p>
              </div>

              <div className="reveal-category border-b border-[var(--line)]">
                <h3 className="font-display text-[1.3rem] font-semibold text-[var(--accent)]">Security</h3>
                <p className="text-[var(--text-secondary)] leading-[1.7]">
                  I implement secure, industry-standard authentication using NextAuth.js or Clerk, keeping user data
                  protected while maintaining a friction-less experience.
                </p>
              </div>

              <div className="reveal-category ">
                <p className="text-[var(--text-secondary)] leading-[1.7] italic">
                  Whether I am designing an intuitive frontend or a reliable backend, my goal remains the same: to
                  bridge the gap between complex requirements and clean, high-performance execution that stands the test
                  of time.
                </p>
              </div>
            </div>
          </article>

          <aside className="flex flex-col gap-6">
            <figure className="relative m-0 aspect-[4/5] overflow-hidden bg-[var(--bg-surface)] border border-[var(--line)] shadow-[var(--shadow-soft)] group">
              <Image
                src={profile}
                alt="Mehedi Hasan"
                fill
                className="object-cover grayscale-[15%] contrast-[1.05] transition-all duration-700 group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-105"
                sizes="(max-w-768px) 100vw, 40vw"
              />
              <figcaption className="absolute bottom-3 left-3 right-3 flex justify-between font-mono text-[0.66rem] tracking-[0.12em] uppercase text-white bg-[rgba(14,14,12,0.55)] backdrop-blur-[6px] p-2 px-[0.6rem] rounded">
                <span>Profile. 01</span>
                <span>Mohayminul Islam</span>
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

        <ul className="list-none m-0 p-0 grid grid-cols-1 md:grid-cols-3 border-y border-[var(--line)]">
          <li className="flex flex-col justify-center items-start md:items-center py-10 px-6 border-b md:border-b-0 md:border-r border-[var(--line)] last:border-0">
            <span className="font-mono text-[0.66rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-2">
              Based
            </span>
            <span className="text-[0.95rem] text-[var(--text-primary)]">BOGURA, Bangladesh</span>
          </li>
          <li className="flex flex-col justify-center items-start md:items-center py-10 px-6 border-b md:border-b-0 md:border-r border-[var(--line)] last:border-0">
            <span className="font-mono text-[0.66rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-2">
              Education
            </span>
            <span className="text-[0.95rem] text-[var(--text-primary)] text-center">
              B.Sc. in CSE / Diploma in Engineering
            </span>
          </li>
          <li className="flex flex-col justify-center items-start md:items-center py-10 px-6 border-b md:border-b-0 border-[var(--line)] last:border-0">
            <span className="font-mono text-[0.66rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-2">
              Status
            </span>
            <span className="text-[0.95rem] text-[var(--accent)]">Open to projects</span>
          </li>
        </ul>

        <ul className="list-none m-0 p-0 grid grid-cols-1 md:grid-cols-4 border-y border-[var(--line)]">
          <li className="flex flex-col justify-center items-start md:items-center py-10 px-6 border-b md:border-b-0 md:border-r border-[var(--line)] last:border-0">
            <span className="font-mono text-sm md:text-sm lg:text-sm  tracking-[0.2em] uppercase text-[var(--text-muted)] mb-2">
              Years Of Experience
            </span>
            <span className="text-2xl md:text-3xl lg:text-4xl text-[var(--text-primary)]">4+</span>
          </li>
          <li className="flex flex-col justify-center items-start md:items-center py-10 px-6 border-b md:border-b-0 md:border-r border-[var(--line)] last:border-0">
            <span className="font-mono text-sm md:text-sm lg:text-sm  tracking-[0.2em] uppercase text-[var(--text-muted)] mb-2">
              Clients
            </span>
            <span className="text-2xl md:text-3xl lg:text-4xl text-[var(--text-primary)] text-center">
              10+
            </span>
          </li>
          <li className="flex flex-col justify-center items-start md:items-center py-10 px-6 border-b md:border-b-0 md:border-r border-[var(--line)] last:border-0">
            <span className="font-mono text-sm md:text-sm lg:text-sm  tracking-[0.2em] uppercase text-[var(--text-muted)] mb-2">
              Projects
            </span>
            <span className="text-2xl md:text-3xl lg:text-4xl text-[var(--accent)]">25+</span>
          </li>
           <li className="flex flex-col justify-center items-start md:items-center py-10 px-6 border-b md:border-b-0 border-[var(--line)] last:border-0">
            <span className="font-mono text-sm md:text-sm lg:text-sm  tracking-[0.2em] uppercase text-[var(--text-muted)] mb-2">
                Cup of coffee
            </span>
            <span className="text-2xl md:text-3xl lg:text-4xl text-[var(--accent)]">∞</span>
          </li>
        </ul>

        {/* <ul className="list-none m-0 p-0 grid grid-cols-1 md:grid-cols-4 border-y border-[var(--line)]" id="stats-strip">
          {STATS.map((stat) => (
            <li
              key={stat.label}
              className=" stat-item flex flex-col items-center justify-center py-10 px-4 text-center border-[var(--line)] border-r border-b md:border-b-0 [&:nth-child(2n)]:border-r-0 md:[&:nth-child(2n)]:border-r md:last:border-r-0 [&:nth-child(3)]:border-b-0 [&:nth-child(4)]:border-b-0"
            >
              <span className="text-[clamp(2rem,4vw,3.5rem)] font-display italic font-medium leading-none text-[var(--text-primary)] mb-2">
                {stat.value}
              </span>
              <span className="font-mono text-[0.66rem] tracking-[0.2em] uppercase text-[var(--text-muted)]">
                {stat.label}
              </span>
            </li>
          ))}
        </ul> */}

        {/* Example reveal target usage (optional)
        <blockquote
          ref={addToReveal}
          className="m-0 py-10 border-[var(--line)] grid grid-cols-[minmax(2rem,5rem)_1fr] gap-6 items-start"
        >
          ...
        </blockquote>
        */}
        <div ref={addToReveal as any} style={{ display: "none" }} />
      </div>
    </section>
  );
}

