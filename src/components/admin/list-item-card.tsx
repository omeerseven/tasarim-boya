"use client";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";

export function ListItemCard({
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  children,
}: {
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-xl border border-border bg-muted/50 p-4 pr-28">
      <div className="absolute right-3 top-3 flex items-center gap-1">
        {onMoveUp && (
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            aria-label="Yukarı taşı"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        )}
        {onMoveDown && (
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            aria-label="Aşağı taşı"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={onRemove}
          aria-label="Kaldır"
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function reorder<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
