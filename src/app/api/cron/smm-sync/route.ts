import { NextResponse } from "next/server";
import { pollSmmOrders } from "@/lib/actions/smm-sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// SMM durum senkronizasyonu cron endpoint'i.
// İşlenmekte olan SMM siparişlerini panelden sorgular, tamamlananı completed,
// iptal edileni iade eder. Gerçek cron (Vercel Cron / harici scheduler) bunu
// periyodik çağırır. Yetki: CRON_SECRET (Authorization: Bearer <secret> ya da
// ?secret=<secret>). Secret tanımlı değilse 503 (kapalı) döner.
//
// GET ve POST ikisi de desteklenir (çoğu cron sağlayıcı GET kullanır).

async function handle(req: Request): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Cron yapılandırılmamış (CRON_SECRET eksik)." },
      { status: 503 },
    );
  }

  const auth = req.headers.get("authorization") ?? "";
  const url = new URL(req.url);
  const provided = auth.replace(/^Bearer\s+/i, "") || url.searchParams.get("secret") || "";
  if (provided !== secret) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const result = await pollSmmOrders();
  return NextResponse.json({ ok: true, ...result });
}

export async function GET(req: Request) {
  return handle(req);
}

export async function POST(req: Request) {
  return handle(req);
}
