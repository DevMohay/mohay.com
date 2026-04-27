"use client";
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';

function HomeLoader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const loadingTextRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const timeout = setTimeout(() => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();

        const loaderLogo = logoWrapperRef.current;
        const navLogo = document.getElementById('nav-logo');
        const navHeader = document.getElementById('nav-bg');

        // Initial state
        gsap.set(loaderLogo, { y: 20, opacity: 0 });
        gsap.set(barRef.current, { scaleX: 0 });

        // 1. Fade in logo
        tl.to(loaderLogo, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        })
        // 2. Animate progress bar
        .to(barRef.current, {
          scaleX: 1,
          duration: 1.0,
          ease: "power2.inOut",
        }, "-=0.4")

        // 3. Slingshot arc to nav logo
        .add(() => {
          if (navLogo && loaderLogo) {
            const navRect = navLogo.getBoundingClientRect();
            const loaderRect = loaderLogo.getBoundingClientRect();

            const deltaX = navRect.left - loaderRect.left;
            const deltaY = navRect.top - loaderRect.top;

            // Fade out progress elements
            gsap.to([progressContainerRef.current, loadingTextRef.current], {
              opacity: 0,
              duration: 0.3,
              ease: "power2.inOut",
            });

            // Reveal nav background (logo still invisible)
            if (navHeader) {
              gsap.set(navHeader, { opacity: 1, visibility: 'visible' });
            }

            /*
             * Slingshot path — 3 keyframes:
             *
             *  [0] Start (current center position)
             *  [1] Overshoot far LEFT — logo swings out wide
             *  [2] Land at nav logo position
             *
             * overshootX: push left of the final deltaX by a fixed amount
             * overshootY: slightly above mid-point for a natural arc feel
             */
            const overshootX = deltaX - 320;          // fixed far-left swing
            const overshootY = deltaY * 0.35;          // 35% of total vertical travel

            gsap.to(loaderLogo, {
              duration: 1.6,
              ease: "power2.inOut",
              keyframes: [
                {
                  // Phase 1 — swing far left (40% of duration)
                  x: overshootX,
                  y: overshootY,
                  rotation: -18,
                  scale: 0.88,
                  duration: 0.64,          // 40% of 1.6s
                  ease: "power2.out",
                },
                {
                  // Phase 2 — slingshot back to nav (60% of duration)
                  x: deltaX,
                  y: deltaY,
                  rotation: 0,
                  scale: 1,
                  duration: 0.96,          // 60% of 1.6s
                  ease: "power3.inOut",
                },
              ],
              onComplete: () => {
                // Signal nav to reveal its logo
                document.documentElement.setAttribute('data-loaded', 'true');

                /*
                 * Smooth swap — crossfade instead of instant toggle
                 * 1. Fade nav logo IN over 200ms
                 * 2. Simultaneously fade loader logo OUT
                 * 3. Then fade loader background
                 */
                gsap.set(navLogo, { autoAlpha: 0 });   // ensure it starts at 0 for crossfade

                gsap.to(navLogo, {
                  autoAlpha: 1,
                  duration: 0.2,
                  ease: "none",
                });

                gsap.to(loaderLogo, {
                  opacity: 0,
                  duration: 0.2,
                  ease: "none",
                  onComplete: () => {
                    gsap.to(containerRef.current, {
                      opacity: 0,
                      duration: 0.4,
                      ease: "power2.inOut",
                      onComplete: () => {
                        gsap.set(containerRef.current, { display: 'none' });
                      },
                    });
                  },
                });
              },
            });
          }
        }, "+=0.1");

      }, containerRef);

      return () => ctx.revert();
    }, 50);

    return () => clearTimeout(timeout);
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0C0C0C]"
    >
      <div ref={logoWrapperRef} className="relative mb-4 flex items-center justify-center z-[10000]">
        <div className="inline-flex items-baseline gap-[0.35rem] font-mono text-[0.82rem] font-medium tracking-[0.02em] text-[var(--text-primary)]">
          <span className="inline-flex items-center justify-center w-[1.55rem] h-[1.55rem] rounded-full bg-[var(--accent)] text-[var(--accent-ink)] font-display italic font-medium text-base leading-none mr-[0.35rem]">M</span>
          <span className="text-[var(--text-primary)]">mohayminul</span>
          <span className="text-[var(--accent)] animate-[navBlink_1.1s_steps(2)_infinite]" aria-hidden="true">_</span>
        </div>
      </div>

      <div ref={progressContainerRef} className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
        <div
          ref={barRef}
          className="absolute inset-0 bg-[#2F2FE4] origin-left"
        />
      </div>

      <div ref={loadingTextRef} className="mt-4 text-[#666666] text-xs font-mono uppercase tracking-[0.2em]">
        Loading Experience
      </div>
    </div>,
    document.body
  );
}

export default HomeLoader;