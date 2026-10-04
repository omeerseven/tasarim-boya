"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Loader2, Mail, MessageSquare, Phone, Tag, Trash2 } from "lucide-react";
import type { Lead } from "@/lib/leads";

const statusLabels: Record<Lead["status"], string> = {
  yeni: "Yeni",
  "iletisime-gecildi": "İletişime Geçildi",
  tamamlandi: "Tamamlandı",
};

const statusStyles: Record<Lead["status"], string> = {
  yeni: "bg-gold-100 text-gold-700",
  "iletisime-gecildi": "bg-navy-100 text-navy-700",
  tamamlandi: "bg-emerald-100 text-emerald-700",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function LeadsPanel({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  async function handleStatusChange(id: string, status: Lead["status"]) {
    setPendingId(id);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
        setSelectedLead((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
      }
    } finally {
      setPendingId(null);
    }
  }

  async function handleDelete(id: string) {
    setPendingId(id);
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        setSelectedLead((prev) => (prev && prev.id === id ? null : prev));
      }
    } finally {
      setPendingId(null);
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-border bg-muted text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Ad Soyad</th>
                <th className="px-5 py-3 font-medium">İletişim</th>
                <th className="px-5 py-3 font-medium">Hizmet</th>
                <th className="px-5 py-3 font-medium">Mesaj</th>
                <th className="px-5 py-3 font-medium">Tarih</th>
                <th className="px-5 py-3 font-medium">Tür</th>
                <th className="px-5 py-3 font-medium">Durum</th>
                <th className="px-5 py-3 font-medium text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">
                    Henüz talep bulunmuyor.
                  </td>
                </tr>
              )}
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="group cursor-pointer align-top transition-colors hover:bg-accent/50"
                  onClick={() => setSelectedLead(lead)}
                >
                  <td className="px-5 py-4 font-medium text-navy-950">{lead.name}</td>
                  <td className="px-5 py-4 text-muted-foreground">
                    <div>{lead.phone}</div>
                    <div className="text-xs">{lead.email}</div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{lead.service ?? "—"}</td>
                  <td className="max-w-xs px-5 py-4 text-muted-foreground">
                    <p className="line-clamp-2 underline-offset-2 group-hover:underline">
                      {lead.message}
                    </p>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      variant="outline"
                      className={
                        lead.type === "quote"
                          ? "border-gold-300 text-gold-700"
                          : "border-navy-300 text-navy-700"
                      }
                    >
                      {lead.type === "quote" ? "Teklif" : "Mesaj"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={lead.status}
                      onValueChange={(value) => handleStatusChange(lead.id, (value ?? "yeni") as Lead["status"])}
                      disabled={pendingId === lead.id}
                    >
                      <SelectTrigger className="h-8 w-[170px] text-xs">
                        <SelectValue>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[lead.status]}`}
                          >
                            {statusLabels[lead.status]}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedLead(lead)}
                        className="text-muted-foreground hover:text-navy-900"
                        aria-label="Detayları görüntüle"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={pendingId === lead.id}
                        onClick={() => handleDelete(lead.id)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Sil"
                      >
                        {pendingId === lead.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="max-w-lg sm:max-w-lg">
          {selectedLead && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between gap-3 pr-6">
                  <DialogTitle className="text-xl">{selectedLead.name}</DialogTitle>
                  <Badge
                    variant="outline"
                    className={
                      selectedLead.type === "quote"
                        ? "border-gold-300 text-gold-700"
                        : "border-navy-300 text-navy-700"
                    }
                  >
                    {selectedLead.type === "quote" ? "Teklif" : "Mesaj"}
                  </Badge>
                </div>
                <DialogDescription>
                  {formatDate(selectedLead.createdAt)} tarihinde alındı.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/50 p-3">
                    <Phone className="mt-0.5 h-4 w-4 flex-none text-gold-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Telefon</p>
                      <a href={`tel:${selectedLead.phone}`} className="text-sm font-medium text-navy-950">
                        {selectedLead.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/50 p-3">
                    <Mail className="mt-0.5 h-4 w-4 flex-none text-gold-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">E-posta</p>
                      <a
                        href={`mailto:${selectedLead.email}`}
                        className="text-sm font-medium text-navy-950 break-all"
                      >
                        {selectedLead.email || "—"}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/50 p-3 sm:col-span-2">
                    <Tag className="mt-0.5 h-4 w-4 flex-none text-gold-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">İlgilendiği Hizmet</p>
                      <p className="text-sm font-medium text-navy-950">
                        {selectedLead.service ?? "Belirtilmedi"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Mesaj
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                    {selectedLead.message}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <Select
                    value={selectedLead.status}
                    onValueChange={(value) =>
                      handleStatusChange(selectedLead.id, (value ?? "yeni") as Lead["status"])
                    }
                    disabled={pendingId === selectedLead.id}
                  >
                    <SelectTrigger className="w-[190px]">
                      <SelectValue>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[selectedLead.status]}`}
                        >
                          {statusLabels[selectedLead.status]}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    disabled={pendingId === selectedLead.id}
                    onClick={() => handleDelete(selectedLead.id)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    {pendingId === selectedLead.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Sil
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
