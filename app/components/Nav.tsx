'use client';

import React, { useState, useEffect, useRef } from 'react';

interface NavLink {
  label: string;
  href: string;
}

const LINKS: NavLink[] = [
  { label: 'Index', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Writing', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Check if we are already loaded (for route changes or late mounts)
    const checkLoaded = () => {
      if (document.documentElement.getAttribute('data-loaded') === 'true') {
        const navLogo = document.getElementById('nav-logo');
        if (navLogo) {
          navLogo.classList.remove('invisible');
          navLogo.style.opacity = '1';
          navLogo.style.visibility = 'visible';
        }
      }
    };

    checkLoaded();
    
    // Also listen for changes to data-loaded attribute
    const dataLoadedObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-loaded') {
          checkLoaded();
        }
      });
    });

    dataLoadedObserver.observe(document.documentElement, { attributes: true });

    // Scroll handling
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll);

    // Theme initialization
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    // Section observation
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.current?.observe(section);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.current?.disconnect();
      dataLoadedObserver.disconnect();
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const scrollTo = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header id='nav-bg' className={`fixed inset-x-0 top-0 z-[99] flex justify-center px-[var(--shell-pad-x)] pointer-events-none transition-[padding] duration-300 ease-[var(--ease-out)] ${scrolled ? 'pt-3' : 'py-5'}`} >
      <div className={`pointer-events-auto flex items-center gap-4 pl-[1.1rem] pr-[0.55rem] py-[0.45rem] rounded-full border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-card)_75%,transparent)] backdrop-blur-[18px] backdrop-saturate-[140%] shadow-[var(--shadow-soft)] transition-[border-color,background] duration-300 ease-[var(--ease-out)] max-w-full ${scrolled ? 'border-[var(--line-strong)]' : ''}`}>
        <a 
          className="inline-flex items-baseline gap-[0.35rem] font-mono text-[0.82rem] font-medium tracking-[0.02em] text-[var(--text-primary)] relative  invisible"
          id='nav-logo'
          href="#hero" 
          onClick={(e) => scrollTo('#hero', e)}
          aria-label="Mehaxan — home"
        >
          <span className="inline-flex items-center justify-center w-[1.55rem] h-[1.55rem] rounded-full bg-[var(--accent)] text-[var(--accent-ink)] font-display italic font-medium text-base leading-none mr-[0.35rem]">M</span>
          <span className="text-[var(--text-primary)]">mohayminul</span>
          <span className="text-[var(--accent)] animate-[navBlink_1.1s_steps(2)_infinite]" aria-hidden="true">_</span>
        </a>

        <nav className="hidden md:inline-flex items-center gap-[0.15rem] px-2 border-x border-[var(--line)]" aria-label="Section navigation">
          {LINKS.map((link) => (
            <a
              key={link.href}
              className={`relative inline-flex items-center gap-4 px-[0.7rem] py-[0.45rem] text-[0.83rem] font-medium transition-[color,background] duration-200 ease-[var(--ease-out)] rounded-full hover:text-[var(--text-primary)] ${activeSection === link.href.slice(1) ? 'text-[var(--text-primary)] bg-[var(--accent-soft)]' : 'text-[var(--text-secondary)]'}`}
              href={link.href}
              onClick={(e) => scrollTo(link.href, e)}
            >
              <span className={`w-1 h-1 rounded-full bg-current transition-[opacity,transform,background] duration-250 ease-[var(--ease-out)] ${activeSection === link.href.slice(1) ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.6]'}`} aria-hidden="true"></span>
              <span className="">{link.label}</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-[0.35rem]">
          <button
            className="w-[2.8rem] h-[1.6rem] p-[0.2rem] rounded-full bg-[var(--bg-surface)] border border-[var(--line)] relative transition-[background,border-color] duration-300 ease-[var(--ease-out)] hover:border-[var(--line-strong)]"
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            data-theme={theme}
          >
            <span className="relative w-full h-full flex items-center" aria-hidden="true">
              <span className={`absolute w-[1.1rem] h-[1.1rem] bg-[var(--accent)] rounded-full transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-20 ${theme === 'light' ? 'translate-x-0' : 'translate-x-[1.2rem]'}`}></span>
              <svg className={`absolute w-[0.7rem] h-[0.7rem] z-10 transition-[opacity,transform] duration-300 ease-[var(--ease-out)] left-[0.25rem] text-[var(--accent-ink)] ${theme === 'dark' ? 'opacity-0 scale-50 -rotate-45' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>
              </svg>
              <svg className={`absolute w-[0.7rem] h-[0.7rem] z-10 transition-[opacity,transform] duration-300 ease-[var(--ease-out)] right-[0.25rem] text-[var(--text-muted)] ${theme === 'light' ? 'opacity-0 scale-50 rotate-45' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>
              </svg>
            </span>
          </button>

          <button
            className="hidden max-md:flex flex-col justify-center gap-1 w-[2.2rem] h-[2.2rem] p-2 rounded-full transition-colors duration-200 ease-[var(--ease-out)] hover:bg-[var(--line)]"
            type="button"
            onClick={toggleMobile}
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
          >
            <span className={`block w-full h-[1.5px] bg-[var(--text-primary)] rounded-full transition-[transform,opacity] duration-400 ease-[var(--ease-out)] ${mobileOpen ? 'translate-y-[3px] rotate-45' : ''}`}></span>
            <span className={`block w-full h-[1.5px] bg-[var(--text-primary)] rounded-full transition-[transform,opacity] duration-400 ease-[var(--ease-out)] ${mobileOpen ? '-translate-y-[3px] -rotate-45' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div 
        className={`fixed inset-0 bg-[rgba(14,14,12,0.2)] backdrop-blur-[4px] z-[55] transition-opacity duration-400 ease-[var(--ease-out)] ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={toggleMobile} 
        aria-hidden="true"
      ></div>
      <nav 
        className={`fixed top-20 right-[var(--shell-pad-x)] w-[calc(100%-var(--shell-pad-x)*2)] max-w-[320px] bg-[var(--bg-card)] border border-[var(--line-strong)] rounded-[1.5rem] p-6 z-[65] shadow-[var(--shadow-lift)] transition-[opacity,transform] duration-400 ease-[var(--ease-out)] ${mobileOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-[10px] scale-[0.98] pointer-events-none'}`} 
        aria-hidden={!mobileOpen}
      >
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-[var(--text-muted)] mb-4">Index</p>
        <ul className="list-none p-0 m-0 flex flex-col gap-1">
          {LINKS.map((link, i) => (
            <li key={link.href}>
              <a
                className={`flex items-center gap-4 px-4 py-[0.8rem] text-[1.1rem] font-medium rounded-[0.75rem] transition-[background,color] duration-200 ease-[var(--ease-out)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] ${activeSection === link.href.slice(1) ? 'bg-[var(--accent-soft)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
                href={link.href}
                onClick={(e) => scrollTo(link.href, e)}
              >
                <span className="font-mono text-[0.7rem] text-[var(--accent)]">0{i + 1}</span>
                <span>{link.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-6 pt-[1.25rem] border-t border-[var(--line)] flex justify-center">
          <span className="status-pill"><span className="dot"></span>Available · 2026</span>
        </div>
      </nav>
    </header>
  );
}
