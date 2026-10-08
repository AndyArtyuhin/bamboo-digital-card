export const config = { runtime: "edge" };

export default function handler() {
  const headers = new Headers({ "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
  headers.append("Set-Cookie", "bc_session=; Path=/; Max-Age=0");
  headers.append("Set-Cookie", "bc_sso=; Path=/; Max-Age=0");
  return new Response(
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Digital Business Team Cards</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600&display=swap"></head><body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#1d1d1d;color:#ffffff;font-family:\'Bricolage Grotesque\',system-ui,sans-serif"><main style="display:flex;flex-direction:column;align-items:center;gap:40px;padding:24px">' + '<div style="display:flex;align-items:center;gap:20px"><svg viewBox="0 0 132 132" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:64px;height:64px;display:block;flex:none"><circle cx="32.85" cy="32.86" r="32.85" fill="#ffffff"></circle><circle cx="98.56" cy="32.86" r="32.85" fill="#ffffff"></circle><circle cx="32.85" cy="98.57" r="32.85" fill="#ffffff"></circle><circle cx="98.56" cy="98.57" r="32.85" fill="#ffffff"></circle></svg><span style="font-size:32px;font-weight:600;line-height:1.1">Digital Business<br>Team Cards</span></div><p style="margin:-16px 0 0;color:#bdbdbd;font-size:15px">You are signed out.</p><a href="/api/auth/login" style="display:inline-flex;align-items:center;justify-content:center;min-width:240px;background:#9ce704;color:#1d1d1d;padding:14px 28px;border-radius:999px;text-decoration:none;font-weight:600;font-size:16px">Log In</a>' + '</main></body></html>',
    { status: 200, headers: headers }
  );
}
