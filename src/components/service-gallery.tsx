"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SmartImage } from "@/components/smart-image";

const SWIPE_THRESHOLD_PX = 40;

export function ServiceGallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (images.length === 0) return null;

  const goTo = (next: number) => setIndex(((next % images.length) + images.length) % images.length);

  return (
    <div
      className="relative h-64 w-full select-none sm:h-80"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (delta > SWIPE_THRESHOLD_PX) goTo(index - 1);
        else if (delta < -SWIPE_THRESHOLD_PX) goTo(index + 1);
        touchStartX.current = null;
      }}
    >
      {images.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className="absolute inset-0 transition-opacity duration-500 ease-in-out"
          style={{ opacity: i === index ? 1 : 0, zIndex: i === index ? 1 : 0 }}
          aria-hidden={i !== index}
        >
          <SmartImage src={src} alt={alt} fill sizes="100vw" className="object-cover" />
        </div>
      ))}

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Önceki görsel"
            className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-navy-950/50 text-white backdrop-blur-sm transition hover:bg-navy-950/75"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Sonraki görsel"
            className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-navy-950/50 text-white backdrop-blur-sm transition hover:bg-navy-950/75"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <span className="absolute bottom-3 right-3 z-20 rounded-full bg-navy-950/60 px-2.5 py-1 text-xs font-medium text-white">
            {index + 1} / {images.length}
          </span>
        </>
      )}
    </div>
  );
}
