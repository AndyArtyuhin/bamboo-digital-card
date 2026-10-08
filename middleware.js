// Blocks every page until the visitor signs in with a @bamboo-card.com Google account.
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

export const config = { matcher: ["/((?!api/auth/).*)"] };

export default async function middleware(req) {
  const token = cookie(req, "bc_session");
  if (token && process.env.SESSION_SECRET) {
    const [payload, sig] = token.split(".");
    if (payload && sig && sig === (await hmac(payload))) {
      try {
        const s = JSON.parse(fromB64u(payload));
        if (s.exp > Date.now() && /@bamboo-card\.com$/i.test(s.email)) return;
      } catch (e) {}
    }
  }
  return Response.redirect(new URL("/api/auth/signin", req.url), 302);
}
