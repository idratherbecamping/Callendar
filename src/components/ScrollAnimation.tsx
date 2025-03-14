"use client";

import React, { useEffect, useRef, useState } from 'react';

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  animationClass: 'fade-in' | 'slide-up' | 'slide-in-right' | 'slide-in-left';
  threshold?: number; // 0 to 1, default 0.1
  delay?: number; // in ms
}

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  className = '',
  animationClass,
  threshold = 0.1,
  delay = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the element is visible
        if (entry.isIntersecting) {
          // Add a delay if specified
          if (delay) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
          } else {
            setIsVisible(true);
          }

          // Once it's visible, we don't need to observe anymore
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        // When 10% of the element is visible
        threshold: threshold
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, delay]);

  return (
    <div
      ref={ref}
      className={`${className} ${animationClass} ${isVisible ? 'appear' : ''}`}
    >
      {children}
    </div>
  );
};

export default ScrollAnimation;
