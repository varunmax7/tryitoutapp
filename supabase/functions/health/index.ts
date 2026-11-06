import { createClient } from 'npm:@supabase/supabase-js@2';
import { initSentry, Sentry } from '../_shared/sentry.ts';

/**
 * Public health check — implementation.md §19 step 8.
 *
 * A GitHub Actions workflow calls this daily. It touches the database on purpose
 * (public.health_check, migration 0000), so a Supabase Free project never pauses after a
 * quiet week, and it fails loudly when the database or the configuration is wrong.
 *
 * `?selftest=sentry` proves the Sentry pipeline for this environment (Phase 0 acceptance).
 * It refuses to run in production, so the endpoint can't be used to burn the error quota.
 */
initSentry();

const APP_ENV = Deno.env.get('APP_ENV') ?? 'local';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

Deno.serve(async (request: Request) => {
  const url = new URL(request.url);

  if (url.searchParams.get('selftest') === 'sentry') {
    if (APP_ENV === 'production') {
      return json({ error: { code: 'forbidden', message: 'Self-test is disabled here.' } }, 403);
    }
    Sentry.captureException(new Error('Tryitout Sentry test error (edge function)'));
    await Sentry.flush(2000);
    return json({ ok: true, sentry: 'sent' });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: { code: 'misconfigured', message: 'Missing Supabase env.' } }, 500);
  }

  const startedAt = Date.now();
  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });
    const { error } = await supabase.rpc('health_check');
    if (error) throw new Error(error.message);

    return json({
      ok: true,
      env: APP_ENV,
      db: 'reachable',
      ms: Date.now() - startedAt,
      time: new Date().toISOString(),
    });
  } catch (cause) {
    Sentry.captureException(cause);
    await Sentry.flush(2000);
    return json({ error: { code: 'unhealthy', message: 'Database unreachable.' } }, 503);
  }
});
