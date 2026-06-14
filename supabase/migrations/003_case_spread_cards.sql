-- Structured spread layout for client cases
alter table cases add column if not exists spread_cards jsonb default '[]'::jsonb;
