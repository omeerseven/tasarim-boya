import fs from "fs";
import path from "path";
import crypto from "crypto";

const AUTH_FILE = path.join(process.cwd(), "data", "admin-auth.json");
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

export const SESSION_COOKIE_NAME = "tb_admin_session";

type AdminAuth = {
  passwordHash: string;
  passwordSalt: string;
  securityQuestion: string;
  answerHash: string;
  answerSalt: string;
  sessionSecret: string;
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

function readAuth(): AdminAuth | null {
  try {
    const raw = fs.readFileSync(AUTH_FILE, "utf-8");
    return JSON.parse(raw) as AdminAuth;
  } catch {
    return null;
  }
}

function writeAuth(data: AdminAuth): void {
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  fs.writeFileSync(AUTH_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function safeEqualHex(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "hex");
  const bufB = Buffer.from(b, "hex");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function isConfigured(): boolean {
  return fs.existsSync(AUTH_FILE);
}

export function setupAdmin(
  password: string,
  securityQuestion: string,
  securityAnswer: string,
): void {
  const passwordSalt = randomHex();
  const answerSalt = randomHex();
  writeAuth({
    passwordHash: hash(password, passwordSalt),
    passwordSalt,
    securityQuestion,
    answerHash: hash(normalizeAnswer(securityAnswer), answerSalt),
    answerSalt,
    sessionSecret: randomHex(32),
  });
}

export function verifyPassword(password: string): boolean {
  const auth = readAuth();
  if (!auth) return false;
  return safeEqualHex(hash(password, auth.passwordSalt), auth.passwordHash);
}

export function getSecurityQuestion(): string | null {
  return readAuth()?.securityQuestion ?? null;
}

export function verifySecurityAnswer(answer: string): boolean {
  const auth = readAuth();
  if (!auth) return false;
  return safeEqualHex(hash(normalizeAnswer(answer), auth.answerSalt), auth.answerHash);
}

export function resetPasswordWithAnswer(answer: string, newPassword: string): boolean {
  const auth = readAuth();
  if (!auth) return false;
  if (!verifySecurityAnswer(answer)) return false;
  const passwordSalt = randomHex();
  auth.passwordHash = hash(newPassword, passwordSalt);
  auth.passwordSalt = passwordSalt;
  auth.sessionSecret = randomHex(32);
  writeAuth(auth);
  return true;
}

export function changePassword(currentPassword: string, newPassword: string): boolean {
  const auth = readAuth();
  if (!auth) return false;
  if (!verifyPassword(currentPassword)) return false;
  const passwordSalt = randomHex();
  auth.passwordHash = hash(newPassword, passwordSalt);
  auth.passwordSalt = passwordSalt;
  writeAuth(auth);
  return true;
}

export function updateSecurityQuestion(
  currentPassword: string,
  question: string,
  answer: string,
): boolean {
  const auth = readAuth();
  if (!auth) return false;
  if (!verifyPassword(currentPassword)) return false;
  const answerSalt = randomHex();
  auth.securityQuestion = question;
  auth.answerHash = hash(normalizeAnswer(answer), answerSalt);
  auth.answerSalt = answerSalt;
  writeAuth(auth);
  return true;
}

export function createSessionToken(): string | null {
  const auth = readAuth();
  if (!auth) return null;
  const payload = JSON.stringify({ exp: Date.now() + SESSION_TTL_MS });
  const base = Buffer.from(payload, "utf-8").toString("base64url");
  const sig = crypto.createHmac("sha256", auth.sessionSecret).update(base).digest("base64url");
  return `${base}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const auth = readAuth();
  if (!auth) return false;
  const [base, sig] = token.split(".");
  if (!base || !sig) return false;
  const expectedSig = crypto.createHmac("sha256", auth.sessionSecret).update(base).digest("base64url");
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
