'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BlogPost {
  title: string;
  mediumUrl: string;
  date: string;
  summary: string;
  readingTime: string;
}

const BLOG_DATA: BlogPost[] = [
  {
    title: "Getting Started with Angular Signals",
    mediumUrl: "https://medium.com/@mehaxan",
    date: "2025-10-01",
    summary: "A practical guide to Angular Signals — the new reactivity primitive replacing Zone.js change detection in modern Angular applications.",
    readingTime: "6 min read"
  },
  {
    title: "Deploying Angular Apps to Cloudflare Workers",
    mediumUrl: "https://medium.com/@mehaxan",
    date: "2025-08-15",
    summary: "Step-by-step walkthrough of deploying an Angular SSR application to Cloudflare Workers using @angular/ssr and Wrangler.",
    readingTime: "8 min read"
  },
  {
    title: "Mastering RxJS in Angular",
    mediumUrl: "https://medium.com/@mehaxan",
    date: "2025-05-20",
    summary: "Deep dive into the RxJS operators every Angular developer should know, with real-world examples from production codebases.",
    readingTime: "10 min read"
  }
];

export default function Blog() {
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

      // Featured reveal
      gsap.fromTo(
        '.featured-reveal',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.featured-reveal',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // List reveal
      gsap.fromTo(
        '.post-item-reveal',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.post-list-reveal',
            start: 'top 85%',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const featured = BLOG_DATA[0];
  const remaining = BLOG_DATA.slice(1);

  return (
    <section ref={containerRef} className="relative py-[var(--section-pad-y)] overflow-hidden" id="blog">
      <span className="absolute left-8 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 font-mono text-[0.66rem] tracking-[0.2em] uppercase text-[var(--text-muted)] opacity-50 hidden xl:block">
        § 06 — Writing
      </span>

      <div className="max-w-[1400px] mx-auto px-[var(--shell-pad-x)] flex flex-col gap-[clamp(2.5rem,5vw,4rem)]">
        <header ref={headRef} className="flex justify-between items-end gap-6">
          <div className="flex flex-col gap-[0.5rem]">
            <span className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-[var(--accent)]">Long-form</span>
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-[350] tracking-[-0.03em] leading-[1.05] font-display m-0">
              Notes from <span className="italic text-[var(--accent)]">the desk.</span>
            </h2>
          </div>
          <a
            href="https://medium.com/@mehaxan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-[0.45rem] font-mono text-[0.78rem] tracking-[0.12em] uppercase text-[var(--text-secondary)] border-b border-[var(--line)] pb-2 transition-all hover:text-[var(--accent)] hover:border-[var(--accent)]"
          >
            All on Medium
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M7 17L17 7M17 7H8M17 7v9"/>
            </svg>
          </a>
        </header>

        {/* Featured Post */}
        {featured && (
          <a
            href={featured.mediumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="featured-reveal group relative grid grid-cols-1 gap-6 py-[clamp(1.75rem,4vw,3rem)] border-y border-[var(--line)] transition-all duration-400"
          >
            <div className="absolute inset-0 bg-[var(--accent-soft)] opacity-0 transition-opacity duration-400 group-hover:opacity-100 pointer-events-none" />
            
            <div className="relative z-10 flex items-center flex-wrap gap-[0.85rem] font-mono text-[0.72rem] tracking-[0.16em] uppercase text-[var(--text-muted)]">
              <span className="text-[var(--accent)]">Featured · Latest</span>
              <span className="w-8 h-px bg-[var(--text-muted)] opacity-60" aria-hidden="true"></span>
              <span>{formatDate(featured.date)}</span>
              {featured.readingTime && <span>{featured.readingTime}</span>}
            </div>

            <h3 className="relative z-10 m-0 font-display italic font-[350] text-[clamp(2rem,5vw,4rem)] tracking-[-0.03em] leading-[1.05] text-[var(--text-primary)] max-w-[22ch] transition-colors duration-300 group-hover:text-[var(--accent)]">
              {featured.title}
            </h3>

            <p className="relative z-10 m-0 max-w-[56ch] text-[1.05rem] leading-[1.7] text-[var(--text-secondary)]">
              {featured.summary}
            </p>

            <span className="relative z-10 inline-flex items-center gap-[0.55rem] font-mono text-[0.78rem] tracking-[0.12em] uppercase text-[var(--accent)]">
              Read the piece
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </a>
        )}

        {/* Post List */}
        {remaining.length > 0 && (
          <ol className="post-list-reveal list-none m-0 p-0" role="list">
            {remaining.map((post) => (
              <li key={post.title} className="post-item-reveal border-b border-[var(--line)]">
                <a
                  href={post.mediumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-1 md:grid-cols-[10rem_1fr_auto] items-start gap-7 py-[1.6rem] relative transition-all duration-300 text-[var(--text-primary)] hover:pl-3"
                >
                  <span className="absolute left-[-0.5rem] top-1/2 -translate-y-1/2 w-[0.4rem] h-[0.4rem] rounded-full bg-[var(--accent)] opacity-0 scale-50 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100" />
                  
                  <span className="pt-1.5 font-mono text-[0.72rem] tracking-[0.14em] uppercase text-[var(--text-muted)]">
                    {formatDate(post.date)}
                  </span>

                  <div className="flex flex-col gap-1.5">
                    <h4 className="m-0 font-display font-normal italic text-[clamp(1.2rem,2.2vw,1.85rem)] tracking-[-0.02em] leading-[1.2] inline-block w-fit bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] bg-[length:0%_1px] bg-[0%_100%] bg-no-repeat transition-all duration-400 group-hover:bg-[length:100%_1px] group-hover:text-[var(--accent)]">
                      {post.title}
                    </h4>
                    <p className="m-0 text-[var(--text-secondary)] text-[0.95rem] leading-[1.6] max-w-[56ch]">
                      {post.summary}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-[0.85rem] self-center">
                    {post.readingTime && (
                      <span className="font-mono text-[0.7rem] tracking-[0.14em] uppercase text-[var(--text-muted)]">
                        {post.readingTime}
                      </span>
                    )}
                    <span className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M7 17L17 7M17 7H8M17 7v9"/>
                      </svg>
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
