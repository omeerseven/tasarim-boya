import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "leads.json");

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

export async function getLeads(): Promise<Lead[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Lead[];
  } catch {
    return [];
  }
}

export async function addLead(
  lead: Omit<Lead, "id" | "createdAt" | "status">,
): Promise<Lead> {
  const leads = await getLeads();
  const newLead: Lead = {
    ...lead,
    id: `lead-${Date.now()}`,
    status: "yeni",
    createdAt: new Date().toISOString(),
  };
  leads.unshift(newLead);
  await fs.writeFile(DATA_FILE, JSON.stringify(leads, null, 2), "utf-8");
  return newLead;
}

export async function updateLeadStatus(
  id: string,
  status: Lead["status"],
): Promise<Lead | null> {
  const leads = await getLeads();
  const lead = leads.find((l) => l.id === id);
  if (!lead) return null;
  lead.status = status;
  await fs.writeFile(DATA_FILE, JSON.stringify(leads, null, 2), "utf-8");
  return lead;
}

export async function deleteLead(id: string): Promise<boolean> {
  const leads = await getLeads();
  const next = leads.filter((l) => l.id !== id);
  if (next.length === leads.length) return false;
  await fs.writeFile(DATA_FILE, JSON.stringify(next, null, 2), "utf-8");
  return true;
}
