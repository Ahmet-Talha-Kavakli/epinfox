// E-posta gönderimi — tek giriş noktası.
//
// Resend henüz projeye kurulu DEĞİL (paket yok, RESEND_API_KEY yok). Bu helper
// graceful: anahtar varsa Resend HTTP API'sine (paket gerektirmeden, fetch ile)
// istek atar; yoksa console.log ile no-op olur ve asıl akışı KIRMAZ.
//
// İleride `resend` paketi kurulduğunda bu dosyanın imzası değişmeden kalır —
// sadece içerideki gönderim değişir.

const FROM = process.env.RESEND_FROM || "EpinFox <noreply@epinfox.com>";

export interface SendEmailInput {
  to: string;
  subject: string;
  /** Düz metin gövde (zorunlu — basit ve güvenli). */
  text: string;
  /** Opsiyonel HTML gövde. */
  html?: string;
}

/**
 * Markalı e-posta HTML şablonu — koyu lacivert header + içerik + (opsiyonel)
 * buton + footer. Inline CSS (mail istemcileri <style> bloklarını atar).
 */
export function emailTemplate(opts: {
  heading: string;
  bodyHtml: string;
  cta?: { label: string; href: string };
}): string {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://epinfox.com";
  const cta = opts.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:18px"><tr><td><a href="${opts.cta.href}" style="display:inline-block;background:#3b82f6;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:12px 26px;border-radius:12px">${opts.cta.label}</a></td></tr></table>`
    : "";
  return `<!doctype html><html lang="tr"><body style="margin:0;background:#f1f5f9;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f172a">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:24px 0">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0">
        <tr><td style="background:linear-gradient(135deg,#0b1220,#16223b);padding:22px 28px">
          <span style="color:#fff;font-size:20px;font-weight:800;letter-spacing:-.3px">Epin<span style="color:#f97316">Fox</span></span>
        </td></tr>
        <tr><td style="padding:28px">
          <h1 style="margin:0 0 14px;font-size:20px;font-weight:800;color:#0f172a">${opts.heading}</h1>
          <div style="font-size:15px;line-height:1.65;color:#334155">${opts.bodyHtml}</div>
          ${cta}
        </td></tr>
        <tr><td style="padding:18px 28px;background:#f8fafc;border-top:1px solid #e2e8f0">
          <p style="margin:0;font-size:12px;color:#94a3b8">Bu e-posta EpinFox tarafından gönderildi · <a href="${SITE_URL}" style="color:#3b82f6;text-decoration:none">${SITE_URL.replace(/^https?:\/\//, "")}</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
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
