"use client";

import { useState } from "react";
import { SmartImage } from "@/components/smart-image";

export function BeforeAfterSlider({
  before,
  after,
  title,
}: {
  before: string;
  after: string;
  title: string;
}) {
  const [position, setPosition] = useState(50);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative aspect-[4/3] w-full select-none overflow-hidden">
        <SmartImage
          src={after}
          alt={`${title} - sonrası`}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover"
        />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <SmartImage
            src={before}
            alt={`${title} - öncesi`}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-gold-400"
          style={{ left: `${position}%` }}
        />

        <span className="absolute left-3 top-3 rounded-full bg-navy-950/80 px-3 py-1 text-xs font-semibold text-sand-50">
          Öncesi
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-gold-500/90 px-3 py-1 text-xs font-semibold text-navy-950">
          Sonrası
        </span>

        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          aria-label={`${title} öncesi/sonrası karşılaştırma kaydırıcısı`}
          className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gold-400 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
        />
      </div>
      <div className="px-5 py-4">
        <p className="font-medium text-navy-950">{title}</p>
      </div>
    </div>
  );
}
