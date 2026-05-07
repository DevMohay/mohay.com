"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextHover from "../../ui/TextHover";
import Iframe from "../../ui/iframe";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  featured: boolean;
  image?: string;
}

const PROJECTS_DATA: Project[] = [
  {
    name: "B-Rent",
    description:
      "A comprehensive bike rental platform with features for booking, management, and user profiles. Built with a focus on seamless user experience and performance.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Cloudflare"],
    url: "https://b-rent-seven.vercel.app/",
    github: "https://github.com/mohaymin-islam/b-rent",
    featured: true,
  },
  {
    name: "Side Project 2",
    description:
      "A description of your side project goes here. Update this in portfolio.json or your Gist.",
    technologies: ["Angular", "Node.js", "MongoDB"],
    url: "",
    github: "",
    featured: false,
  },
  {
    name: "Side Project 3",
    description:
      "A description of your side project goes here. Update this in portfolio.json or your Gist.",
    technologies: ["React", "TypeScript", "PostgreSQL"],
    url: "",
    github: "",
    featured: false,
  },
];

const DRAG_CLICK_THRESHOLD_PX = 6;

export default function Projects() {
  const containerRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const appsRef = useRef<HTMLSpanElement[]>(null);
  const productionRef = useRef<HTMLSpanElement[]>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const triggerWordAnimation = (chars: HTMLSpanElement[] | null) => {
    if (!chars || !chars.length) return;
    if (gsap.isTweening(chars[0])) return;
    return gsap.to(chars, {
      keyframes: [
        { y: "-100%", opacity: 0, duration: 0.25, ease: "power2.in" },
        { y: "100%", opacity: 0, duration: 0.01 },
        { y: "0%", opacity: 1, duration: 0.25, ease: "power2.out" },
      ],
      stagger: 0.04,
    });
  };
  const [isDragging, setIsDragging] = useState(false);

  const featuredProjects = useMemo(
    () => PROJECTS_DATA.filter((p) => p.featured),
    [],
  );
  const moreProjects = useMemo(
    () => PROJECTS_DATA.filter((p) => !p.featured),
    [],
  );

  const dragStartX = useRef(0);
  const scrollStart = useRef(0);
  const dragMoved = useRef(0);

  useEffect(() => {
    let ctx: gsap.Context;

    const initGSAP = () => {
      ctx = gsap.context(() => {
        // Head reveal
        if (headRef.current) {
          gsap.fromTo(
            headRef.current,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: headRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
                onEnter: () => {
                  // Sequential word animations
                  const tl = gsap.timeline();
                  tl.add(
                    () => triggerWordAnimation(appsRef.current),
                    "+=0.3",
                  ).add(
                    () => triggerWordAnimation(productionRef.current),
                    "+=0.8",
                  );
                },
              },
            },
          );
        }

        // Rail reveal
        if (railRef.current) {
          gsap.fromTo(
            railRef.current,
            { opacity: 0, x: 50 },
            {
              opacity: 1,
              x: 0,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: railRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // Panels stagger reveal
        gsap.fromTo(
          ".panel",
          { opacity: 0, x: 100 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: railRef.current,
              start: "top 75%",
            },
          },
        );

        // More projects reveal
        gsap.fromTo(
          ".more-item",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".more-list",
              start: "top 90%",
            },
          },
        );
      }, containerRef);
    };

    // Check if the initial loading screen has finished
    const isLoaded =
      document.documentElement.getAttribute("data-loaded") === "true";

    if (isLoaded) {
      initGSAP();
    } else {
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

  const onRailScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const cardWidth = el.scrollWidth / Math.max(featuredProjects.length, 1);
    const idx = Math.round(el.scrollLeft / cardWidth);
    if (idx !== activeIndex) {
      setActiveIndex(Math.max(0, Math.min(featuredProjects.length - 1, idx)));
    }
  };

  const scrollByCard = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const cardWidth = rail.scrollWidth / Math.max(featuredProjects.length, 1);
    rail.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const rail = railRef.current;
    if (!rail || e.pointerType === "touch") return;

    setIsDragging(true);
    dragStartX.current = e.clientX;
    scrollStart.current = rail.scrollLeft;
    dragMoved.current = 0;

    rail.classList.add("is-dragging");

    const onPointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - dragStartX.current;
      dragMoved.current = Math.max(dragMoved.current, Math.abs(dx));
      rail.scrollLeft = scrollStart.current - dx;
    };

    const onPointerUp = () => {
      setIsDragging(false);
      rail.classList.remove("is-dragging");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const onCardClick = (e: React.MouseEvent) => {
    if (dragMoved.current > DRAG_CLICK_THRESHOLD_PX) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <section
      ref={containerRef}
      className="relative py-[var(--section-pad-y)] overflow-hidden"
      id="projects"
    >
      <span className="absolute left-8 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 font-mono text-[0.66rem] tracking-[0.2em] uppercase text-[var(--text-muted)] opacity-50 hidden xl:block">
        § 04 — Projects
      </span>

      <div className="max-w-[1400px] mx-auto px-[var(--shell-pad-x)] flex flex-col gap-[clamp(2.5rem,6vw,4rem)]">
        <header
          ref={headRef}
          className="flex flex-col md:flex-row justify-between items-end gap-8"
        >
          <div className="w-full">
            <span className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-[var(--accent)]">
              Things I Launched
            </span>
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-[350] tracking-[-0.03em] leading-[1.05] font-display mt-2">
              <span
                className="italic text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] transition-colors duration-300 cursor-pointer"
                onMouseEnter={() => triggerWordAnimation(appsRef.current)}
              >
                <TextHover ref={appsRef} text="Apps" />
              </span>{" "}
              I shipped to the Store And
              <br />
              <span>
                Sites I pushed to{" "}
                <span
                  className="italic text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] transition-colors duration-300 cursor-pointer"
                  onMouseEnter={() =>
                    triggerWordAnimation(productionRef.current)
                  }
                >
                  <TextHover ref={productionRef} text="production" />
                </span>
              </span>{" "}
              built — because the idea wouldn't leave me alone.
            </h2>
          </div>
        </header>

        <div className=" max-w-[1480px] mx-auto">
          <Iframe url="https://b-rent-seven.vercel.app/" title="Preview" />
        </div>

        <div className="flex items-center gap-4 mt-6">
          <span className="h-px flex-1 bg-[var(--line-strong)] opacity-30" />
          <span className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-[var(--text-muted)]">
            Drag · Scroll · ←/→
          </span>
          <span className="h-px flex-1 bg-[var(--line-strong)] opacity-30" />
        </div>

        {/* {moreProjects.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-8 more-head">
              <span className="eyebrow">Also worth a look</span>
              <span className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-[var(--accent)]">
                {moreProjects.length} more
              </span>
            </div>

            <ul
              className="grid grid-cols-1 gap-4 more-list list-none p-0 m-0"
              role="list"
            >
              {moreProjects.map((project) => (
                <li key={project.name} className="more-item">
                  <a
                    href={project.url || project.github || "#"}
                    target={
                      project.url || project.github ? "_blank" : undefined
                    }
                    rel="noopener noreferrer"
                    className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[rgba(244,241,234,0.02)] border border-[var(--line)] transition-all hover:bg-[rgba(244,241,234,0.05)] hover:border-[var(--line-strong)]"
                  >
                    <div className="flex flex-col gap-1 flex-1">
                      <span className="text-lg font-display italic text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                        {project.name}
                      </span>
                      <span className="text-sm text-[var(--text-secondary)] line-clamp-1">
                        {project.description}
                      </span>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="hidden sm:flex gap-2">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 bg-[rgba(244,241,234,0.06)] border border-[var(--line)] rounded-full text-[0.65rem] font-medium text-[var(--text-muted)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <span className="text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M7 17L17 7M17 7H8M17 7v9" />
                        </svg>
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )} */}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .smooth-scroll {
          scroll-behavior: smooth;
        }
        .is-dragging {
          scroll-behavior: auto !important;
        }
      `}</style>
    </section>
  );
}
