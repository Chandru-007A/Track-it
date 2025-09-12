# QR Edge Function

GET /qr?id=QR-...

- Returns: { ok: true, data: <track_fittings row> } or { error }
- Env required: SUPABASE_URL, SUPABASE_ANON_KEY

Deploy (from repo root after `supabase link`):

```
supabase functions deploy qr
```

Test:
```
curl "https://<project-ref>.functions.supabase.co/qr?id=QR-EXAMPLE"
```
