'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Mail, 
  ArrowUpRight, 
  FileText, 
  MapPin, 
  Clock 
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const DATA = {
  personal: {
    name: "Mehedi Hasan",
    email: "hello@mehaxan.com",
    location: "Dhaka, Bangladesh",
    social: {
      github: "https://github.com/mehaxan",
      linkedin: "https://linkedin.com/in/mehaxan",
      twitter: "https://twitter.com/mehaxan",
      medium: "https://medium.com/@mehaxan"
    }
  }
};

export default function Contact() {
  const containerRef = useRef<HTMLElement>(null);
  const [clock, setClock] = useState('--:--');
  const year = new Date().getFullYear();

  useEffect(() => {
    // Clock update
    const updateClock = () => {
      try {
        const time = new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Dhaka',
        });
        setClock(time);
      } catch {
        setClock('--:--');
      }
    };

    updateClock();
    const clockTimer = setInterval(updateClock, 30000);

    // GSAP Reveal Animations
    const ctx = gsap.context(() => {
      const reveals = containerRef.current?.querySelectorAll('.reveal-item');
      reveals?.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, containerRef);

    // Magnetic Effect
    const magneticElements = containerRef.current?.querySelectorAll('.magnetic');
    magneticElements?.forEach((el) => {
      const target = el as HTMLElement;
      const strength = parseFloat(target.dataset.strength || '20');
      
      const move = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = target.getBoundingClientRect();
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);
        
        gsap.to(target, {
          x: x * (strength / 100),
          y: y * (strength / 100),
          duration: 0.6,
          ease: 'power2.out'
        });
      };

      const reset = () => {
        gsap.to(target, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.3)'
        });
      };

      target.addEventListener('mousemove', move);
      target.addEventListener('mouseleave', reset);
    });

    return () => {
      clearInterval(clockTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative bg-[var(--bg-inverse)] text-[var(--text-inverse)] pt-[clamp(3rem,8vw,6rem)] pb-8 overflow-hidden" 
      id="contact"
      style={{
        '--line': 'rgba(244, 241, 234, 0.14)',
        '--line-strong': 'rgba(244, 241, 234, 0.32)'
      } as React.CSSProperties}
    >
      <span className="absolute left-8 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 font-mono text-[0.66rem] tracking-[0.2em] uppercase text-[var(--text-muted)] opacity-50 hidden xl:block">
        § 08 — Contact
      </span>

      <div className="max-w-[1400px] mx-auto px-[var(--shell-pad-x)] flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)]">
        <div className="reveal-item flex justify-between items-center gap-4">
          <span className="status-pill border-[var(--line-strong)]">
            <span className="w-2 h-2 rounded-full bg-[var(--status-online)] relative after:content-[''] after:absolute after:inset-[-3px] after:rounded-full after:border after:border-[var(--status-online)] after:opacity-50 after:animate-[pulseRing_2s_var(--ease-out)_infinite]"></span>
            Available · Q3 ’26
          </span>
          <span className="font-mono text-[0.72rem] tracking-[0.18em] uppercase text-[var(--text-muted)] flex items-center gap-2">
            <Clock size={14} className="text-[var(--accent)]" />
            Dhaka {clock}
          </span>
        </div>

        <h2 className="reveal-item m-0 font-[350] flex flex-col [font-variation-settings:'opsz'_144,'SOFT'_30,'WONK'_1]">
          <span className="text-[clamp(4rem,14vw,12rem)] leading-[0.88] tracking-[-0.05em]">Let’s</span>
          <span className="text-[clamp(4rem,14vw,12rem)] leading-[0.88] tracking-[-0.05em] ml-[clamp(1rem,4vw,4rem)] italic [font-variation-settings:'opsz'_144,'SOFT'_90,'WONK'_1] text-[var(--accent)]">talk.</span>
        </h2>

        <p className="reveal-item m-0 max-w-[34ch] text-[clamp(1.05rem,1.4vw,1.25rem)] line-height-[1.65] text-[var(--text-secondary)]">
          Got a project, an idea, or just want to compare notes on Angular and
          the state of the web? My inbox is unreasonably open.
        </p>

        {/* Giant email link with hover swap */}
        <a
          href={`mailto:${DATA.personal.email}`}
          className="reveal-item magnetic group flex flex-col gap-4 py-[clamp(1.5rem,4vw,2.5rem)] pb-4 text-inherit no-underline transition-transform duration-350"
          data-strength="8"
        >
          <span className="block overflow-hidden leading-none">
            <span className="relative flex flex-col font-display font-[350] italic text-[clamp(1.75rem,5vw,4rem)] tracking-[-0.03em] leading-[1.1] transition-colors duration-300 group-hover:text-[var(--accent)]">
              <span className="flex items-center gap-4 transition-all duration-500 group-hover:-translate-y-[110%] group-hover:opacity-0">
                <Mail size={32} className="hidden md:block opacity-50" strokeWidth={1.5} />
                {DATA.personal.email}
              </span>
              <span className="absolute top-full left-0 flex items-center gap-4 transition-all duration-500 opacity-0 text-[var(--accent)] group-hover:-translate-y-[110%] group-hover:opacity-100">
                Say hello <ArrowUpRight size={32} strokeWidth={1.5} />
              </span>
            </span>
          </span>
          <span className="block h-px bg-[var(--text-inverse)] opacity-30 scale-x-[0.3] origin-left transition-all duration-500 group-hover:scale-x-100 group-hover:bg-[var(--accent)] group-hover:opacity-100" aria-hidden="true"></span>
        </a>

        <div className="reveal-item flex flex-wrap items-center gap-4 md:gap-8 justify-between pt-5 border-t border-[var(--line)]">
          <a
            href="https://docs.google.com/document/d/1Ut6godpffjoHIBBgRMyNo_RtDo3vRdh2bHXuqrfm7wQ/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="magnetic btn btn--primary border-[var(--accent)] flex items-center gap-2"
            data-strength="6"
          >
            Read résumé
            <FileText size={18} strokeWidth={2} />
          </a>

          <ul className="list-none m-0 p-0 flex flex-wrap gap-2">
            {Object.entries(DATA.personal.social).map(([key, url]) => (
              <li key={key}>
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-[var(--line)] text-[0.85rem] text-[var(--text-inverse)] transition-all duration-250 hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] hover:border-[var(--accent)] hover:-translate-y-0.5"
                >
                  {key === 'github' && (
                    <svg className="w-4 h-4 opacity-70 group-hover:opacity-100" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                  )}
                  {key === 'linkedin' && (
                    <svg className="w-4 h-4 opacity-70 group-hover:opacity-100" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  )}
                  {key === 'twitter' && (
                    <svg className="w-4 h-4 opacity-70 group-hover:opacity-100" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  )}
                  {key === 'medium' && (
                    <svg className="w-4 h-4 opacity-70 group-hover:opacity-100" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                    </svg>
                  )}
                  <span className="capitalize font-medium">{key}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <footer className="mt-[clamp(3rem,6vw,5rem)] flex flex-col gap-4">
          <div className="h-px bg-[var(--line)]"></div>
          <div className="flex flex-wrap justify-between items-center gap-4 pt-4 font-mono text-[0.72rem] tracking-[0.12em] text-[var(--text-muted)]">
            <p className="m-0">
              © {year} · {DATA.personal.name} · Built with Next.js and care.
            </p>
            <p className="m-0 flex items-center gap-2">
              <span className="w-[7px] h-[7px] rounded-full bg-[var(--accent)]" aria-hidden="true"></span>
              <MapPin size={12} className="opacity-70" />
              {DATA.personal.location}
              <span className="opacity-60">— now {clock}</span>
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
}
