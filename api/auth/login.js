export const config = { runtime: "edge" };

export default async function handler(req) {
  const url = new URL(req.url);
  const state = crypto.randomUUID();
  const params = new URLSearchParams({
    client_id: (process.env.GOOGLE_CLIENT_ID || "").trim(),
    redirect_uri: url.origin + "/api/auth/callback",
    response_type: "code",
    scope: "openid email profile",
    hd: "bamboo-card.com",
    prompt: "select_account",
    state: state
  });
  return new Response(null, {
    status: 302,
    headers: {
      Location: "https://accounts.google.com/o/oauth2/v2/auth?" + params,
      "Set-Cookie": "bc_state=" + state + "; Path=/api/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=600"
    }
  });
}
