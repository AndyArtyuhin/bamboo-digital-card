export const config = { runtime: "edge" };
const enc = new TextEncoder();
const b64u = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64u = (s) => atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4));
async function hmac(data) {
  const key = await crypto.subtle.importKey("raw", enc.encode(process.env.SESSION_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64u(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}
function cookie(req, name) {
  const m = (req.headers.get("cookie") || "").match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[1]) : null;
}

const denied = (msg) => new Response(
  '<!doctype html><meta charset="utf-8"><title>Access denied</title><body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#1d1d1d;color:#fff;font-family:system-ui,sans-serif"><div style="text-align:center;max-width:420px;padding:24px"><h1 style="font-size:24px;margin:0 0 12px">Access denied</h1><p style="color:#bdbdbd;line-height:1.5;margin:0 0 24px">' + msg + '</p><a href="/api/auth/login" style="display:inline-block;background:#9ce704;color:#1d1d1d;padding:10px 20px;border-radius:999px;text-decoration:none;font-weight:600">Try another account</a></div></body>',
  { status: 403, headers: { "Content-Type": "text/html; charset=utf-8" } }
);

export default async function handler(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state || state !== cookie(req, "bc_state")) return denied("Sign-in expired. Please try again.");

  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: code,
      client_id: (process.env.GOOGLE_CLIENT_ID || "").trim(),
      client_secret: (process.env.GOOGLE_CLIENT_SECRET || "").trim(),
      redirect_uri: url.origin + "/api/auth/callback",
      grant_type: "authorization_code"
    })
  });
  if (!r.ok) {
    let reason = "";
    try { const e = await r.json(); reason = (e.error || "") + (e.error_description ? ": " + e.error_description : ""); } catch (x) {}
    return denied("Google sign-in failed. Please try again." + (reason ? "<br><br><code style=\"color:#9ce704\">" + reason.replace(/[<>&]/g, "") + "</code>" : ""));
  }
  const { id_token } = await r.json();
  let claims = {};
  try { claims = JSON.parse(fromB64u(id_token.split(".")[1])); } catch (e) {}

  const email = String(claims.email || "");
  if (claims.aud !== (process.env.GOOGLE_CLIENT_ID || "").trim() || !claims.email_verified || claims.hd !== "bamboo-card.com" || !/@bamboo-card\.com$/i.test(email)) {
    return denied("Only @bamboo-card.com accounts can open this page." + (email ? " You signed in as " + email + "." : ""));
  }

  const payload = b64u(enc.encode(JSON.stringify({ email: email, exp: Date.now() + 7 * 24 * 3600 * 1000 })));
  const token = payload + "." + (await hmac(payload));
  const headers = new Headers({ Location: "/" });
  headers.append("Set-Cookie", "bc_session=" + token + "; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800");
  headers.append("Set-Cookie", "bc_sso=1; Path=/; Secure; SameSite=Lax; Max-Age=604800");
  headers.append("Set-Cookie", "bc_state=; Path=/api/auth; Max-Age=0");
  return new Response(null, { status: 302, headers: headers });
}
