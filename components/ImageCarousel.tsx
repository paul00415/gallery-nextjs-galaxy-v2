'use client';

import { useEffect, useRef, useId, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroui/shared-icons';
import { Image } from '@heroui/react';

type Slide = {
  src: string;
  alt?: string;
  caption?: string;
};

type CarouselProps = {
  images: Slide[];
  autoPlay?: boolean;
  interval?: number; // ms (used in fade mode)
  className?: string;
  mode?: 'scroll' | 'fade';
  // scrollDuration controls how long one full loop takes (ms)
  scrollDuration?: number;
  direction?: 'left' | 'right';
};

export default function ImageCarousel({
  images,
  autoPlay = true,
  interval = 4000,
  className = '',
  mode = 'scroll',
  scrollDuration = 30000,
  direction = 'right',
}: CarouselProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const animationName = useId().replace(/:/g, '');
  const imagesCount = images?.length ?? 0;
  const touchStartX = useRef<number | null>(null);
  const autoplayRef = useRef<number | null>(null);

  const prev = () => setIndex((i) => (i - 1 + imagesCount) % imagesCount);
  const next = () => setIndex((i) => (i + 1) % imagesCount);
  const goTo = (i: number) => setIndex(i % imagesCount);

  // Fade-mode autoplay (legacy behaviour)
  useEffect(() => {
    if (mode !== 'fade') return;
    if (!autoPlay || imagesCount <= 1) return;
    autoplayRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % imagesCount);
    }, interval);
    return () => {
      if (autoplayRef.current) window.clearInterval(autoplayRef.current);
    };
  }, [autoPlay, interval, imagesCount, mode]);

  // Pause / resume (used for scroll mode)
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Touch handlers for swipe (only for fade mode)
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? 0;
    const diff = touchStartX.current - endX;
    const threshold = 50; // px
    if (diff > threshold) next();
    else if (diff < -threshold) prev();
    touchStartX.current = null;
  }

  // Create a unique keyframe rule for scroll mode so multiple carousels don't conflict
  useEffect(() => {
    if (mode !== 'scroll') return;

    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-carousel-style', animationName);

    if (direction === 'right') {
      styleEl.innerHTML = `
        @keyframes ${animationName} {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
      `;
    } else {
      styleEl.innerHTML = `
        @keyframes ${animationName} {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `;
    }

    document.head.appendChild(styleEl);

    return () => {
      const el = document.querySelector(
        `style[data-carousel-style="${animationName}"]`
      );
      el?.remove();
    };
  }, [mode, direction, animationName]);

  if (!imagesCount) {
    return (
      <div
        className={`w-full h-26 sm:h-32 md:h-48 bg-gray-100 dark:bg-base-700 flex items-center justify-center ${className}`}
      >
        No images
      </div>
    );
  }

  // SCROLL MODE: aligned fragments that move slowly to the right
  if (mode === 'scroll') {
    return (
      <div
        className={`relative w-full ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        aria-roledescription="carousel"
      >
        <div
          className="relative overflow-hidden rounded-lg"
          style={{
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
            maskImage:
              'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
          }}
        >
          {/* left/right gradient overlays as a fallback and for browsers that don't fully support mask */}
          <div className="absolute inset-y-0 left-0 w-16 pointer-events-none z-30 bg-gradient-to-r from-white to-transparent dark:from-[rgba(17,24,39,1)] dark:to-transparent" />
          <div className="absolute inset-y-0 right-0 w-16 pointer-events-none z-30 bg-gradient-to-l from-white to-transparent dark:from-[rgba(17,24,39,1)] dark:to-transparent" />

          <div
            className="flex"
            style={{
              animationName,
              animationDuration: `${scrollDuration}ms`,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          >
            {/* original set */}
            {images.map((slide, i) => (
              <div
                key={`a-${i}`}
                className="relative flex-shrink-0 w-[260px] sm:w-[320px] md:w-[380px] lg:w-[460px]"
                // per-slide mask: fade both edges so entering/exiting is gradual
                style={{
                  WebkitMaskImage:
                    'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
                  maskImage:
                    'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt ?? `Slide ${i + 1}`}
                  className="h-40 sm:h-52 md:h-64 lg:h-80 object-cover"
                  width={`100%`}
                />

                {(slide.caption || slide.alt) && (
                  <div className="absolute left-1/2 bottom-6 -translate-x-1/2 flex items-center justify-center z-10 pointer-events-none">
                    <div className="bg-black/60 text-white text-sm px-3 py-1 rounded pointer-events-none">
                      {slide.caption ?? slide.alt}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* duplicate set for seamless loop */}
            {images.map((slide, i) => (
              <div
                key={`b-${i}`}
                className="relative flex-shrink-0 w-[260px] sm:w-[320px] md:w-[380px] lg:w-[460px]"
                aria-hidden
                style={{
                  WebkitMaskImage:
                    'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
                  maskImage:
                    'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt ?? `Slide ${i + 1}`}
                  className="h-40 sm:h-52 md:h-64 lg:h-80 object-cover"
                  width={`100%`}
                />

                {(slide.caption || slide.alt) && (
                  <div className="absolute left-1/2 bottom-6 -translate-x-1/2 flex items-center justify-center z-10 pointer-events-none">
                    <div className="bg-black/60 text-white text-sm px-3 py-1 rounded pointer-events-none">
                      {slide.caption ?? slide.alt}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // FALLBACK: original fade/carousel behaviour
  return (
    <div
      className={`relative w-full ${className}`}
      onMouseEnter={() => {
        if (autoplayRef.current) {
          window.clearInterval(autoplayRef.current);
          autoplayRef.current = null;
        }
      }}
      onMouseLeave={() => {
        if (!autoplayRef.current && autoPlay && imagesCount > 1)
          autoplayRef.current = window.setInterval(
            () => setIndex((i) => (i + 1) % imagesCount),
            interval
          );
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      {/* Slides */}
      <div className="overflow-hidden rounded-lg">
        <div className="relative w-full">
          {images.map((slide, i) => (
            <div
              key={i}
              aria-hidden={i !== index}
              className={`relative transition-opacity duration-500 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
            >
              <Image
                src={slide.src}
                alt={slide.alt ?? `Slide ${i + 1}`}
                className="h-26 sm:h-32 md:h-48 object-cover"
                width={`100%`}
              />
              {(slide.caption || slide.alt) && (
                <div className="absolute left-1/2 bottom-6 -translate-x-1/2 flex items-center justify-center z-10 pointer-events-none">
                  <div className="bg-black/60 text-white text-sm px-3 py-1 rounded pointer-events-none">
                    {slide.caption ?? slide.alt}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next buttons */}
      {imagesCount > 1 && (
        <>
          <button
            aria-label="Previous"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 dark:bg-base-700/80 p-2 rounded-full shadow hover:bg-white dark:hover:bg-base-600"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>

          <button
            aria-label="Next"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 dark:bg-base-700/80 p-2 rounded-full shadow hover:bg-white dark:hover:bg-base-600"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/60 dark:bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
}
