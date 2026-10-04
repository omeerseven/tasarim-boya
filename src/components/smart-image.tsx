import Image from "next/image";

const SAFE_REMOTE_HOSTS = new Set(["images.unsplash.com"]);

function isNextImageSafe(src: string): boolean {
  if (src.startsWith("/")) return true;
  try {
    const url = new URL(src);
    return SAFE_REMOTE_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

type SmartImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
} & (
  | { fill: true; width?: never; height?: never }
  | { fill?: false; width: number; height: number }
);

/**
 * Renders admin-editable images that may point to arbitrary external URLs.
 * Falls back to a plain <img> for hosts not registered in next.config.ts,
 * so pasting any image URL in the admin panel never crashes the page.
 */
export function SmartImage({ src, alt, className, sizes, priority, fill, width, height }: SmartImageProps) {
  if (isNextImageSafe(src)) {
    return fill ? (
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} />
    ) : (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className={className}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={fill ? `absolute inset-0 h-full w-full object-cover ${className ?? ""}` : className}
      loading={priority ? "eager" : "lazy"}
    />
  );
}
