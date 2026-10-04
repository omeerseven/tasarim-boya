import { NextResponse } from "next/server";
import { addLead, getLeads } from "@/lib/leads";

export async function GET() {
  const leads = await getLeads();
  return NextResponse.json({ leads });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { type, name, phone, email, service, message } = body ?? {};

  if (!name || !phone || !message) {
    return NextResponse.json(
      { error: "İsim, telefon ve mesaj alanları zorunludur." },
      { status: 400 },
    );
  }

  const lead = await addLead({
    type: type === "contact" ? "contact" : "quote",
    name: String(name).slice(0, 120),
    phone: String(phone).slice(0, 40),
    email: String(email ?? "").slice(0, 120),
    service: service ? String(service).slice(0, 80) : undefined,
    message: String(message).slice(0, 2000),
  });

  return NextResponse.json({ lead }, { status: 201 });
}
