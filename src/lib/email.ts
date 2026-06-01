// E-posta gönderimi — tek giriş noktası.
//
// Resend henüz projeye kurulu DEĞİL (paket yok, RESEND_API_KEY yok). Bu helper
// graceful: anahtar varsa Resend HTTP API'sine (paket gerektirmeden, fetch ile)
// istek atar; yoksa console.log ile no-op olur ve asıl akışı KIRMAZ.
//
// İleride `resend` paketi kurulduğunda bu dosyanın imzası değişmeden kalır —
// sadece içerideki gönderim değişir.

const FROM = process.env.RESEND_FROM || "EpinFox <noreply@goosecage.com>";

export interface SendEmailInput {
  to: string;
  subject: string;
  /** Düz metin gövde (zorunlu — basit ve güvenli). */
  text: string;
  /** Opsiyonel HTML gövde. */
  html?: string;
}

/**
 * Tek e-posta gönderir. Hata fırlatmaz; { ok } döner ve logla yetinir.
 * - RESEND_API_KEY varsa Resend API ile gönderir.
 * - Yoksa no-op (geliştirme/test) — console.log ile görünür.
 */
export async function sendEmail(
  input: SendEmailInput,
): Promise<{ ok: boolean; skipped?: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(
      `[email:no-op] → ${input.to} | ${input.subject} (RESEND_API_KEY yok)`,
    );
    return { ok: true, skipped: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [input.to],
        subject: input.subject,
        text: input.text,
        ...(input.html ? { html: input.html } : {}),
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`sendEmail failed (${res.status}): ${body}`);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("sendEmail exception:", err);
    return { ok: false };
  }
}
