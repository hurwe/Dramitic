create table if not exists push_subs (
  endpoint text primary key,
  p256dh text not null,
  auth text not null,
  visitor_id text,
  created_at timestamptz default now()
);
alter table push_subs enable row level security;

create or replace function save_push_sub(p_endpoint text, p_p256dh text, p_auth text, p_visitor text)
returns void language sql security definer as $$
  insert into push_subs(endpoint,p256dh,auth,visitor_id)
  values (p_endpoint,p_p256dh,p_auth,p_visitor)
  on conflict (endpoint) do update set p256dh=excluded.p256dh, auth=excluded.auth, visitor_id=excluded.visitor_id;
$$;
grant execute on function save_push_sub to anon;
