// Deno Edge Function: GET /qr?id=QR-...
// Returns JSON with fitting details; add simple caching headers.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

function json(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=300, s-maxage=300',
      'access-control-allow-origin': '*',
    },
    ...init,
  });
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method !== 'GET') return json({ error: 'Method not allowed' }, { status: 405 });

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return json({ error: 'Missing id' }, { status: 400 });

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return json({ error: 'Server not configured' }, { status: 500 });
    }
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const { data, error } = await supabase
      .from('track_fittings')
      .select('*')
      .eq('qr_code_qr_id', id)
      .single();
    if (error || !data) return json({ error: 'Not found' }, { status: 404 });

    return json({ ok: true, data });
  } catch (_e) {
    return json({ error: 'Unexpected error' }, { status: 500 });
  }
});


