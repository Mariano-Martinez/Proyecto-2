'use client';

import { useEffect } from 'react';

export const ScrollReveal = () => {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.fade-in-on-scroll'));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px' }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
};
