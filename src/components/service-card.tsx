import { CheckCircle2 } from "lucide-react";
import type { Service } from "@/lib/content";
import { SmartImage } from "@/components/smart-image";

export function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  return (
    <article
      id={service.slug}
      className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
    >
      <div className="relative h-64 w-full sm:h-80">
        <SmartImage
          src={service.image}
          alt={service.title}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <span className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-gold-500 font-heading text-sm font-semibold text-navy-950">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-col gap-5 p-8 sm:p-10">
        <h3 className="font-heading text-2xl font-semibold text-navy-950 sm:text-3xl">
          {service.title}
        </h3>
        <div className="space-y-4">
          {service.longDescription.map((paragraph, i) => (
            <p key={i} className="text-sm leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>
        <ul className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-gold-500" />
              <span className="text-foreground/90">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
