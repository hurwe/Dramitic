import webpush from 'npm:web-push@3';
import { createClient } from 'npm:@supabase/supabase-js@2';

webpush.setVapidDetails('mailto:you@example.com', Deno.env.get('VAPID_PUBLIC')!, Deno.env.get('VAPID_PRIVATE')!);
const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

Deno.serve(async (req) => {
  const { record } = await req.json();
  const { data: s } = await sb.from('series').select('title,poster_url,banner_url').eq('id', record.series_id).single();
  const payload = JSON.stringify({
    title: 'دراميتك — جديد 🎬',
    body: `${s?.title ?? ''}: الحلقة ${record.ep_number}${record.title ? ' — ' + record.title : ''}`,
    image: s?.banner_url || s?.poster_url,
    tag: 'ep-' + record.id,
    url: './'
  });
  const { data: subs } = await sb.from('push_subs').select('*');
  let sent = 0;
  await Promise.all((subs || []).map(async (x) => {
    try {
      await webpush.sendNotification({ endpoint: x.endpoint, keys: { p256dh: x.p256dh, auth: x.auth } }, payload);
      sent++;
    } catch (err) {
      if (err.statusCode === 404 || err.statusCode === 410) await sb.from('push_subs').delete().eq('endpoint', x.endpoint);
    }
  }));
  return new Response(JSON.stringify({ sent }));
});
