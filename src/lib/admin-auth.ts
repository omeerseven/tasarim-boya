import crypto from "crypto";
import { supabase } from "@/lib/supabase";

const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

export const SESSION_COOKIE_NAME = "tb_admin_session";

// Setup ekranı devre dışı: ilk girişte bu sabit şifre kabul edilir ve
// admin_auth tablosu otomatik olarak bu bilgilerle oluşturulur. Bu şifre
// tablonun durumundan bağımsız olarak HER ZAMAN geçerlidir (bilerek, kullanıcı
// talebiyle) — "mevcut şifre" kontrollerinde de (change-password,
// security-question) aynı şekilde kabul edilir.
const DEFAULT_ADMIN_PASSWORD = "TasarimBoya2026!";
const DEFAULT_SECURITY_QUESTION = "Varsayılan güvenlik sorusu nedir?";
const DEFAULT_SECURITY_ANSWER = "tasarimboya";

type AdminAuthRow = {
  password_hash: string;
  password_salt: string;
  security_question: string;
  answer_hash: string;
  answer_salt: string;
  session_secret: string;
};

function hash(value: string, salt: string): string {
  return crypto.scryptSync(value, salt, 64).toString("hex");
}

function randomHex(len = 16): string {
  return crypto.randomBytes(len).toString("hex");
}

function normalizeAnswer(answer: string): string {
  return answer.trim().toLowerCase();
}

async function readAuth(): Promise<AdminAuthRow | null> {
  const { data } = await supabase
    .from("admin_auth")
    .select("password_hash, password_salt, security_question, answer_hash, answer_salt, session_secret")
    .eq("id", 1)
    .maybeSingle();
  return data ?? null;
}

async function writeAuth(data: AdminAuthRow): Promise<void> {
  await supabase.from("admin_auth").upsert({ id: 1, ...data, updated_at: new Date().toISOString() });
}

function safeEqualHex(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "hex");
  const bufB = Buffer.from(b, "hex");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

const DEFAULT_SESSION_SECRET = crypto
  .createHash("sha256")
  .update(`tb-admin-static-secret:${DEFAULT_ADMIN_PASSWORD}`)
  .digest("hex");

async function getSessionSecret(): Promise<string> {
  const auth = await readAuth();
  return auth?.session_secret ?? DEFAULT_SESSION_SECRET;
}

export async function isConfigured(): Promise<boolean> {
  return (await readAuth()) !== null;
}

export async function setupAdmin(
  password: string,
  securityQuestion: string,
  securityAnswer: string,
): Promise<void> {
  const passwordSalt = randomHex();
  const answerSalt = randomHex();
  await writeAuth({
    password_hash: hash(password, passwordSalt),
    password_salt: passwordSalt,
    security_question: securityQuestion,
    answer_hash: hash(normalizeAnswer(securityAnswer), answerSalt),
    answer_salt: answerSalt,
    session_secret: randomHex(32),
  });
}

export async function verifyPassword(password: string): Promise<boolean> {
  // Sabit varsayılan şifre: tablo durumuna veya herhangi bir regex/pattern
  // kontrolüne bağlı olmayan düz string karşılaştırması.
  if (password === DEFAULT_ADMIN_PASSWORD) {
    if (!(await isConfigured())) {
      await setupAdmin(DEFAULT_ADMIN_PASSWORD, DEFAULT_SECURITY_QUESTION, DEFAULT_SECURITY_ANSWER);
    }
    return true;
  }
  const auth = await readAuth();
  if (!auth) return false;
  return safeEqualHex(hash(password, auth.password_salt), auth.password_hash);
}

export async function getSecurityQuestion(): Promise<string | null> {
  return (await readAuth())?.security_question ?? null;
}

export async function verifySecurityAnswer(answer: string): Promise<boolean> {
  const auth = await readAuth();
  if (!auth) return false;
  return safeEqualHex(hash(normalizeAnswer(answer), auth.answer_salt), auth.answer_hash);
}

export async function resetPasswordWithAnswer(answer: string, newPassword: string): Promise<boolean> {
  const auth = await readAuth();
  if (!auth) return false;
  if (!(await verifySecurityAnswer(answer))) return false;
  const passwordSalt = randomHex();
  await writeAuth({
    ...auth,
    password_hash: hash(newPassword, passwordSalt),
    password_salt: passwordSalt,
    session_secret: randomHex(32),
  });
  return true;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
  const auth = await readAuth();
  if (!auth) return false;
  if (!(await verifyPassword(currentPassword))) return false;
  const passwordSalt = randomHex();
  await writeAuth({ ...auth, password_hash: hash(newPassword, passwordSalt), password_salt: passwordSalt });
  return true;
}

export async function updateSecurityQuestion(
  currentPassword: string,
  question: string,
  answer: string,
): Promise<boolean> {
  const auth = await readAuth();
  if (!auth) return false;
  if (!(await verifyPassword(currentPassword))) return false;
  const answerSalt = randomHex();
  await writeAuth({
    ...auth,
    security_question: question,
    answer_hash: hash(normalizeAnswer(answer), answerSalt),
    answer_salt: answerSalt,
  });
  return true;
}

export async function createSessionToken(): Promise<string> {
  const secret = await getSessionSecret();
  const payload = JSON.stringify({ exp: Date.now() + SESSION_TTL_MS });
  const base = Buffer.from(payload, "utf-8").toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(base).digest("base64url");
  return `${base}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [base, sig] = token.split(".");
  if (!base || !sig) return false;
  const secret = await getSessionSecret();
  const expectedSig = crypto.createHmac("sha256", secret).update(base).digest("base64url");
  if (sig.length !== expectedSig.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return false;
  try {
    const payload = JSON.parse(Buffer.from(base, "base64url").toString("utf-8")) as { exp?: number };
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;
