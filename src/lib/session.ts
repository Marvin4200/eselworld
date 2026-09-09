import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// Vereinfachte Demo-Session für V1: das Cookie enthält nur die User-ID,
// ungesigned, nur für lokale Entwicklung gedacht. Für Produktion durch
// echtes Discord-OAuth2 (next-auth) ersetzen — siehe README.
export const SESSION_COOKIE = "eselworld_session";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}
