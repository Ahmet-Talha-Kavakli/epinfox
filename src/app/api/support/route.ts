import { NextResponse } from "next/server";
import OpenAI from "openai";
import type {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/chat/completions";
import { createAdminClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { formatTL } from "@/lib/format";
import { SITE } from "@/config/site";

export const runtime = "nodejs";

/** İstemciden gelen ek dosya. data: base64 data URL (görsel) veya ham metin. */
type Attachment = {
  kind: "image" | "pdf" | "text";
  name: string;
  /** image: data URL (data:image/png;base64,...). pdf/text: base64 içerik. */
  data: string;
  mime?: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  attachments?: Attachment[];
};

const MAX_ATTACH = 4;
const MAX_TEXT_CHARS = 6000; // pdf/metin çıktısını sınırla (token kontrolü)

// Site bilgi bağlamı (SSS) — sistem prompt'a gömülür.
const FAQ = `
${SITE.name} hakkında bilgiler:
- ${SITE.name}, oyun e-pinleri, platform bakiyeleri (Steam, Google Play, PlayStation, Xbox, iTunes), abonelikler (Discord Nitro, Spotify, Netflix, Game Pass) ve dijital hizmetler (Windows/Office lisans, VPN) satan bir dijital ürün platformudur.
- Çalışma şekli: Kullanıcı önce cüzdanına bakiye yükler ("mağaza bakiyesi"), sonra bu bakiyeyle ürün satın alır. Ödeme onaylanınca kod ANINDA "Siparişlerim" sayfasında görünür ve e-posta ile gönderilir.
- Cüzdan yükleme bonusu: 100₺ → +%2, 250₺ → +%4, 500₺ → +%6.
- Ödeme yöntemleri: Kredi/banka kartı (3D Secure), havale/EFT, kripto para.
- Teslimat: Tüm ürünler dijital ve anında teslim edilir.
- İade: Dijital kodlar teslim edildikten sonra (anında ifa) cayma hakkı yoktur. Ancak kod hatalı/geçersiz/kullanılmışsa veya yanlış ürün geldiyse 48 saat içinde iade talep edilebilir; uygun bulunursa cüzdana iade yapılır.
- Güvenlik: Kodlar şifreli saklanır, teslim öncesi gizlidir. Güvenlik gereği asistan kod içeriğini göstermez; kod "Siparişlerim" sayfasından görülür.
- Sayfalar: /store (mağaza), /wallet (cüzdan), /orders (siparişler), /account (profil), /contact (iletişim), /sign-in (giriş).
`;

const ORDER_STATUS_TR: Record<string, string> = {
  completed: "Tamamlandı",
  processing: "İşleniyor",
  pending: "Bekliyor",
  refunded: "İade edildi",
  failed: "Başarısız",
};
const TXN_TYPE_TR: Record<string, string> = {
  topup: "Bakiye yükleme",
  purchase: "Satın alma",
  refund: "İade",
  adjustment: "Düzeltme",
  donation: "Bağış",
};

/* ───────────────────────────── Tool tanımları ──────────────────────────── */

const TOOLS: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_my_orders",
      description:
        "Giriş yapmış kullanıcının kendi siparişlerini getirir (ürün adı, tutar, durum, tarih). Kullanıcı 'siparişlerim', 'son siparişim', 'siparişim ne durumda' gibi sorduğunda kullan.",
      parameters: {
        type: "object",
        properties: {
          limit: { type: "integer", description: "Kaç sipariş getirilsin (varsayılan 5)", default: 5 },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_my_wallet",
      description:
        "Giriş yapmış kullanıcının cüzdan bakiyesini ve son işlemlerini getirir. 'bakiyem', 'cüzdanım', 'ne kadar param var', 'son hareketlerim' gibi sorularda kullan.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "search_products",
      description:
        "Mağazadaki ürünleri isme/oyuna göre arar ve fiyatlarını döndürür. 'X fiyatı ne', 'X var mı', 'en ucuz Y' gibi sorularda kullan. Herkese açıktır.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Aranacak ürün/oyun adı, ör. 'PUBG UC' veya 'Steam'" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_order_details",
      description:
        "Kullanıcının BELİRLİ bir siparişinin detayını getirir (ürün, tutar, durum, tarih, varsa hata/teslim notu). Kullanıcı 'son siparişimde sorun var', 'X siparişim ne durumda', 'kodum gelmedi' gibi tek bir siparişi sorduğunda kullan. order_id verilmezse en son sipariş alınır.",
      parameters: {
        type: "object",
        properties: {
          order_id: { type: "string", description: "Sipariş kimliği (UUID). Bilinmiyorsa boş bırak; en son sipariş alınır." },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "check_promo",
      description:
        "Bir promosyon/indirim kodunun geçerli olup olmadığını ve sağladığı bonusu KONTROL eder (kullanmaz, sadece bilgi). Kullanıcı 'X kodu geçerli mi', 'bu kupon ne veriyor' diye sorduğunda kullan. Kodu KULLANMAK için kullanıcıyı /wallet sayfasına yönlendir.",
      parameters: {
        type: "object",
        properties: {
          code: { type: "string", description: "Kontrol edilecek promo kodu, ör. 'HOSGELDIN'" },
        },
        required: ["code"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_referral_status",
      description:
        "Giriş yapmış kullanıcının davet (referans) durumunu getirir: davet kodu, davet linki, davet ettiği kişi sayısı, ödül kazanılan davet sayısı ve toplam kazanılan ödül. 'davet kodum ne', 'kaç kişi davet ettim', 'referans kazancım' gibi sorularda kullan.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "submit_support_ticket",
      description:
        "Kullanıcı adına bir DESTEK TALEBİ oluşturur. SADECE kullanıcı açıkça bir sorunu insan ekibe iletmek istediğinde ve sen çözemediğinde kullan. Önce kullanıcıdan konu (subject) ve sorunun açıklamasını (body) NET olarak al; tahminle doldurma. Oluşturduktan sonra talep numarasını ve /support sayfasından takip edebileceğini söyle.",
      parameters: {
        type: "object",
        properties: {
          subject: { type: "string", description: "Talebin kısa konusu (en az 4 karakter)" },
          body: { type: "string", description: "Sorunun açıklaması (en az 5 karakter)" },
          category: {
            type: "string",
            enum: ["general", "order", "wallet", "other"],
            description: "Talep kategorisi: genel/sipariş/cüzdan/diğer",
          },
          order_id: { type: "string", description: "İlgili sipariş varsa kimliği (opsiyonel)" },
        },
        required: ["subject", "body", "category"],
      },
    },
  },
];

/* ───────────────────────────── Tool yürütücü ───────────────────────────── */

async function runTool(
  name: string,
  args: Record<string, unknown>,
  userId: string | null,
): Promise<string> {
  const supabase = await createAdminClient();

  if (name === "get_my_orders") {
    if (!userId) return JSON.stringify({ error: "not_logged_in", message: "Kullanıcı giriş yapmamış." });
    const limit = Math.min(Number(args.limit) || 5, 10);
    const { data } = await supabase
      .from("orders")
      .select("product_name, variant_label, price, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
    const orders = (data ?? []).map((o) => ({
      ürün: o.variant_label ? `${o.product_name} · ${o.variant_label}` : o.product_name,
      tutar: formatTL(Number(o.price)),
      durum: ORDER_STATUS_TR[o.status] ?? o.status,
      tarih: new Date(o.created_at).toLocaleDateString("tr-TR"),
    }));
    return JSON.stringify({ count: orders.length, orders });
  }

  if (name === "get_my_wallet") {
    if (!userId) return JSON.stringify({ error: "not_logged_in", message: "Kullanıcı giriş yapmamış." });
    const [{ data: profile }, { data: txns }] = await Promise.all([
      supabase.from("profiles").select("balance").eq("id", userId).maybeSingle(),
      supabase
        .from("wallet_transactions")
        .select("type, amount, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);
    return JSON.stringify({
      bakiye: formatTL(Number(profile?.balance ?? 0)),
      son_hareketler: (txns ?? []).map((t) => ({
        tip: TXN_TYPE_TR[t.type] ?? t.type,
        tutar: formatTL(Math.abs(Number(t.amount))),
        yön: Number(t.amount) >= 0 ? "giriş" : "çıkış",
        tarih: new Date(t.created_at).toLocaleDateString("tr-TR"),
      })),
    });
  }

  if (name === "search_products") {
    const q = String(args.query ?? "").trim();
    if (!q) return JSON.stringify({ error: "empty_query" });
    const { data } = await supabase
      .from("products")
      .select("name, price, is_active, categories(name)")
      .ilike("name", `%${q}%`)
      .eq("is_active", true)
      .limit(8);
    const products = (data ?? []).map((p) => {
      const cat = (p as { categories?: { name?: string } }).categories;
      return {
        ürün: p.name,
        kategori: cat?.name ?? "",
        fiyat: `${formatTL(Number(p.price))} (başlangıç)`,
      };
    });
    return JSON.stringify({ count: products.length, products });
  }

  if (name === "get_order_details") {
    if (!userId) return JSON.stringify({ error: "not_logged_in", message: "Kullanıcı giriş yapmamış." });
    const rawId = String(args.order_id ?? "").trim();
    let query = supabase
      .from("orders")
      .select("id, product_name, variant_label, price, status, created_at, delivered_note")
      .eq("user_id", userId);
    // Geçerli UUID verilmişse o siparişi, yoksa en sonuncuyu al.
    if (/^[0-9a-f-]{36}$/i.test(rawId)) {
      query = query.eq("id", rawId);
    } else {
      query = query.order("created_at", { ascending: false }).limit(1);
    }
    const { data } = await query.maybeSingle();
    if (!data) return JSON.stringify({ error: "not_found", message: "Sipariş bulunamadı." });
    return JSON.stringify({
      sipariş_no: data.id,
      ürün: data.variant_label ? `${data.product_name} · ${data.variant_label}` : data.product_name,
      tutar: formatTL(Number(data.price)),
      durum: ORDER_STATUS_TR[data.status] ?? data.status,
      tarih: new Date(data.created_at).toLocaleDateString("tr-TR"),
      teslim_notu: data.delivered_note ?? null,
      not: "Kod içeriği güvenlik nedeniyle burada gösterilmez; Siparişlerim sayfasından görülebilir.",
    });
  }

  if (name === "check_promo") {
    const code = String(args.code ?? "").trim().toUpperCase();
    if (!code) return JSON.stringify({ error: "empty_code" });
    const { data: promo } = await supabase
      .from("promo_codes")
      .select("id, code, type, value, description, max_uses, used_count, expires_at, is_active")
      .ilike("code", code)
      .maybeSingle();
    if (!promo || !promo.is_active) {
      return JSON.stringify({ geçerli: false, message: "Böyle bir kod yok veya aktif değil." });
    }
    const nowIso = new Date().toISOString();
    if (promo.expires_at && promo.expires_at < nowIso) {
      return JSON.stringify({ geçerli: false, message: "Bu kodun süresi dolmuş." });
    }
    if (promo.max_uses != null && (promo.used_count ?? 0) >= promo.max_uses) {
      return JSON.stringify({ geçerli: false, message: "Bu kodun kullanım limiti dolmuş." });
    }
    // Giriş yapmış kullanıcı daha önce kullandı mı?
    let alreadyUsed = false;
    if (userId) {
      const { data: red } = await supabase
        .from("promo_redemptions")
        .select("id")
        .eq("user_id", userId)
        .eq("promo_id", promo.id)
        .maybeSingle();
      alreadyUsed = !!red;
    }
    const typeTr =
      promo.type === "bonus_balance"
        ? `${formatTL(Number(promo.value))} bonus bakiye`
        : promo.type === "percent"
          ? `%${promo.value} indirim kuponu`
          : "ücretsiz teslimat";
    return JSON.stringify({
      geçerli: true,
      kod: promo.code,
      sağladığı: typeTr,
      açıklama: promo.description ?? null,
      daha_önce_kullandın: alreadyUsed,
      not: "Kodu kullanmak için Cüzdan (/wallet) sayfasındaki promosyon kodu alanına gir.",
    });
  }

  if (name === "get_referral_status") {
    if (!userId) return JSON.stringify({ error: "not_logged_in", message: "Kullanıcı giriş yapmamış." });
    const [{ data: profile }, { data: refs }] = await Promise.all([
      supabase.from("profiles").select("referral_code").eq("id", userId).maybeSingle(),
      supabase
        .from("referrals")
        .select("status, referrer_reward")
        .eq("referrer_id", userId),
    ]);
    const code = profile?.referral_code ?? null;
    const list = refs ?? [];
    const rewardedCount = list.filter((r) => r.status === "rewarded").length;
    const totalReward = list.reduce((s, r) => s + Number(r.referrer_reward ?? 0), 0);
    return JSON.stringify({
      davet_kodu: code,
      davet_linki: code ? `${SITE.url}/sign-up?ref=${code}` : null,
      toplam_davet: list.length,
      ödül_kazanılan_davet: rewardedCount,
      bekleyen_davet: list.length - rewardedCount,
      toplam_kazanç: formatTL(totalReward),
    });
  }

  if (name === "submit_support_ticket") {
    if (!userId) return JSON.stringify({ error: "not_logged_in", message: "Kullanıcı giriş yapmamış." });
    const subject = String(args.subject ?? "").trim();
    const ticketBody = String(args.body ?? "").trim();
    const category = String(args.category ?? "general");
    const validCat = ["general", "order", "wallet", "other"].includes(category)
      ? category
      : "general";
    if (subject.length < 4 || ticketBody.length < 5) {
      return JSON.stringify({
        error: "incomplete",
        message: "Konu (en az 4 karakter) ve açıklama (en az 5 karakter) gerekli. Kullanıcıdan netleştir.",
      });
    }
    // İlgili sipariş bu kullanıcıya mı ait?
    let orderId: string | null = null;
    const rawOrder = String(args.order_id ?? "").trim();
    if (/^[0-9a-f-]{36}$/i.test(rawOrder)) {
      const { data: ord } = await supabase
        .from("orders")
        .select("id")
        .eq("id", rawOrder)
        .eq("user_id", userId)
        .maybeSingle();
      orderId = ord?.id ?? null;
    }
    const { data: ticket, error } = await supabase
      .from("support_tickets")
      .insert({
        user_id: userId,
        subject: subject.slice(0, 120),
        category: validCat,
        status: "open",
        order_id: orderId,
      })
      .select("id")
      .single();
    if (error || !ticket) {
      console.error("submit_support_ticket error:", error?.message);
      return JSON.stringify({ error: "failed", message: "Talep oluşturulamadı." });
    }
    await supabase.from("support_messages").insert({
      ticket_id: ticket.id,
      author_id: userId,
      is_staff: false,
      body: ticketBody.slice(0, 2000),
    });
    return JSON.stringify({
      ok: true,
      talep_no: ticket.id,
      message: "Destek talebi oluşturuldu. Kullanıcı /support sayfasından takip edebilir.",
    });
  }

  return JSON.stringify({ error: "unknown_tool" });
}

/* ─────────────────────── Ek dosya işleme (vision/metin) ─────────────────── */

/** PDF/metin base64 → düz metin (sınırlı). Hata olursa null. */
async function extractText(att: Attachment): Promise<string | null> {
  try {
    const buf = Buffer.from(att.data, "base64");
    if (att.kind === "text") {
      return buf.toString("utf-8").slice(0, MAX_TEXT_CHARS);
    }
    if (att.kind === "pdf") {
      // pdf-parse v2 dinamik import (server-only, ağır). PDFParse class API.
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: new Uint8Array(buf) });
      const result = await parser.getText();
      return (result.text ?? "").trim().slice(0, MAX_TEXT_CHARS) || null;
    }
  } catch (e) {
    console.error("extractText error:", (e as Error).message);
  }
  return null;
}

/**
 * Bir kullanıcı mesajını OpenAI content formatına çevir. Görsel ekler
 * image_url part'ı olur (vision); pdf/metin ekler metin olarak gömülür.
 */
async function buildUserContent(m: ChatMessage) {
  const atts = (m.attachments ?? []).slice(0, MAX_ATTACH);
  if (!atts.length) return m.content;

  const parts: Array<
    | { type: "text"; text: string }
    | { type: "image_url"; image_url: { url: string } }
  > = [];
  if (m.content.trim()) parts.push({ type: "text", text: m.content });

  for (const att of atts) {
    if (att.kind === "image") {
      // data zaten data:image/...;base64,... biçiminde gelir.
      parts.push({ type: "image_url", image_url: { url: att.data } });
    } else {
      const text = await extractText(att);
      parts.push({
        type: "text",
        text: text
          ? `[Ek dosya "${att.name}" içeriği]:\n${text}`
          : `[Ek dosya "${att.name}" okunamadı veya boş.]`,
      });
    }
  }
  return parts;
}

/* ───────────────────────────── Ana handler ─────────────────────────────── */

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Destek sistemi şu anda yapılandırılmamış." },
      { status: 503 },
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const messages = (body.messages ?? []).slice(-10);
  if (!messages.length) {
    return NextResponse.json({ error: "Mesaj yok." }, { status: 400 });
  }

  // Kimlik (giriş yapmışsa kişisel tool'lar açılır)
  let userId: string | null = null;
  let nickname = "";
  try {
    const current = await getCurrentUser();
    if (current) {
      userId = current.user.id;
      nickname = current.nickname;
    }
  } catch {
    /* misafir */
  }

  // Gemini'nin OpenAI-uyumlu endpoint'i üzerinden konuşuruz (tool-calling +
  // vision desteklenir). Mevcut OpenAI SDK akışı aynen çalışır; yalnızca
  // baseURL + apiKey + model adı Gemini'ye göre. (Türkiye'de Clerk SMS gibi
  // bölge kısıtı yok; Gemini TR'den erişilebilir.)
  const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENAI_API_KEY ?? "",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  });
  const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

  const systemPrompt = `Sen ${SITE.name} adlı Türk dijital ürün/e-pin satış platformunun yardımcı, samimi ve kısa konuşan destek asistanısın. Yalnızca platformla ilgili konularda yardım et. Bilmediğini uydurma; emin değilsen /contact üzerinden insan desteğe yönlendir. Türkçe, kısa ve net yanıt ver.

KULLANICI DURUMU: ${userId ? `Giriş yapmış (kullanıcı adı: ${nickname}). Kişisel sorulara (sipariş, bakiye) tool'larla gerçek veriyi getirip yanıtla.` : "Misafir (giriş yapmamış). Sipariş/bakiye gibi kişisel bilgi sorulursa, tool çağırma; nazikçe /sign-in ile giriş yapması gerektiğini söyle. Ürün/fiyat sorularına yine cevap ver."}

Tool sonuçlarını ham JSON gibi değil, doğal Türkçe cümleyle, gerekiyorsa kısa liste halinde özetle. Para/durum bilgilerini olduğu gibi aktar; kod içeriğini ASLA gösterme (güvenlik) — kodun "Siparişlerim" sayfasında olduğunu söyle.

DOSYA ANALİZİ: Kullanıcı görsel (ekran görüntüsü, hata, dekont vb.) veya PDF/metin gönderebilir. Görseli dikkatle incele ve sorunla ilgili somut gözlem yap (ör. hata mesajını oku, ekrandaki durumu yorumla). PDF/metin içeriği sana metin olarak verilir. Video gönderilirse analiz edemediğini, ekran görüntüsü göndermesini nazikçe iste. Gönderilen dosya platformla ilgisizse kibarca sadece EpinFox konularında yardımcı olabileceğini belirt.

${FAQ}`;

  // Ek dosyalı mesajları multimodal content'e çevir (görsel→vision, pdf/txt→metin).
  const hasAttachments = messages.some((m) => m.attachments?.length);
  const builtMessages = await Promise.all(
    messages.map(async (m) => ({
      role: m.role,
      content:
        m.role === "user" && m.attachments?.length
          ? await buildUserContent(m)
          : m.content,
    })),
  );

  const convo: ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...(builtMessages as ChatCompletionMessageParam[]),
  ];

  // Misafire kişisel tool'ları hiç verme (sadece ürün arama).
  const tools = userId
    ? TOOLS
    : TOOLS.filter(
        (t) => t.type === "function" && t.function.name === "search_products",
      );

  try {
    // Tool-calling döngüsü (en fazla 3 tur).
    for (let turn = 0; turn < 3; turn++) {
      const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: convo,
        tools,
        tool_choice: "auto",
        max_tokens: hasAttachments ? 700 : 450, // dosya analizinde daha uzun yanıt
        temperature: 0.4,
      });

      const choice = completion.choices[0]?.message;
      if (!choice) break;

      // Tool çağrısı yoksa, normal yanıt — bitir.
      if (!choice.tool_calls?.length) {
        const reply = choice.content?.trim() || "Üzgünüm, şu an yanıt veremedim.";
        return NextResponse.json({ reply });
      }

      // Tool çağrılarını yürüt, sonuçları konuşmaya ekle.
      convo.push(choice);
      for (const call of choice.tool_calls) {
        if (call.type !== "function") continue;
        let parsed: Record<string, unknown> = {};
        try {
          parsed = JSON.parse(call.function.arguments || "{}");
        } catch {
          /* boş arg */
        }
        const result = await runTool(call.function.name, parsed, userId);
        convo.push({
          role: "tool",
          tool_call_id: call.id,
          content: result,
        });
      }
    }

    // Döngü tool ile doldu, son bir özet iste.
    const final = await openai.chat.completions.create({
      model: MODEL,
      messages: convo,
      max_tokens: 450,
      temperature: 0.4,
    });
    const reply =
      final.choices[0]?.message?.content?.trim() ||
      "Üzgünüm, şu an yanıt veremedim. Lütfen tekrar dene.";
    return NextResponse.json({ reply });
  } catch (e) {
    console.error("Gemini error:", (e as Error).message);
    return NextResponse.json(
      { error: "Asistana ulaşılamadı. Lütfen biraz sonra tekrar dene." },
      { status: 502 },
    );
  }
}
