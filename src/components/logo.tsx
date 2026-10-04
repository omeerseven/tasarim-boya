import Link from "next/link";
import { cn } from "@/lib/utils";
import { SmartImage } from "@/components/smart-image";

const DEFAULT_LOGO_SRC = "/tasarim-boya-mark.png";

export function Logo({
  className,
  dark,
  src = DEFAULT_LOGO_SRC,
}: {
  className?: string;
  dark?: boolean;
  src?: string;
}) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <span className="relative h-11 w-11 shrink-0 sm:h-12 sm:w-12">
        <SmartImage
          src={src}
          alt="Tasarım Boya logosu"
          fill
          sizes="48px"
          className="object-contain"
          priority
        />
      </span>
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            "font-heading text-xl font-semibold tracking-tight",
            dark ? "text-sand-50" : "text-navy-950",
          )}
        >
          Tasarım
          <span className="text-gold-500"> Boya</span>
        </span>
        <span
          className={cn(
            "font-tagline text-[13px] italic tracking-wide sm:text-sm",
            dark ? "text-gold-300/90" : "text-gold-600",
          )}
        >
          Hayallerinizi Tasarlıyoruz
        </span>
      </span>
    </Link>
  );
}
