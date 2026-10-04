import Image from "next/image";
import { Star } from "lucide-react";
import { testimonials } from "@/lib/data";
import { unsplash } from "@/lib/unsplash";

export function TestimonialsSection() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {testimonials.map((testimonial) => (
        <div
          key={testimonial.name}
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={
                  i < testimonial.rating
                    ? "h-4 w-4 fill-gold-400 text-gold-400"
                    : "h-4 w-4 text-muted-foreground/30"
                }
              />
            ))}
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            &ldquo;{testimonial.text}&rdquo;
          </p>
          <div className="mt-auto flex items-center gap-3 pt-2">
            <div className="relative h-11 w-11 flex-none overflow-hidden rounded-full">
              <Image
                src={unsplash(testimonial.image, 200)}
                alt={testimonial.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-navy-950">
                {testimonial.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {testimonial.location}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
