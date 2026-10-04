"use client";

import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export type PanelMessage = { type: "success" | "error"; text: string } | null;

export function PanelShell({
  title,
  description,
  onSave,
  saving,
  message,
  children,
  actions,
}: {
  title: string;
  description?: string;
  onSave: () => void;
  saving: boolean;
  message: PanelMessage;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
        <div>
          <h3 className="font-heading text-lg font-semibold text-navy-950">{title}</h3>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {message && (
            <span
              className={`text-xs font-medium ${
                message.type === "error" ? "text-destructive" : "text-emerald-600"
              }`}
            >
              {message.text}
            </span>
          )}
          {actions}
          <Button
            type="button"
            onClick={onSave}
            disabled={saving}
            size="sm"
            className="bg-navy-950 text-sand-50 hover:bg-navy-800"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Kaydet
          </Button>
        </div>
      </div>
      <div className="space-y-6 p-6">{children}</div>
    </div>
  );
}
