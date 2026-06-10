import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase.js';
import { tarotCards as seedCards } from '../data/tarotCards.js';
import {
  rowToCard, rowToDraw, rowToCase,
  drawToDb, caseToDb, noteToDb, seedCardToDb,
} from '../lib/dbMappers.js';

const ls = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  remove: (k) => { try { localStorage.removeItem(k); } catch {} },
};

function mergeCards(rows, notes) {
  const noteMap = Object.fromEntries(notes.map(n => [n.card_id, n]));
  return rows.map(r => rowToCard(r, noteMap[r.id] || {}));
}

export function useTarotData(user) {
  const [cards, setCardsState] = useState([]);
  const [draws, setDrawsState] = useState([]);
  const [cases, setCasesState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importOffer, setImportOffer] = useState(false);

  const reload = useCallback(async () => {
    if (!user || !supabase) return;
    setLoading(true);
    try {
      const [cardsRes, notesRes, drawsRes, casesRes] = await Promise.all([
        supabase.from('tarot_cards').select('*').order('sort_order'),
        supabase.from('user_card_notes').select('*').eq('user_id', user.id),
        supabase.from('draws').select('*').eq('user_id', user.id).order('date', { ascending: false }),
        supabase.from('cases').select('*').eq('user_id', user.id).order('date', { ascending: false }),
      ]);
      if (cardsRes.error) throw cardsRes.error;
      let cardRows = cardsRes.data || [];
      if (cardRows.length === 0) {
        cardRows = seedCards.map((c, i) => seedCardToDb(c, i));
      }
      setCardsState(mergeCards(cardRows, notesRes.data || []));
      setDrawsState((drawsRes.data || []).map(rowToDraw));
      setCasesState((casesRes.data || []).map(rowToCase));

      const imported = ls.get('tj_imported', false);
      const hasLocal = ls.get('tj_draws', []).length || ls.get('tj_cases', []).length;
      if (!imported && hasLocal) setImportOffer(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { reload(); }, [reload]);

  const setCards = useCallback((updater) => {
    setCardsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (!user || !supabase) return next;
      next.forEach(card => {
        const old = prev.find(c => c.id === card.id);
        if (!old) return;
        const changed = card.myNote !== old.myNote || card.realExpr !== old.realExpr || card.mistakes !== old.mistakes;
        if (changed) {
          supabase.from('user_card_notes').upsert(
            noteToDb(card, user.id, card.id),
            { onConflict: 'user_id,card_id' }
          ).then(({ error }) => { if (error) console.error(error); });
        }
      });
      return next;
    });
  }, [user]);

  const setDraws = useCallback((updater) => {
    setDrawsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (!user || !supabase) return next;
      const prevIds = new Set(prev.map(d => d.id));
      const nextIds = new Set(next.map(d => d.id));
      prev.filter(d => !nextIds.has(d.id)).forEach(d => {
        if (String(d.id).includes("-")) supabase.from('draws').delete().eq('id', d.id).then(({ error }) => { if (error) console.error(error); });
      });
      next.forEach(d => {
        const payload = { ...drawToDb(d, user.id) };
        if (prevIds.has(d.id) && String(d.id).includes("-")) {
          supabase.from('draws').update(payload).eq('id', d.id).then(({ error }) => { if (error) console.error(error); });
        } else if (!prevIds.has(d.id) || !String(d.id).includes("-")) {
          const { user_id, ...rest } = payload;
          supabase.from('draws').insert({ ...rest, user_id }).select().single()
            .then(({ data, error }) => {
              if (error) console.error(error);
              else if (data) setDrawsState(p => p.map(x => x.id === d.id ? rowToDraw(data) : x));
            });
        }
      });
      return next;
    });
  }, [user]);

  const setCases = useCallback((updater) => {
    setCasesState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (!user || !supabase) return next;
      const prevIds = new Set(prev.map(c => c.id));
      const nextIds = new Set(next.map(c => c.id));
      prev.filter(c => !nextIds.has(c.id)).forEach(c => {
        if (String(c.id).includes("-")) supabase.from('cases').delete().eq('id', c.id).then(({ error }) => { if (error) console.error(error); });
      });
      next.forEach(c => {
        const payload = { ...caseToDb(c, user.id) };
        if (prevIds.has(c.id) && String(c.id).includes("-")) {
          supabase.from('cases').update(payload).eq('id', c.id).then(({ error }) => { if (error) console.error(error); });
        } else if (!prevIds.has(c.id) || !String(c.id).includes("-")) {
          const { user_id, ...rest } = payload;
          supabase.from('cases').insert({ ...rest, user_id }).select().single()
            .then(({ data, error }) => {
              if (error) console.error(error);
              else if (data) setCasesState(p => p.map(x => x.id === c.id ? rowToCase(data) : x));
            });
        }
      });
      return next;
    });
  }, [user]);

  const importLocalData = useCallback(async () => {
    if (!user || !supabase) return;
    const localDraws = ls.get('tj_draws', []);
    const localCases = ls.get('tj_cases', []);
    const localCards = ls.get('tj_cards', []);
    const nameToId = Object.fromEntries(cards.map(c => [c.name, c.id]));
    localCards.forEach(lc => {
      const cardId = nameToId[lc.name];
      if (cardId && (lc.myNote || lc.realExpr || lc.mistakes)) {
        supabase.from('user_card_notes').upsert(
          noteToDb({ myNote: lc.myNote, realExpr: lc.realExpr, mistakes: lc.mistakes }, user.id, cardId),
          { onConflict: 'user_id,card_id' }
        );
      }
    });
    for (const d of localDraws) {
      const cardId = nameToId[cards.find(c => c.id === d.cardId)?.name] || cards.find(c => c.id === d.cardId)?.id
        || (() => { const old = localCards.find(c => c.id === d.cardId); return old ? nameToId[old.name] : null; })();
      if (!cardId) continue;
      await supabase.from('draws').insert({ ...drawToDb({ ...d, cardId }, user.id) });
    }
    for (const c of localCases) {
      const cardIds = (c.cardIds || []).map(id => {
        const lc = localCards.find(x => x.id === id);
        return lc ? nameToId[lc.name] : id;
      }).filter(Boolean);
      await supabase.from('cases').insert({ ...caseToDb({ ...c, cardIds }, user.id) });
    }
    ls.set('tj_imported', true);
    ls.remove('tj_draws');
    ls.remove('tj_cases');
    ls.remove('tj_cards');
    setImportOffer(false);
    await reload();
  }, [user, cards, reload]);

  const dismissImport = useCallback(() => {
    ls.set('tj_imported', true);
    setImportOffer(false);
  }, []);

  return useMemo(() => ({
    cards, draws, cases, setCards, setDraws, setCases,
    loading, importOffer, importLocalData, dismissImport, reload,
  }), [cards, draws, cases, setCards, setDraws, setCases, loading, importOffer, importLocalData, dismissImport, reload]);
}
