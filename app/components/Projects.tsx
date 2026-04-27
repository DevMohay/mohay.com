'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
    name: "mehaxan",
    description: "Personal portfolio website built with Angular 21 and deployed on Cloudflare Workers. You're looking at it right now!",
    technologies: ["Angular", "TypeScript", "Tailwind CSS", "Cloudflare Workers"],
    url: "https://mehaxan.dev",
    github: "https://github.com/mehaxan/mehaxan",
    featured: true
  },
  {
    name: "Side Project 2",
    description: "A description of your side project goes here. Update this in portfolio.json or your Gist.",
    technologies: ["Angular", "Node.js", "MongoDB"],
    url: "",
    github: "",
    featured: false
  },
  {
    name: "Side Project 3",
    description: "A description of your side project goes here. Update this in portfolio.json or your Gist.",
    technologies: ["React", "TypeScript", "PostgreSQL"],
    url: "",
    github: "",
    featured: false
  }
];

const DRAG_CLICK_THRESHOLD_PX = 6;

export default function Projects() {
  const containerRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const featuredProjects = useMemo(() => PROJECTS_DATA.filter(p => p.featured), []);
  const moreProjects = useMemo(() => PROJECTS_DATA.filter(p => !p.featured), []);
  
  const dragStartX = useRef(0);
  const scrollStart = useRef(0);
  const dragMoved = useRef(0);

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

      // Rail reveal
      if (railRef.current) {
        gsap.fromTo(
          railRef.current,
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: railRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Panels stagger reveal
      gsap.fromTo(
        '.panel',
        { opacity: 0, x: 100 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: railRef.current,
            start: 'top 75%',
          },
        }
      );

      // More projects reveal
      gsap.fromTo(
        '.more-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.more-list',
            start: 'top 90%',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
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
    rail.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const rail = railRef.current;
    if (!rail || e.pointerType === 'touch') return;
    
    setIsDragging(true);
    dragStartX.current = e.clientX;
    scrollStart.current = rail.scrollLeft;
    dragMoved.current = 0;
    
    rail.classList.add('is-dragging');
    
    const onPointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - dragStartX.current;
      dragMoved.current = Math.max(dragMoved.current, Math.abs(dx));
      rail.scrollLeft = scrollStart.current - dx;
    };

    const onPointerUp = () => {
      setIsDragging(false);
      rail.classList.remove('is-dragging');
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const onCardClick = (e: React.MouseEvent) => {
    if (dragMoved.current > DRAG_CLICK_THRESHOLD_PX) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <section ref={containerRef} className="relative py-[var(--section-pad-y)] overflow-hidden" id="projects">
      <span className="absolute left-8 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 font-mono text-[0.66rem] tracking-[0.2em] uppercase text-[var(--text-muted)] opacity-50 hidden xl:block">
        § 04 — Projects
      </span>

      <div className="max-w-[1400px] mx-auto px-[var(--shell-pad-x)] flex flex-col gap-[clamp(2.5rem,6vw,4rem)]">
        <header ref={headRef} className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-[42rem]">
            <span className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-[var(--accent)]">Selected projects</span>
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-[350] tracking-[-0.03em] leading-[1.05] font-display mt-2">
              Things I’ve made <span className="italic text-[var(--accent)]">on the side</span> — mostly to scratch an itch.
            </h2>
          </div>

          <div className="flex flex-col items-end gap-3">
            <span className="font-display italic text-[clamp(2.25rem,4vw,3.25rem)] text-[var(--accent)] leading-none tracking-[-0.04em]">
              {pad(activeIndex + 1)} / {pad(featuredProjects.length)}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => scrollByCard(-1)}
                disabled={activeIndex === 0}
                className="w-10 h-10 rounded-full border border-[var(--line-strong)] flex items-center justify-center transition-all hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] hover:border-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous project"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              </button>
              <button 
                onClick={() => scrollByCard(1)}
                disabled={activeIndex >= featuredProjects.length - 1}
                className="w-10 h-10 rounded-full border border-[var(--line-strong)] flex items-center justify-center transition-all hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] hover:border-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next project"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </header>

        <div 
          ref={railRef}
          onScroll={onRailScroll}
          onPointerDown={onPointerDown}
          className="flex gap-[clamp(1.25rem,2.5vw,2rem)] overflow-x-auto scroll-snap-x mandatory no-scrollbar cursor-grab select-none smooth-scroll active:cursor-grabbing"
          role="region"
          aria-label={`Featured projects, ${featuredProjects.length} items`}
          tabIndex={0}
        >
          <div className="flex-shrink-0 w-[var(--shell-pad-x)]" aria-hidden="true" />
          
          {featuredProjects.map((project) => (
            <article key={project.name} className="panel flex-shrink-0 w-[min(86vw,64rem)] scroll-snap-start bg-[var(--bg-card)] border border-[var(--line)] overflow-hidden grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] min-h-[28rem] transition-colors hover:border-[var(--line-strong)] shadow-[var(--shadow-soft)]">
              <div className="relative bg-[var(--bg-surface)] overflow-hidden">
                {project.image ? (
                  <img src={project.image} alt={project.name} className="w-full h-full object-cover transition-transform duration-800 hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[radial-gradient(circle_at_30%_30%,var(--accent-soft),transparent_60%)] bg-[var(--bg-surface)]">
                    <span className="font-display italic font-[350] text-[clamp(6rem,18vw,14rem)] leading-none text-[var(--accent)] opacity-45 tracking-[-0.06em]">
                      {project.name.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="absolute top-4 left-4 px-3 py-1.5 font-mono text-[0.66rem] tracking-[0.16em] uppercase text-[var(--accent-ink)] bg-[var(--accent)] rounded-full">Featured</span>
              </div>

              <div className="p-[clamp(1.75rem,3vw,2.75rem)] flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-[0.72rem] tracking-[0.16em] uppercase text-[var(--text-muted)] m-0">
                    {project.technologies[0]} <span className="mx-2 opacity-50">/</span> Case study
                  </p>
                  <h3 className="text-[clamp(2rem,3.6vw,3rem)] font-[350] tracking-[-0.03em] leading-[1.05] m-0 font-display">{project.name}</h3>
                  <p className="text-[var(--text-secondary)] text-base leading-relaxed max-w-[48ch] m-0">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map(tech => (
                      <span key={tech} className="px-3 py-1 bg-[rgba(244,241,234,0.06)] border border-[var(--line)] rounded-full text-xs font-medium text-[var(--text-secondary)]">{tech}</span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" onClick={onCardClick} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-inverse)] text-[var(--text-inverse)] rounded-full text-[0.85rem] font-medium transition-all hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] hover:-translate-y-0.5">
                      Visit live
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 17L17 7M17 7H8M17 7v9"/></svg>
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={onCardClick} className="inline-flex items-center gap-2 px-4 py-2.5 bg-transparent text-[var(--text-primary)] border border-[var(--line-strong)] rounded-full text-[0.85rem] font-medium transition-all hover:bg-[var(--text-primary)] hover:text-[var(--bg-card)] hover:border-[var(--text-primary)]">
                      Source
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
          
          <div className="flex-shrink-0 w-[var(--shell-pad-x)]" aria-hidden="true" />
        </div>

        <div className="flex items-center gap-4 mt-6">
          <span className="h-px flex-1 bg-[var(--line-strong)] opacity-30" />
          <span className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-[var(--text-muted)]">Drag · Scroll · ←/→</span>
          <span className="h-px flex-1 bg-[var(--line-strong)] opacity-30" />
        </div>

        {moreProjects.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-8 more-head">
              <span className="eyebrow">Also worth a look</span>
              <span className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-[var(--accent)]">{moreProjects.length} more</span>
            </div>

            <ul className="grid grid-cols-1 gap-4 more-list list-none p-0 m-0" role="list">
              {moreProjects.map((project) => (
                <li key={project.name} className="more-item">
                  <a 
                    href={project.url || project.github || '#'} 
                    target={(project.url || project.github) ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[rgba(244,241,234,0.02)] border border-[var(--line)] transition-all hover:bg-[rgba(244,241,234,0.05)] hover:border-[var(--line-strong)]"
                  >
                    <div className="flex flex-col gap-1 flex-1">
                      <span className="text-lg font-display italic text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{project.name}</span>
                      <span className="text-sm text-[var(--text-secondary)] line-clamp-1">{project.description}</span>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="hidden sm:flex gap-2">
                        {project.technologies.slice(0, 3).map(tech => (
                          <span key={tech} className="px-2 py-0.5 bg-[rgba(244,241,234,0.06)] border border-[var(--line)] rounded-full text-[0.65rem] font-medium text-[var(--text-muted)]">{tech}</span>
                        ))}
                      </div>
                      <span className="text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 17L17 7M17 7H8M17 7v9"/></svg>
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
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
