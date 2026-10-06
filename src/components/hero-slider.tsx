"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { SmartImage } from "@/components/smart-image";
import type { Hero } from "@/lib/content";

const AUTOPLAY_MS = 6000;

export function HeroSlider({ hero }: { hero: Hero }) {
  const { slides } = hero;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  const goTo = (next: number) => {
    setIndex(((next % slides.length) + slides.length) % slides.length);
  };

  return (
    <section
      className="relative h-[560px] overflow-hidden bg-navy-950 sm:h-[640px] lg:h-[720px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === index ? 1 : 0, zIndex: i === index ? 1 : 0 }}
          aria-hidden={i !== index}
        >
          <SmartImage
            src={slide.image}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      <div className="relative z-10 flex h-full items-center justify-center">
        <Container className="flex flex-col items-center gap-7 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[44rem] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-[3rem] bg-navy-950/40 blur-3xl"
          />

          <span className="relative inline-flex items-center gap-2 rounded-full border border-gold-400/50 bg-navy-950/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-300 shadow-[0_2px_20px_rgba(0,0,0,0.35)]">
            {hero.badge}
          </span>

          <h1 className="relative max-w-3xl font-heading text-4xl font-semibold leading-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.65)] sm:text-5xl lg:text-6xl">
            {hero.title}
          </h1>

          <p className="relative max-w-xl text-base leading-relaxed text-sand-50 [text-shadow:0_1px_12px_rgba(0,0,0,0.6)] sm:text-lg">
            {hero.description}
          </p>

          <div className="relative flex flex-col gap-3 sm:flex-row">
            <Button
              render={<Link href={hero.ctaPrimaryHref} />}
              nativeButton={false}
              size="lg"
              className="bg-gold-500 text-navy-950 shadow-lg hover:bg-gold-400"
            >
              {hero.ctaPrimaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              render={<Link href={hero.ctaSecondaryHref} />}
              nativeButton={false}
              size="lg"
              variant="outline"
              className="border-white/40 bg-navy-950/30 text-white hover:bg-white/10 hover:text-white"
            >
              {hero.ctaSecondaryLabel}
            </Button>
          </div>
        </Container>
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Önceki görsel"
            className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-navy-950/50 text-white backdrop-blur-sm transition hover:bg-navy-950/75 sm:left-6"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Sonraki görsel"
            className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-navy-950/50 text-white backdrop-blur-sm transition hover:bg-navy-950/75 sm:right-6"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </section>
  );
}
