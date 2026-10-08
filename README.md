# Bamboo Digital Business Cards

Static page + Google sign-in restricted to @bamboo-card.com.

## Files
- index.html — the app
- middleware.js — blocks all pages without a valid session
- api/auth/login.js, callback.js, logout.js — Google OAuth
- vercel.json, package.json — config

## Environment variables (Vercel → Settings → Environment Variables)
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- SESSION_SECRET — any random string, 30+ characters

## Google OAuth client
- Authorized JavaScript origins: https://<your-site>.vercel.app
- Authorized redirect URIs: https://<your-site>.vercel.app/api/auth/callback
- Audience: Internal
