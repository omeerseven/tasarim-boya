import { Phone } from "lucide-react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M16.004 2.667c-7.364 0-13.333 5.97-13.333 13.333 0 2.459.671 4.76 1.838 6.734L2.667 29.333l6.76-1.776a13.26 13.26 0 0 0 6.577 1.776h.006c7.363 0 13.333-5.97 13.333-13.333S23.368 2.667 16.004 2.667Zm0 24.195h-.005a11.02 11.02 0 0 1-5.606-1.535l-.402-.24-4.013 1.054 1.072-3.912-.262-.402a10.98 10.98 0 0 1-1.684-5.827c0-6.08 4.95-11.03 11.035-11.03 2.947 0 5.716 1.15 7.797 3.232a10.95 10.95 0 0 1 3.232 7.803c-.003 6.08-4.953 11.03-11.033 11.03ZM21.95 18.6c-.325-.163-1.925-.95-2.223-1.06-.298-.11-.515-.163-.732.163-.217.325-.84 1.06-1.03 1.278-.19.217-.38.244-.705.081-.325-.162-1.373-.506-2.615-1.613-.967-.861-1.62-1.925-1.81-2.25-.19-.325-.02-.5.163-.678.163-.163.37-.433.542-.65.173-.217.23-.37.345-.617.115-.244.057-.46-.057-.65-.14-.19-.542-1.3-.743-1.783-.198-.47-.4-.407-.55-.414l-.47-.008c-.163 0-.428.06-.656.325-.228.264-.87.85-.87 2.075 0 1.225.892 2.407 1.016 2.575.125.163 1.74 2.656 4.22 3.62 2.48.964 2.48.642 2.928.602.447-.04 1.446-.59 1.65-1.16.203-.57.203-1.06.142-1.163-.06-.102-.244-.163-.512-.285Z" />
    </svg>
  );
}

export function FloatingContactButtons({
  phoneHref,
  whatsappNumber,
}: {
  phoneHref: string;
  whatsappNumber: string;
}) {
  return (
    <div
      className="fixed right-4 z-40 flex flex-col items-end gap-3 sm:right-6"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
    >
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp üzerinden bize yazın"
        className="group relative flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg ring-1 ring-black/5 transition-transform hover:scale-105 active:scale-95 sm:h-14 sm:w-14"
      >
        <WhatsAppIcon className="h-6 w-6" />
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md bg-navy-950 px-3 py-1.5 text-xs font-medium text-sand-50 opacity-0 transition-opacity group-hover:opacity-100 sm:block">
          WhatsApp&apos;tan Yazın
        </span>
      </a>

      <a
        href={`tel:${phoneHref}`}
        aria-label="Bizi arayın"
        className="group relative flex h-13 w-13 items-center justify-center rounded-full bg-navy-950 text-gold-400 shadow-lg ring-1 ring-black/5 transition-transform hover:scale-105 hover:bg-navy-800 active:scale-95 sm:h-14 sm:w-14"
      >
        <Phone className="h-6 w-6" />
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md bg-navy-950 px-3 py-1.5 text-xs font-medium text-sand-50 opacity-0 transition-opacity group-hover:opacity-100 sm:block">
          Hemen Arayın
        </span>
      </a>
    </div>
  );
}
