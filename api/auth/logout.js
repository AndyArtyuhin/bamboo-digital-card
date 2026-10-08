export const config = { runtime: "edge" };

export default function handler() {
  const headers = new Headers({ "Content-Type": "text/html; charset=utf-8" });
  headers.append("Set-Cookie", "bc_session=; Path=/; Max-Age=0");
  headers.append("Set-Cookie", "bc_sso=; Path=/; Max-Age=0");
  return new Response(
    '<!doctype html><meta charset="utf-8"><title>Signed out</title><body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#1d1d1d;color:#fff;font-family:system-ui,sans-serif"><div style="text-align:center"><h1 style="font-size:24px;margin:0 0 20px">You are signed out</h1><a href="/api/auth/login" style="display:inline-block;background:#9ce704;color:#1d1d1d;padding:10px 20px;border-radius:999px;text-decoration:none;font-weight:600">Sign in with Google</a></div></body>',
    { status: 200, headers: headers }
  );
}
