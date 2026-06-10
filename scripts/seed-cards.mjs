import { createClient } from '@supabase/supabase-js';
import { existsSync } from 'fs';
import { readFileSync, existsSync } from 'fs'; from 'fs';

function loadEnv() {
  const envPath = new URL('../.env', import.meta.url);
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}
loadEnv();


import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envFile = join(__dirname, '../.env');
  if (!existsSync(envFile)) return;
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}
loadEnv();

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Set VITE_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key);

// Dynamic import of tarot cards
const { tarotCards } = await import(join(__dirname, '../src/data/tarotCards.js'));

const rows = tarotCards.map((card, i) => ({
  id: card.id,
  name: card.name,
  en_name: card.enName || '',
  number: card.number || '',
  suit: card.suit,
  image_url: card.image || `/cards/${card.id}.jpg`,
  upright_kw: card.uprightKw || '',
  reversed_kw: card.reversedKw || '',
  upright_meaning: card.uprightMeaning || '',
  reversed_meaning: card.reversedMeaning || '',
  love_meaning: card.loveMeaning || '',
  career_meaning: card.careerMeaning || '',
  money_meaning: card.moneyMeaning || '',
  study_meaning: card.studyMeaning || '',
  social_meaning: card.socialMeaning || '',
  author_note: card.myNote || '',
  real_expr: card.realExpr || '',
  mistakes: card.mistakes || '',
  tags: card.tags || [],
  sort_order: i,
}));

const { error } = await supabase.from('tarot_cards').upsert(rows, { onConflict: 'id' });
if (error) {
  console.error('Seed failed:', error.message);
  process.exit(1);
}
console.log(`Seeded ${rows.length} cards into tarot_cards`);
