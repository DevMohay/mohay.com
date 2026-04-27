'use client';

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { gsap } from 'gsap';

export interface TextHoverProps {
  text: string;
  className?: string;
  stagger?: number;
  duration?: number;
}

const TextHover = forwardRef<HTMLSpanElement[], TextHoverProps>(
  ({ text, className = '', stagger = 0.04, duration = 0.25 }, ref) => {
    const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

    // Expose the array of character DOM nodes to the parent (useful for custom entrance animations)
    useImperativeHandle(ref, () => charRefs.current.filter(Boolean) as HTMLSpanElement[]);

    const handleHover = () => {
      const chars = charRefs.current.filter(Boolean);
      if (!chars.length) return;

      // Prevent restarting if already animating to avoid jumping
      if (gsap.isTweening(chars[0])) return;

      gsap.to(chars, {
        keyframes: [
          { y: '-100%', opacity: 0, duration: duration, ease: 'power2.in' },
          { y: '100%', opacity: 0, duration: 0.01 },
          { y: '0%', opacity: 1, duration: duration, ease: 'power2.out' },
        ],
        stagger: stagger,
      });
    };

    return (
      <span
        className={`cursor-pointer transition-all ${className}`}
        style={{ display: 'inline-flex', overflow: 'hidden', position: 'relative' }}
        onMouseEnter={handleHover}
        aria-label={text}
      >
        {text.split('').map((char, i) => (
          <span key={i} style={{ display: 'inline-block', position: 'relative' }}>
            <span style={{ display: 'inline-block', verticalAlign: 'bottom' }}>
              <span
                ref={(el) => {
                  charRefs.current[i] = el;
                }}
                style={{
                  display: 'inline-block',
                  minWidth: char === ' ' ? '0.3em' : 'auto',
                  willChange: 'transform, opacity',
                }}
              >
                {char}
              </span>
            </span>
          </span>
        ))}
      </span>
    );
  }
);

TextHover.displayName = 'TextHover';
export default TextHover;
