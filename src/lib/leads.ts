import { supabase } from "@/lib/supabase";

export type Lead = {
  id: string;
  type: "quote" | "contact";
  name: string;
  phone: string;
  email: string;
  service?: string;
  message: string;
  status: "yeni" | "iletisime-gecildi" | "tamamlandi";
  createdAt: string;
};

type LeadRow = {
  id: string;
  type: "quote" | "contact";
  name: string;
  phone: string;
  email: string;
  service: string | null;
  message: string;
  status: "yeni" | "iletisime-gecildi" | "tamamlandi";
  created_at: string;
};

function fromRow(row: LeadRow): Lead {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    phone: row.phone,
    email: row.email,
    service: row.service ?? undefined,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function getLeads(): Promise<Lead[]> {
  const { data } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []).map((row) => fromRow(row as LeadRow));
}

export async function addLead(lead: Omit<Lead, "id" | "createdAt" | "status">): Promise<Lead> {
  const row: LeadRow = {
    id: `lead-${Date.now()}`,
    type: lead.type,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    service: lead.service ?? null,
    message: lead.message,
    status: "yeni",
    created_at: new Date().toISOString(),
  };
  await supabase.from("leads").insert(row);
  return fromRow(row);
}

export async function updateLeadStatus(id: string, status: Lead["status"]): Promise<Lead | null> {
  const { data } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  return data ? fromRow(data as LeadRow) : null;
}

export async function deleteLead(id: string): Promise<boolean> {
  const { data } = await supabase.from("leads").delete().eq("id", id).select("id");
  return (data?.length ?? 0) > 0;
}
